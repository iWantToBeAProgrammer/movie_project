import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithOAuth,
  resendEmailVerification,
} from "@/services/auth-service";

export async function POST(request) {
  try {
    const { action, email, password, username, provider } =
      await request.json();

    if (action === "signUp") {
      const { user, error } = await signUpWithEmail(email, password);
      if (error) throw new Error(error.message);

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (!existingUser) {
        const username = email.substring(0, email.indexOf("@"));

        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            username: username,
          },
        });
      } else {
        throw new Error("User Already Registered");
      }

      return NextResponse.json({ message: "Signup successful!", user: user });
    }

    if (action === "signIn") {
      const { user, error } = await signInWithEmail(email, password);
      if (error) throw new Error(error.message);

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (!existingUser) {
        const username = email.substring(0, email.indexOf("@"));

        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            username: username,
          },
        });
      }

      return NextResponse.json({ message: "Signin successful!", user: user });
    }

    if (action === "oauth") {
      const { user, error } = await signInWithOAuth(provider);
      if (error) throw new Error(error.message);

      return NextResponse.json({
        message: `OAuth with ${provider} successful!`,
        user: user,
      });
    }

    if (action === "resendEmail") {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        const now = new Date();
        if (
          user.last_email_sent_at &&
          now - new Date(user.last_email_sent_at) < 60000
        ) {
          return NextResponse.json(
            { error: "You can only resend verification email after 1 minute." },
            { status: 429 }
          );
        }

        await prisma.user.update({
          where: { email },
          data: { last_email_sent_at: now },
        });

        const { error } = await resendEmailVerification(email);
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Verification email resent." });
      } catch (error) {
        console.error(error);
        return NextResponse.json(
          {
            error: "An error occurred while resending the verification email.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
