import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithOAuth,
} from "@/services/auth-service";

export async function POST(request) {
  try {
    const { action, email, password, username, provider } =
      await request.json();

    if (action === "signUp") {
      const { user } = await signUpWithEmail(email, password);

      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          username,
        },
      });

      return NextResponse.json({ message: "Signup successful!" });
    }

    if (action === "signIn") {
      const { user } = await signInWithEmail(email, password);
      return NextResponse.json({ message: "Signin successful!", user });
    }

    if (action === "oauth") {
      const { user } = await signInWithOAuth(provider);

      return NextResponse.json({
        message: `OAuth with ${provider} successful!`,
        user,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
