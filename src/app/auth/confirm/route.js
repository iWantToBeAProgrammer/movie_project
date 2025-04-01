import { createClient } from "@/libs/supabaseServer";
import { redirect } from "next/navigation";
import { prisma } from "@/libs/prisma";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") || null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error && data?.user) {
      const user = data.user;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        const username = user.email.substring(0, user.email.indexOf("@"));

        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            username: username,
          },
        });
      }

      redirect(next);
    }
  }

  redirect("/error");
}
