"use client";

import {
  ArrowRight,
  Check,
  Clipboard,
  Lightbulb,
  LockKeyhole,
  RefreshCw,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BrandMark, BrandWordmark } from "@/components/brand";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  type GradeLevel,
  gradeLevels,
  MAX_SOURCE_CHARACTERS,
  type RewriteMode,
  rewriteModes,
  type Subject,
  subjects,
} from "@/lib/ai/educational-rewriter";

const modeDetails: Record<RewriteMode, { label: string; shortLabel: string }> =
  {
    explain: { label: "Explain the ideas", shortLabel: "Explain" },
    rewrite: { label: "Rewrite naturally", shortLabel: "Rewrite" },
    simplify: { label: "Make it simpler", shortLabel: "Simplify" },
  };

const gradeItems = gradeLevels.map((grade) => ({
  label: `Grade ${grade}`,
  value: grade,
}));

const subjectItems = subjects.map((subject) => ({
  label: subject,
  value: subject,
}));

async function readRewriteResponse(
  response: Response,
  onChunk: (text: string) => void
) {
  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? "The rewrite could not be completed.");
  }

  if (!response.body) {
    throw new Error("The rewrite came back empty. Please try again.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let completedText = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    completedText += decoder.decode(value, { stream: true });
    onChunk(completedText);
  }

  completedText += decoder.decode();

  if (!completedText.trim()) {
    throw new Error("The rewrite came back empty. Please try again.");
  }

  return completedText;
}

