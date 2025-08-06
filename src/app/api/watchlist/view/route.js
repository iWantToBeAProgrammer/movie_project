const { prisma } = require("@/libs/prisma");
const { createClient } = require("@/libs/supabaseServer");
const { NextResponse } = require("next/server");

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const inviteToken = searchParams.get("inviteToken");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const watchlist = await prisma.watchlist.findUnique({
    where: { token },
    include: {
      items: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!watchlist) {
    return NextResponse.json({ error: "Watchlist not found" }, { status: 404 });
  }

  // === Access Control ===

  const isOwnerOrMember =
    user && watchlist.members.some((m) => m.userId === user.id);

  const isInviteTokenMatch =
    inviteToken && inviteToken === watchlist.inviteToken;

  if (!watchlist.isPublic && !isOwnerOrMember && !isInviteTokenMatch) {
    return NextResponse.json(
      { error: "You do not have access to this watchlist" },
      { status: 403 },
    );
  }

  // === Optionally: auto-add invited user as member ===
  if (isInviteTokenMatch && user) {
    const alreadyMember = await prisma.watchlistMember.findFirst({
      where: {
        userId: user.id,
        watchlistId: watchlist.id,
      },
    });

    if (!alreadyMember) {
      await prisma.watchlistMember.create({
        data: {
          userId: user.id,
          watchlistId: watchlist.id,
          role: "VIEWER",
        },
      });
    }
  }
  const redirectUrl = new URL(`/watchlist/${watchlist.token}`, req.url);
  return NextResponse.redirect(redirectUrl);
}
