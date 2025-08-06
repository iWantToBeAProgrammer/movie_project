import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userId } = params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      profilePicture: true,
    },
  });

  return NextResponse.json(user);
}
