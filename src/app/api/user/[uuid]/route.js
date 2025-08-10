// /api/user/[uuid]/route.js (GET)
import { prisma } from "@/libs/prisma";

export const GET = async (req, { params }) => {
  const { uuid } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: uuid },
      select: {
        username: true,
        profilePicture: true,
        members: {
          where: {
            watchlist: {
              isPublic: true,
            },
          },
          include: {
            watchlist: {
              include: {
                items: {
                  include: {
                    movie: {
                      select: {
                        posterPath: true,
                        title: true,
                      },
                    },
                  },
                },
                members: {
                  include: {
                    user: {
                      select: {
                        username: true,
                        profilePicture: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
