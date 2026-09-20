import { cn } from "@/lib/utils";

interface BrandProps {
  className?: string;
}

export function BrandMark({ className }: BrandProps) {
  return (
    <span aria-hidden="true" className={cn("brand-mark", className)}>
      <span className="brand-letter-d">D</span>
      <span className="brand-letter-b">B</span>
    </span>
  );
}

export function BrandWordmark({ className }: BrandProps) {
  return (
    <span className={cn("brand-wordmark", className)}>
      <span className="sr-only">DBtext</span>
      <span aria-hidden="true" className="brand-letter-d">
        D
      </span>
      <span aria-hidden="true" className="brand-letter-b">
        B
      </span>
      <span aria-hidden="true" className="brand-letter-text">
        text
      </span>
    </span>
  );
}
