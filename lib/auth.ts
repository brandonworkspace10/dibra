import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ACCESS_COOKIE_NAME = "clear-draft-access";

const SESSION_VALUE = "private-study-rewriter-v1";
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

function getRequiredEnvironmentValue(name: "APP_PASSCODE" | "AUTH_SECRET") {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function createDigest(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function isPasscodeValid(candidate: string) {
  const configuredPasscode = getRequiredEnvironmentValue("APP_PASSCODE");
  const comparisonSecret = getRequiredEnvironmentValue("AUTH_SECRET");

  return safeEqual(
    createDigest(candidate, comparisonSecret),
    createDigest(configuredPasscode, comparisonSecret)
  );
}

export function getAccessToken() {
  const passcode = getRequiredEnvironmentValue("APP_PASSCODE");

  return createDigest(
    `${SESSION_VALUE}:${passcode}`,
    getRequiredEnvironmentValue("AUTH_SECRET")
  );
}

export async function hasStudyAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;

  return token ? safeEqual(token, getAccessToken()) : false;
}

export function getAccessCookieOptions() {
  return {
    httpOnly: true,
    maxAge: THIRTY_DAYS_IN_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}
