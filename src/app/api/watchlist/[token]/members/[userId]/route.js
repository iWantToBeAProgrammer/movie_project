import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { token, userId } = params;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUserId = data.user.id;

  const ownerCheck = await prisma.watchlistMember.findFirst({
    where: {
      userId: currentUserId,
      role: "OWNER",
      watchlist: { token },
    },
  });

  if (!ownerCheck) {
    return NextResponse.json(
      { error: "Only the owner can remove members." },
      { status: 403 },
    );
  }

  await prisma.watchlistMember.deleteMany({
    where: {
      userId,
      watchlist: { token },
      NOT: { role: "OWNER" }, // prevent owner from deleting themselves or another owner
    },
  });

  return NextResponse.json({ message: "Member removed successfully." });
}
