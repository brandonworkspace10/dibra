import { streamText } from "ai";
import { NextResponse } from "next/server";
import {
  buildEducationalPrompt,
  rewriteRequestSchema,
} from "@/lib/ai/educational-rewriter";
import { hasStudyAccess } from "@/lib/auth";

export const runtime = "nodejs";

const DEFAULT_MODEL = "google/gemini-3.5-flash-lite";

export async function POST(request: Request) {
  try {
    if (!(await hasStudyAccess())) {
      return NextResponse.json(
        { error: "Unlock the app before using the rewriter." },
        { status: 401 }
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
    const result = streamText({
      abortSignal: request.signal,
      maxOutputTokens: 1400,
      maxRetries: 0,
      model: process.env.AI_MODEL ?? DEFAULT_MODEL,
      prompt,
      system,
      temperature: 0.45,
      timeout: 45_000,
    });

    return result.toTextStreamResponse({
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Rewrite request failed", error);

    return NextResponse.json(
      { error: "The rewriter is unavailable right now. Please try again." },
      { status: 500 }
    );
  }
}
