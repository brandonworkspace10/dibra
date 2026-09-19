import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ACCESS_COOKIE_NAME,
  getAccessCookieOptions,
  getAccessToken,
  isPasscodeValid,
} from "@/lib/auth";

const unlockSchema = z.object({
  passcode: z.string().trim().min(1).max(128),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = unlockSchema.safeParse(body);

    if (!(parsed.success && isPasscodeValid(parsed.data.passcode))) {
      return NextResponse.json(
        { error: "That passcode is not correct. Try again." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(
      ACCESS_COOKIE_NAME,
      getAccessToken(),
      getAccessCookieOptions()
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("APP_PASSCODE") ||
        error.message.includes("AUTH_SECRET"))
    ) {
      return NextResponse.json(
        { error: "The app owner still needs to finish setup." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "We could not unlock the app. Please try again." },
      { status: 400 }
    );
  }
}
