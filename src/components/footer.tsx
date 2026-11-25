import Link from "next/link";
import { LogoMark } from "./logo";

const links = [
  { href: "/services", label: "Specialties" },
  { href: "/book", label: "Book" },
  { href: "/appointment", label: "Manage booking" },
  { href: "/contact", label: "Contact" },
];

/* One fine line: brand, year, a few links. */
export function Footer() {
  return (
    <footer className="border-t border-ink/[0.06] bg-[#f4f5f6]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-7 text-[12.5px] text-ink/45 sm:px-8 md:flex-row md:items-center md:justify-between">
        <p className="flex items-center gap-2.5">
          <LogoMark size={18} className="text-sky-500" />
          © 2026 Hilton Clinics, Port Harcourt
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
