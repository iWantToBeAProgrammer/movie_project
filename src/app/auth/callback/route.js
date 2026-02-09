import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";

function buildPopupCloseHtml(redirectUrl) {
  return `
    <html>
      <head>
        <title>Authenticating...</title>
        <script>
          if (window.opener) {
            window.opener.location.href = "${redirectUrl}";
            window.close();
          } else {
            window.location.href = "${redirectUrl}";
          }
        </script>
      </head>
      <body>
        <p>Authentication successful. Redirecting...</p>
      </body>
    </html>
  `;
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    const user = data?.session?.user;

    if (!error && user) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            username: user.user_metadata.full_name || user.email.split("@")[0],
            profilePicture: user.user_metadata.avatar_url.replace(
              /=s\d+-c/,
              "=s256-c",
            ),
          },
        });
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      const redirectUrl = isLocalEnv
        ? `${origin}${next}`
        : forwardedHost
          ? `https://${forwardedHost}${next}`
          : `${origin}${next}`;

      return new Response(buildPopupCloseHtml(redirectUrl), {
        headers: { "Content-Type": "text/html" },
      });
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
