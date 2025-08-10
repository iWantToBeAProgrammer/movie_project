import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { token } = params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const watchlist = await prisma.watchlist.findUnique({
    where: { token },
    include: {
      members: true, // to check if user is owner/collaborator
    },
  });

  if (!watchlist) {
    return NextResponse.json({ error: "Watchlist not found" }, { status: 404 });
  }

  const isOwnerOrCollaborator = watchlist.members.some(
    (member) =>
      member.userId === user.id &&
      (member.role === "OWNER" || member.role === "COLLABORATOR"),
  );

  if (isOwnerOrCollaborator) {
    return NextResponse.json(
      { error: "You cannot save your own watchlist" },
      { status: 400 },
    );
  }

  // ✅ Proceed with saving
  await prisma.savedWatchlist.upsert({
    where: {
      userId_watchlistId: {
        userId: user.id,
        watchlistId: watchlist.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      watchlistId: watchlist.id,
    },
  });

  return NextResponse.json({ message: "Watchlist saved" });
}

export async function DELETE(req, { params }) {
  const { token } = params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const watchlist = await prisma.watchlist.findUnique({
    where: { token },
  });

  if (!watchlist) {
    return NextResponse.json({ error: "Watchlist not found" }, { status: 404 });
  }

  await prisma.savedWatchlist.deleteMany({
    where: {
      userId: user.id,
      watchlistId: watchlist.id,
    },
  });

  return NextResponse.json({ message: "Watchlist unsaved" });
}
