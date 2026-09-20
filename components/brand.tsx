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
      <span aria-hidden="true" className="brand-b-motion">
        <span className="brand-letter-b brand-b-glyph">B</span>
        <svg className="brand-b-heart" viewBox="0 0 100 108">
          <title>Animated B turning into a heart</title>
          <path
            className="brand-heart-side brand-heart-side-left"
            d="M50 27 C37 4 7 10 7 39 C7 59 24 74 38 84"
          />
          <path
            className="brand-heart-side brand-heart-side-right"
            d="M50 27 C63 4 93 10 93 39 C93 59 76 74 62 84"
          />
          <path className="brand-heart-point" d="M38 84 L50 101 L62 84" />
        </svg>
      </span>
      <span aria-hidden="true" className="brand-letter-text">
        text
      </span>
    </span>
  );
}
