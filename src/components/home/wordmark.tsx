/* Two-tone label in the style of "realreason." — first word solid, second word muted. */
export function Wordmark({ a, b, className = "" }: { a: string; b: string; className?: string }) {
  return (
    <p className={`font-[family-name:var(--font-display)] text-[17px] font-semibold tracking-[-0.03em] ${className}`}>
      <span className="text-ink">{a}</span>
      <span className="text-ink/35">{b}</span>
    </p>
  );
}
