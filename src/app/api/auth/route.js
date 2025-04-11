"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import {
  signUpWithEmail,
  signInWithEmail,
  resendEmailVerification,
  signInWithGoogle,
} from "@/services/auth-service";
import { redirect } from "next/navigation";

export async function POST(request) {
  try {
    const { action, email, password, provider } = await request.json();

    if (action === "signUp") {
      const { user, error } = await signUpWithEmail(email, password);
      if (error) throw new Error(error.message);

      return NextResponse.json({
        message:
          "Signup successful! Please verify your email before continuing.",
        user: { email: user.email, id: user.id },
        verification_status: "verification_required",
      });
    }

    if (action === "signIn") {
      const { user, error } = await signInWithEmail(email, password);
      if (error) throw new Error(error.message);

      if (!user.email_confirmed_at) {
        return NextResponse.json(
          {
            message: "Please verify your email before signing in",
            verification_status: "verification_required",
            email: user.email,
          },
          { status: 200 },
        );
      }

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

      return NextResponse.json({
        message: "Signin successful!",
        user: user,
        verification_status: "verified",
      });
    }

    if (action === "google") {
      const { data, error } = await signInWithGoogle();
      if (error) throw new Error(error.message);

      if (error) {
        console.error("OAuth error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (data?.url) {
        return new Response(JSON.stringify({ url: data.url }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return NextResponse.json(
        { error: "No redirect URL found" },
        { status: 400 },
      );
    }

    if (action === "resendEmail") {
      try {
        const { error } = await resendEmailVerification(email);
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
          message: "Verification email resent. Please check your inbox.",
        });
      } catch (error) {
        console.error(error);
        return NextResponse.json(
          {
            error: "An error occurred while resending the verification email.",
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
