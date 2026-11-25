/* Small two-tone label in the style of "realreason." — first word solid, second word muted. */
export function Wordmark({ a, b, className = "" }: { a: string; b: string; className?: string }) {
  return (
    <p className={`text-[14.5px] font-medium tracking-[-0.01em] ${className}`}>
      <span className="text-ink">{a}</span>
      <span className="text-ink/35">{b}</span>
    </p>
  );
}
