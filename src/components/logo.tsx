import Link from "next/link";

export function LogoMark({ className = "", size = 30 }: { className?: string; size?: number }) {
  return (
    <svg width={size || undefined} height={size || undefined} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="10" fill="currentColor" />
      <path d="M10 9v14M22 9v14" stroke="var(--logo-fg, #fff)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M10 16h12M16 12.5v7" stroke="var(--logo-fg, #fff)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Hilton Clinics — home"
      className={`group inline-flex items-center gap-2.5 ${light ? "text-white" : "text-ink"} ${className}`}
      style={{ ["--logo-fg" as string]: "#fff" }}
    >
      <LogoMark
        size={28}
        className="text-sky-500 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-90"
      />
      <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold tracking-[-0.03em]">Hilton Clinics</span>
    </Link>
  );
}
