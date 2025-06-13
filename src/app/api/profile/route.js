const { prisma } = require("@/libs/prisma");
const { createClient } = require("@/libs/supabaseServer");
const { NextResponse } = require("next/server");

export const GET = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = data.user.id;

    const userData = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        profilePicture: true,
        username: true,
        email: true,
      },
    });

    const ownerWatchlist = await prisma.watchlist.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            movie: {
              select: {
                posterPath: true,
              },
            },
          },
        },
      },
    });

    const collaborativeWatchlist = await prisma.watchlistCollaborator.findMany({
      select: {
        role: true,
        watchlist: {
          select: {
            items: {
              select: {
                movie: {
                  select: {
                    posterPath: true,
                  },
                },
              },
            },
            name: true,
            description: true,
            token: true,
            picture: true,
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
      where: {
        userId: userId,
      },
    });

    const formattedCollaborative = collaborativeWatchlist.map((collab) => ({
      ...collab.watchlist,
      role: collab.role, // add role info if needed
      isCollaborator: true, // flag to differentiate
    }));

    console.log(formattedCollaborative);

    // Combine both arrays
    const watchlists = [...ownerWatchlist, ...formattedCollaborative];

    const watchedMovies = await prisma.watchedMovie.findMany({
      select: {
        movie: true,
      },
      where: {
        userId: userId,
      },
    });

    const favoriteMovies = await prisma.favoriteMovie.findMany({
      select: {
        movie: true,
      },
      where: {
        userId: userId,
      },
    });

    return NextResponse.json({
      profile: {
        watchlists,
        watchedMovies,
        favoriteMovies,
      },

      user: userData,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PUT = async (req) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  const user = data?.user;

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const username = formData.get("username");
  const file = formData.get("profilePicture");

  let imageUrl = null;

  if (file && typeof file === "object") {
    const fileExt = file.name.split(".").pop();

    const filePath = `profile/${user.id}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("user-avatar") // adjust to your bucket name
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError }, { status: 500 });
    }

    const { data: urlData } = await supabase.storage
      .from("user-avatar")
      .getPublicUrl(filePath);

    imageUrl = urlData.publicUrl;
  }

  const { error: updateError } = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      username,
      ...(imageUrl && { profilePicture: imageUrl }),
    },
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, imageUrl });
};
