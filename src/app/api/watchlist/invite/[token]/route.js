import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const token = await params.token;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { origin } = new URL(request.url);

  if (!user) {
    return NextResponse.redirect(
      `${origin}/auth/signin?next=/watchlist/invite/${token}`,
    );
  }

  // Find watchlist with matching token
  const watchlist = await prisma.watchlist.findUnique({
    where: { inviteToken: token },
  });

  if (!watchlist) {
    return NextResponse.redirect(`${origin}/404`); // or a custom error page
  }

  if (watchlist.userId === user.id) {
    return NextResponse.redirect(
      `${origin}/watchlist/${watchlist.token}?joined=true`,
    );
  }

  // Check if user already in watchlist
  const exists = await prisma.watchlistMember.findFirst({
    where: {
      watchlistId: watchlist.id,
      userId: user.id,
    },
  });

  if (!exists) {
    await prisma.watchlistMember.create({
      data: {
        userId: user.id,
        watchlistId: watchlist.id,
      },
    });
  }

  return NextResponse.redirect(
    `${origin}/watchlist/${watchlist.token}?joined=true`,
  );
}
