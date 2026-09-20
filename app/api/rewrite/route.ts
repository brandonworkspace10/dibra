import { generateText } from "ai";
import { NextResponse } from "next/server";
import {
  buildEducationalPrompt,
  rewriteRequestSchema,
} from "@/lib/ai/educational-rewriter";
import { hasStudyAccess } from "@/lib/auth";

const DEFAULT_MODEL = "google/gemini-2.5-flash-lite";

function hasGatewayAuthentication() {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN
  );
}

function createGenerationErrorResponse(error: unknown) {
  if (error instanceof Error && error.name === "GatewayAuthenticationError") {
    return NextResponse.json(
      {
        error:
          "AI Gateway is not connected. On localhost, add AI_GATEWAY_API_KEY and restart the app.",
      },
      { status: 503 }
    );
  }

  if (error instanceof Error && error.name === "GatewayRateLimitError") {
    return NextResponse.json(
      { error: "The AI service is busy. Wait a moment and try again." },
      { status: 429 }
    );
  }

  if (
    error instanceof Error &&
    error.message.includes("Free tier users do not have access")
  ) {
    return NextResponse.json(
      {
        error:
          "This model needs paid Gateway credits. Use google/gemini-2.5-flash-lite or add credits.",
      },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { error: "The rewriter is unavailable right now. Please try again." },
    { status: 500 }
  );
}

export async function POST(request: Request) {
  try {
    if (!(await hasStudyAccess())) {
      return NextResponse.json(
        { error: "Unlock the app before using the rewriter." },
        { status: 401 }
      );
    }

    if (!hasGatewayAuthentication()) {
      return NextResponse.json(
        {
          error:
            "AI Gateway is not connected. On localhost, add AI_GATEWAY_API_KEY and restart the app.",
        },
        { status: 503 }
      );
    }

    const body: unknown = await request.json();
    const parsed = rewriteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Check your text and options, then try again.",
        },
        { status: 400 }
      );
    }

    const { prompt, system } = buildEducationalPrompt(parsed.data);
    const result = await generateText({
      abortSignal: request.signal,
      maxOutputTokens: 1400,
      maxRetries: 0,
      model: process.env.AI_MODEL ?? DEFAULT_MODEL,
      prompt,
      system,
      temperature: 0.45,
      timeout: 45_000,
    });

    return new Response(result.text, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Rewrite request failed", error);

    return createGenerationErrorResponse(error);
  }
}
