import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME, getAccessCookieOptions } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE_NAME, "", {
    ...getAccessCookieOptions(),
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