export function RewriterWorkspace() {
  const router = useRouter();
  const abortController = useRef<AbortController | null>(null);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("10");
  const [subject, setSubject] = useState<Subject>("English");
  const [mode, setMode] = useState<RewriteMode>("rewrite");
  const [sourceText, setSourceText] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const canGenerate =
    sourceText.trim().length >= 20 &&
    sourceText.length <= MAX_SOURCE_CHARACTERS &&
    !isGenerating;

  async function generateRewrite() {
    if (!canGenerate) {
      return;
    }

    abortController.current?.abort();
    const controller = new AbortController();
    abortController.current = controller;
    setError("");
    setOutput("");
    setIsCopied(false);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/rewrite", {
        body: JSON.stringify({ gradeLevel, mode, sourceText, subject }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: controller.signal,
      });
      const completedText = await readRewriteResponse(response, setOutput);
      setOutput(completedText);
    } catch (caughtError) {
      if (
        caughtError instanceof DOMException &&
        caughtError.name === "AbortError"
      ) {
        return;
      }

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsGenerating(false);
      abortController.current = null;
    }
  }

  async function copyOutput() {
    if (!output) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch {
      setError("Your browser could not copy the text.");
    }
  }

  function clearWorkspace() {
    abortController.current?.abort();
    setSourceText("");
    setOutput("");
    setError("");
    setIsCopied(false);
  }

  async function lockWorkspace() {
    abortController.current?.abort();
    await fetch("/api/auth/lock", { method: "POST" });
    router.refresh();
  }

  function renderResult() {
    if (output) {
      return <p className="result-text">{output}</p>;
    }

    if (isGenerating) {
      return (
        <div className="result-loading">
          <span />
          <span />
          <span />
          <p>Reading your source and finding the clearest words…</p>
        </div>
      );
    }

    return (
      <div className="result-empty">
        <div className="empty-icon">
          <Lightbulb aria-hidden="true" />
        </div>
        <h3>Your clearer version will show up here.</h3>
        <p>
          Choose your options, add the source text, and select “Make it clear.”
        </p>
      </div>
    );
  }

  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <a className="brand-lockup" href="#workspace">
          <BrandMark />
          <span>
            <strong>
              <BrandWordmark />
            </strong>
            <small>Study writing, made clear.</small>
          </span>
        </a>
        <Button
          aria-label="Lock this workspace"
          className="h-11 rounded-full px-4"
          onClick={lockWorkspace}
          size="sm"
          variant="ghost"
        >
          <LockKeyhole aria-hidden="true" />
          <span className="hidden sm:inline">Lock workspace</span>
        </Button>
      </header>

      <section className="workspace-intro" id="workspace">
        <div>
          <Badge className="mb-4 border-amber-300 bg-amber-100 text-amber-950">
            <Sparkles aria-hidden="true" />
            Your private study tool
          </Badge>
          <h1>
            Make it clear.
            <br />
            <span>Keep it yours.</span>
          </h1>
        </div>
        <p>
          Paste a difficult passage and turn it into writing that is simple,
          natural, and easier to learn from.
        </p>
      </section>

      <section aria-label="Writing workspace" className="editor-grid">
        <article className="editor-card input-card">
          <div className="card-heading">
            <div>
              <span className="step-number">1</span>
              <div>
                <p className="card-kicker">Your source</p>
                <h2>What are you working on?</h2>
              </div>
            </div>
            <Button
              className="h-11"
              disabled={!(sourceText || output)}
              onClick={clearWorkspace}
              size="sm"
              variant="ghost"
            >
              Clear
            </Button>
          </div>

          <div className="control-grid">
            <div className="control-field">
              <Label htmlFor="grade-level">Grade level</Label>
              <Select
                items={gradeItems}
                onValueChange={(value) =>
                  setGradeLevel((value ?? "10") as GradeLevel)
                }
                value={gradeLevel}
              >
                <SelectTrigger className="h-11 w-full" id="grade-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {gradeItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="control-field">
              <Label htmlFor="subject">Subject</Label>
              <Select
                items={subjectItems}
                onValueChange={(value) =>
                  setSubject((value ?? "English") as Subject)
                }
                value={subject}
              >
                <SelectTrigger className="h-11 w-full" id="subject">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {subjectItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <fieldset className="mode-fieldset">
            <legend>What should DBtext do?</legend>
            <div className="mode-picker">
              {rewriteModes.map((option) => (
                <button
                  aria-pressed={mode === option}
                  className="mode-option"
                  key={option}
                  onClick={() => setMode(option)}
                  type="button"
                >
                  <span className="sm:hidden">
                    {modeDetails[option].shortLabel}
                  </span>
                  <span className="hidden sm:inline">
                    {modeDetails[option].label}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="source-field">
            <Label className="sr-only" htmlFor="source-text">
              Text to rewrite
            </Label>
            <Textarea
              aria-describedby="source-help"
              className="source-textarea"
              id="source-text"
              maxLength={MAX_SOURCE_CHARACTERS}
              onChange={(event) => setSourceText(event.target.value)}
              placeholder="Paste a paragraph, explanation, or draft here…"
              value={sourceText}
            />
            <div className="source-meta" id="source-help">
              <span>At least 20 characters</span>
              <span
                className={
                  sourceText.length >= MAX_SOURCE_CHARACTERS
                    ? "text-red-700"
                    : undefined
                }
              >
                {sourceText.length.toLocaleString()} /{" "}
                {MAX_SOURCE_CHARACTERS.toLocaleString()}
              </span>
            </div>
          </div>

          {error ? (
            <Alert className="border-red-200 bg-red-50" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            className="generate-button"
            disabled={!canGenerate}
            onClick={generateRewrite}
            size="lg"
          >
            {isGenerating ? <Spinner /> : <WandSparkles aria-hidden="true" />}
            {isGenerating ? "Working on it…" : "Make it clear"}
            {isGenerating ? null : <ArrowRight aria-hidden="true" />}
          </Button>
        </article>

        <article className="editor-card output-card">
          <div className="card-heading">
            <div>
              <span className="step-number step-number-dark">2</span>
              <div>
                <p className="card-kicker">Clear version</p>
                <h2>Your result</h2>
              </div>
            </div>
            <div className="result-actions">
              {output ? (
                <>
                  <Button
                    aria-label={isCopied ? "Copied" : "Copy result"}
                    className="h-11"
                    onClick={copyOutput}
                    size="sm"
                    variant="ghost"
                  >
                    {isCopied ? (
                      <Check aria-hidden="true" />
                    ) : (
                      <Clipboard aria-hidden="true" />
                    )}
                    <span className="hidden sm:inline">
                      {isCopied ? "Copied" : "Copy"}
                    </span>
                  </Button>
                  <Button
                    aria-label="Try this rewrite again"
                    className="h-11"
                    disabled={isGenerating}
                    onClick={generateRewrite}
                    size="sm"
                    variant="ghost"
                  >
                    <RefreshCw aria-hidden="true" />
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          <div
            aria-busy={isGenerating}
            aria-live="polite"
            className="result-paper"
          >
            {renderResult()}
          </div>

          <div className="review-note">
            <Lightbulb aria-hidden="true" />
            <p>
              <strong>One last step:</strong> Read the result, check the facts,
              and change anything that does not sound like you.
            </p>
          </div>
        </article>
      </section>

      <footer className="workspace-footer">
        <p>Built for learning, not shortcuts.</p>
        <p>Your text is not saved by this app.</p>
      </footer>
    </main>
  );
}
