import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { token } = params;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUserId = data.user.id;

  const member = await prisma.watchlistMember.findFirst({
    where: {
      userId: currentUserId,
      watchlist: { token },
    },
  });

  if (!member) {
    return NextResponse.json(
      { error: "Not a member of this watchlist." },
      { status: 404 },
    );
  }

  if (member.role === "OWNER") {
    return NextResponse.json(
      { error: "Owner cannot leave the watchlist." },
      { status: 403 },
    );
  }

  await prisma.watchlistMember.delete({
    where: {
      id: member.id,
    },
  });

  return NextResponse.json({ message: "Left the watchlist successfully." });
}
