import Link from "next/link";
import type { ReactNode, ComponentProps } from "react";
import { ArrowRight } from "./icons";

type Variant = "primary" | "light" | "outline" | "outline-light" | "ghost";

const styles: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-ink-2",
  light: "bg-paper text-ink hover:bg-white",
  outline: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white",
  "outline-light": "border border-white/35 text-white hover:bg-white hover:text-ink",
  ghost: "text-ink hover:text-blue",
};

function Inner({ children, arrow }: { children: ReactNode; arrow: boolean }) {
  return (
    <>
      <span className="relative">{children}</span>
      {arrow && (
        <span className="relative inline-flex h-4 w-4 overflow-hidden" aria-hidden="true">
          <ArrowRight size={16} className="absolute inset-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-[130%]" />
          <ArrowRight size={16} className="absolute inset-0 -translate-x-[130%] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0" />
        </span>
      )}
    </>
  );
}

const base =
  "group inline-flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-[14px] font-medium transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow = true,
  className = "",
  external,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href">) {
  const cls = `${base} ${styles[variant]} ${className}`;
  if (external || href.startsWith("http") || href.startsWith("tel:")) {
    return (
      <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" {...rest}>
        <Inner arrow={arrow}>{children}</Inner>
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  arrow = true,
  className = "",
  ...rest
}: { children: ReactNode; variant?: Variant; arrow?: boolean; className?: string } & ComponentProps<"button">) {
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}
