import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";
import { NextResponse } from "next/server";
export async function DELETE(req, { params }) {
  const supabase = await createClient(); // your session logic
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token, movieId } = params;

  if (!token || !movieId) {
    return NextResponse.json(
      { error: "Token and Movie ID are required" },
      { status: 400 },
    );
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
  const watchlistId = watchlist.id;

  const isOwnerOrCollaborator = watchlist.members.some(
    (member) =>
      member.userId === user.id &&
      (member.role === "OWNER" || member.role === "COLLABORATOR"),
  );

  if (!isOwnerOrCollaborator) {
    return NextResponse.json(
      { error: "You are not authorized to remove items from this watchlist" },
      { status: 403 },
    );
  }

  // Proceed with removing the item

  await prisma.watchlistItem.deleteMany({
    where: {
      watchlistId: Number(watchlistId),
      movieId: Number(movieId),
    },
  });

  return NextResponse.json({ success: true });
}
