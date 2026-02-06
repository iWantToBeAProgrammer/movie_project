import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";
import { getMovieDetails } from "@/services/movie-service";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const supabase = await createClient();

    if (!token) {
      return NextResponse.json({ error: "token is required" }, { status: 400 });
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const watchlist = await prisma.watchlist.findUnique({
      where: { token },
      include: {
        members: {
          select: {
            user: true,
            role: true,
            userId: true,
          },
        },
        items: {
          select: {
            movie: {
              include: {
                watchedMovies: {
                  select: { id: true },
                },
                favoriteMovies: {
                  select: { id: true },
                },
              },
            },
          },
        },
        SavedWatchlist: {
          where: {
            userId: data.user.id,
          },
        },
      },
    });

    if (!watchlist) {
      return NextResponse.json(
        { error: "Watchlist not found" },
        { status: 404 },
      );
    }

    const { members, items, SavedWatchlist, ...rest } = watchlist;

    const membersById = members.find(
      (member) => member.userId === data?.user?.id,
    );
    const role = membersById?.role;
    const isSaved = SavedWatchlist.length > 0;
    const enrichedItems = items.map((item) => {
      const movie = item.movie;
      return {
        ...movie,
        isWatched: movie.watchedMovies.length > 0,
        isFavorite: movie.favoriteMovies.length > 0,
      };
    });

    return NextResponse.json({
      ...rest,
      members,
      items: enrichedItems,
      userRole: role,
      saved: isSaved,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const watchlistId = formData.get("watchlistId")
      ? parseInt(formData.get("watchlistId"), 10)
      : null;
    const name = formData.get("name");
    const description = formData.get("description") || null;
    const rawMovieId = formData.get("movieId");
    const movieId = rawMovieId ? parseInt(rawMovieId, 10) : null;
    const picture = formData.get("picture");
    const inviteToken = nanoid(16);

    console.log(formData);

    let imageUrl = null;

    // Handle picture upload
    if (picture instanceof File) {
      const fileExt = picture.name.split(".").pop();
      const filePath = `watchlists/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("watchlist-pictures")
        .upload(filePath, picture, {
          cacheControl: "3600",
          upsert: false,
          contentType: picture.type,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 },
        );
      }

      const { data: publicURLData } = await supabase.storage
        .from("watchlist-pictures")
        .getPublicUrl(filePath);

      imageUrl = publicURLData.publicUrl;
    }

    let finalMovieId = movieId;

    // Create a new watchlist if no watchlistId and no movieId are provided
    if (!watchlistId && !movieId) {
      const tmdbId = formData.get("tmdbId");
      if (!tmdbId) {
        const newWatchlist = await prisma.watchlist.create({
          data: {
            name,
            token: nanoid(16),
            description,
            picture: imageUrl,
            inviteToken,
          },
        });

        await prisma.watchlistMember.create({
          data: {
            watchlistId: newWatchlist.id,
            userId: user.id,
            role: "OWNER",
          },
        });

        return NextResponse.json({
          message: "New empty watchlist created",
          watchlist: newWatchlist,
        });
      }

      const movie = await getMovieDetails(tmdbId);
      finalMovieId = movie.id;
    }

    let selectedWatchlistId = watchlistId;

    // Handle creating or validating an existing watchlist
    if (!watchlistId) {
      const newWatchlist = await prisma.watchlist.create({
        data: {
          name,
          token: nanoid(16),
          description,
          picture: imageUrl,
          inviteToken,
        },
      });
      selectedWatchlistId = newWatchlist.id;
    } else {
      const existingWatchlist = await prisma.watchlistMember.findFirst({
        where: { userId: user.id, watchlistId: parseInt(watchlistId) },
      });
      if (!existingWatchlist)
        return NextResponse.json(
          { error: "Invalid watchlist ID" },
          { status: 403 },
        );

      if (existingWatchlist.role === "VIEWER")
        return NextResponse.json(
          { error: "You're not allowed adding movie to this watchlist" },
          { status: 500 },
        );
    }

    // Handle adding movie logic
    if (!finalMovieId) {
      const tmdbId = formData.get("tmdbId");
      if (!tmdbId)
        return NextResponse.json(
          { error: "Either movieId or tmdbId is required" },
          { status: 400 },
        );

      const movie = await getMovieDetails(tmdbId);
      finalMovieId = movie.id;
    }

    // Check if movie already exists in the watchlist
    const existingItem = await prisma.watchlistItem.findUnique({
      where: {
        watchlistId_movieId: {
          watchlistId: selectedWatchlistId,
          movieId: finalMovieId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: "Movie is already in the watchlist" },
        { status: 400 },
      );
    }

    // Add movie to the watchlist
    await prisma.watchlistItem.create({
      data: { watchlistId: selectedWatchlistId, movieId: finalMovieId },
    });

    const existingMembership = await prisma.watchlistMember.findFirst({
      where: {
        userId: user.id,
        watchlistId: selectedWatchlistId,
      },
    });

    if (!existingMembership) {
      await prisma.watchlistMember.create({
        data: {
          watchlistId: selectedWatchlistId,
          userId: user.id,
          role: "OWNER", // or COLLABORATOR if applicable
        },
      });
    }

    return NextResponse.json({
      message: watchlistId
        ? "Movie added to existing watchlist"
        : "New watchlist created and movie added",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export async function PUT(req) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");
    const picture = formData.get("picture");

    if (!id) {
      return NextResponse.json(
        { error: "Watchlist ID is required" },
        { status: 400 },
      );
    }

    const membership = await prisma.watchlistMember.findFirst({
      where: {
        watchlistId: parseInt(id),
        userId: user.id,
        role: "OWNER",
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let imageUrl = undefined;

    if (picture instanceof File) {
      const fileExt = picture.name.split(".").pop();
      const filePath = `watchlists/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("watchlist-pictures")
        .upload(filePath, picture, { upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicURLData } = supabase.storage
        .from("watchlist-pictures")
        .getPublicUrl(filePath);

      imageUrl = publicURLData.publicUrl;
    }

    const updatedWatchlist = await prisma.watchlist.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        ...(imageUrl && { picture: imageUrl }),
      },
    });

    return NextResponse.json({ watchlist: updatedWatchlist }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();

    const membership = await prisma.watchlistMember.findFirst({
      where: {
        watchlistId: parseInt(id),
        userId: user.id,
        role: "OWNER",
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not the owner of this watchlist" },
        { status: 403 },
      );
    }

    await prisma.watchlist.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(
      { message: "Watchlist deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const watchlist = await prisma.watchlist.findUnique({
    where: {
      token: token,
    },
  });

  if (!watchlist) {
    return NextResponse.json({ error: "Watchlist not found" }, { status: 400 });
  }

  const member = await prisma.watchlistMember.findFirst({
    where: {
      watchlistId: watchlist.id,
      userId: user.id,
    },
  });

  if (!member || member.role !== "OWNER") {
    return NextResponse.json(
      { error: "Forbidden: you must be the owner" },
      { status: 403 },
    );
  }

  const { isPublic } = await req.json();

  if (isPublic === null) {
    return NextResponse.json(
      { error: "Invalid update field" },
      { status: 400 },
    );
  }

  const updated = await prisma.watchlist.update({
    where: { token },
    data: {
      isPublic,
    },
  });

  const privacyValue = updated.isPublic ? "public" : "private";
  return NextResponse.json({
    watchlist: updated,
    message: `Watchlist has been made to ${privacyValue}`,
  });
}
