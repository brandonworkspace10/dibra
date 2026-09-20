"use client";

import { KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { BrandMark, BrandWordmark } from "@/components/brand";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

export function PasscodeGate() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/unlock", {
        body: JSON.stringify({ passcode }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "We could not unlock the app.");
        return;
      }

      router.refresh();
    } catch {
      setError("Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="gate-shell">
      <div aria-hidden="true" className="gate-doodle gate-doodle-left" />
      <div aria-hidden="true" className="gate-doodle gate-doodle-right" />

      <section aria-labelledby="gate-title" className="gate-card">
        <BrandMark className="brand-mark-large" />
        <p className="eyebrow">Private study space</p>
        <h1 id="gate-title">
          <BrandWordmark />
        </h1>
        <p className="gate-intro">
          Turn difficult writing into clear explanations you can actually
          understand.
        </p>

        <form className="gate-form" onSubmit={handleSubmit}>
          <div className="space-y-2 text-left">
            <Label htmlFor="passcode">Shared passcode</Label>
            <div className="relative">
              <KeyRound
                aria-hidden="true"
                className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[var(--muted-foreground)]"
              />
              <Input
                aria-describedby={error ? "passcode-error" : undefined}
                aria-invalid={Boolean(error)}
                autoComplete="current-password"
                className="h-12 rounded-xl bg-white pl-11"
                disabled={isSubmitting}
                id="passcode"
                onChange={(event) => setPasscode(event.target.value)}
                placeholder="Enter the passcode"
                type="password"
                value={passcode}
              />
            </div>
          </div>

          {error ? (
            <Alert className="border-red-200 bg-red-50" variant="destructive">
              <AlertDescription id="passcode-error">{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            className="h-12 w-full rounded-xl text-base"
            disabled={isSubmitting || passcode.trim().length === 0}
            type="submit"
          >
            {isSubmitting ? <Spinner /> : null}
            {isSubmitting ? "Opening…" : "Open my workspace"}
          </Button>
        </form>

        <p className="gate-note">
          Only your small study group has access. Nothing is saved here.
        </p>
      </section>
    </main>
  );
}
