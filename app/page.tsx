import { PasscodeGate } from "@/components/rewriter/passcode-gate";
import { RewriterWorkspace } from "@/components/rewriter/rewriter-workspace";
import { hasStudyAccess } from "@/lib/auth";

export default async function Page() {
  let hasAccess = false;

  try {
    hasAccess = await hasStudyAccess();
  } catch {
    // The gate displays a setup message if required environment values are missing.
  }

  return hasAccess ? <RewriterWorkspace /> : <PasscodeGate />;
}
