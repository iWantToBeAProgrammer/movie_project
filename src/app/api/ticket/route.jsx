/* src/app/api/ticket/route.jsx */
import { generateTicketImage } from "@/components/TicketTemplates";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req) {
  try {
    const { theme, movies } = await req.json();

    if (!movies || movies.length === 0) {
      return new Response("No movies selected", { status: 400 });
    }

    return generateTicketImage(theme, movies);
  } catch (error) {
    console.error(error);
    return new Response(`Failed to generate ticket: ${error.message}`, {
      status: 500,
    });
  }
}
