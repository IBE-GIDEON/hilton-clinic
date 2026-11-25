"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { site, whatsappLink } from "@/lib/site";
import { Phone, WhatsApp, ArrowRight } from "./icons";
import { EASE } from "./motion";

const links = [
  { href: "/services", label: "Specialties" },
  { href: "/services/nephrology-dialysis", label: "Kidney Care" },
  { href: "/patients", label: "Patient Guide" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || (href !== "/services" && pathname.startsWith(href));

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled && !open ? "bg-white/75 shadow-[0_1px_0_0_rgba(7,19,30,0.06)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[84px] max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <Logo />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-10 text-[13.5px] text-ink/75">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative py-2 transition-colors hover:text-ink ${isActive(item.href) ? "text-ink" : ""}`}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <motion.span layoutId="nav-dot" className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sky-500" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <Link
              href="/book"
              className="group hidden h-11 items-center gap-3 rounded-full bg-ink pl-5 pr-1.5 text-[13px] font-medium text-white shadow-[0_12px_26px_-10px_rgba(7,19,30,0.6)] transition-colors hover:bg-ink-2 sm:inline-flex"
            >
              Book Appointment
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-400 text-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-45">
                <ArrowRight size={15} />
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpenPath((p) => (p === pathname ? null : pathname))}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-[0_8px_20px_-10px_rgba(7,19,30,0.35)] lg:hidden"
            >
              <span className="relative block h-2.5 w-[18px]">
                <motion.span
                  className="absolute left-0 top-0 h-[1.5px] w-full rounded-full bg-current"
                  animate={open ? { rotate: 45, top: "50%" } : { rotate: 0, top: "0%" }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-[1.5px] w-full rounded-full bg-current"
                  animate={open ? { rotate: -45, bottom: "50%" } : { rotate: 0, bottom: "0%" }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col bg-[#f4f8fb] pt-[96px] lg:hidden"
          >
            <nav className="flex-1 overflow-y-auto px-5 sm:px-8">
              <ul>
                {[{ href: "/", label: "Home" }, ...links, { href: "/appointment", label: "Manage Booking" }].map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.04 }}
                    >
                      <Link href={item.href} className="flex items-center justify-between border-b border-ink/10 py-4">
                        <span className="font-[family-name:var(--font-display)] text-[34px] font-semibold tracking-[-0.04em] text-ink">{item.label}</span>
                        <ArrowRight size={20} className="text-ink/40" />
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
              className="grid grid-cols-2 gap-3 px-5 pb-8 pt-6 sm:px-8"
            >
              <Link href="/book" className="col-span-2 flex h-14 items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-medium text-white">
                Book Appointment <ArrowRight size={16} />
              </Link>
              <a href={`tel:${site.phones.emergency.tel}`} className="flex h-14 items-center justify-center gap-2 rounded-full bg-white text-[14px] text-ink shadow-sm">
                <Phone size={16} /> Call 24/7
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#1f7a4d] text-[14px] text-white">
                <WhatsApp size={16} /> WhatsApp
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
