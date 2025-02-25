import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const watchlists = await prisma.watchlist.findMany({
      where: { userId: user.id },
      include: { items: true },
    });

    return NextResponse.json({ watchlists });
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
    const watchlistId = formData.get("watchlistId") || null;
    const name = formData.get("name");
    const description = formData.get("description") || null;
    const movieId = parseInt(formData.get("movieId"), 10) || null;
    const picture = formData.get("picture");

    let imageUrl = null;

    if (picture) {
      const fileExt = picture.name.split(".").pop();
      const filePath = `watchlists/${user.id}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("watchlist-pictures")
        .upload(filePath, picture, {
          cacheControl: "3600",
          upsert: false,
          contentType: picture.type,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }

      const { data: publicURLData } = await supabase.storage
        .from("watchlist-pictures")
        .getPublicUrl(filePath);

      imageUrl = publicURLData.publicUrl;
    }

    if (!watchlistId && !movieId) {
      const newWatchlist = await prisma.watchlist.create({
        data: {
          userId: user.id,
          name,
          description,
          picture: imageUrl,
        },
      });

      return NextResponse.json({
        message: "New empty watchlist created",
        watchlist: newWatchlist,
      });
    }

    let selectedWatchlistId = watchlistId;

    if (!watchlistId) {
      const newWatchlist = await prisma.watchlist.create({
        data: {
          userId: user.id,
          name,
          description,
          picture: imageUrl,
        },
      });

      selectedWatchlistId = newWatchlist.id;
    } else {
      const existingWatchlist = await prisma.watchlist.findFirst({
        where: { id: watchlistId, userId: user.id },
      });

      if (!existingWatchlist) {
        return NextResponse.json(
          { error: "Invalid watchlist ID" },
          { status: 403 }
        );
      }
    }

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    await prisma.watchlistItem.create({
      data: {
        watchlistId: selectedWatchlistId,
        movieId,
      },
    });

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

    const { id, name, description, picture } = await req.json();

    const updatedWatchlist = await prisma.watchlist.update({
      where: { id, userId: user.id },
      data: { name, description, picture },
    });

    return NextResponse.json({ watchlist: updatedWatchlist }, { status: 200 });
  } catch (error) {
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

    await prisma.watchlist.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json(
      { message: "Watchlist deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
