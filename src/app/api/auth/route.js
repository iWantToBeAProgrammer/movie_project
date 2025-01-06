import { NextResponse } from "next/server";
const authService = require("@/services/auth-service");

export async function POST(req) {
  try {
    const { action, email, password, provider } = await req.json();

    let data;

    switch (action) {
      case "signUp":
        if (!email || !password) throw new Error("Email and password are required.");
        data = await authService.signUpWithEmail(email, password);
        break;

      case "signIn":
        if (!email || !password) throw new Error("Email and password are required.");
        data = await authService.signInWithEmail(email, password);
        break;

      case "signInWithOAuth":
        if (!provider) throw new Error("Provider is required.");
        data = await authService.signInWithOAuth(provider);
        break;

      case "signOut":
        await authService.signOut();
        data = { message: "Signed out successfully." };
        break;

      default:
        throw new Error("Invalid action.");
    }

    return NextResponse.json({ message: "Success", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req) {
  try {
    const user = await authService.getUser();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
