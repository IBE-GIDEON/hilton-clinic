"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site, whatsappLink } from "@/lib/site";
import { Close, WhatsApp, Phone, ArrowUpRight } from "./icons";
import { EASE } from "./motion";

const topics = [
  { label: "Book an appointment", msg: "Hello Hilton Clinics, I would like to book an appointment." },
  { label: "Dialysis enquiry", msg: "Hello Hilton Clinics, I would like to make an enquiry about dialysis sessions." },
  { label: "Antenatal / maternity", msg: "Hello Hilton Clinics, I would like to ask about antenatal care." },
  { label: "Test results & lab", msg: "Hello Hilton Clinics, I have a question about laboratory tests." },
  { label: "Something else", msg: site.whatsapp.greeting },
];

export function WhatsAppWidget() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setReady(true), 1800);
    const t2 = setTimeout(() => setNudge(true), 6000);
    const t3 = setTimeout(() => setNudge(false), 13000);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{ transformOrigin: "bottom right" }}
            className="w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-[4px] bg-white shadow-[0_30px_80px_-20px_rgba(15,29,43,0.35)] ring-1 ring-ink/5"
            role="dialog"
            aria-label="Chat with Hilton Clinics on WhatsApp"
          >
            <div className="flex items-start justify-between bg-[#0f3d2e] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <WhatsApp size={20} />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0f3d2e] bg-emerald-400" />
                </span>
                <div>
                  <p className="text-[14px] font-medium">Hilton Clinics</p>
                  <p className="text-[12px] text-white/65">Front desk · usually replies quickly</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded p-1 text-white/70 hover:text-white">
                <Close size={18} />
              </button>
            </div>
            <div className="bg-[#f3efe7] px-5 py-5">
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                className="max-w-[85%] rounded-[4px] rounded-tl-none bg-white px-4 py-3 text-[13.5px] leading-relaxed text-ink shadow-sm"
              >
                Good day 👋 How can we help you today? Choose a topic and we&apos;ll continue on WhatsApp.
              </motion.div>
              <ul className="mt-4 space-y-2">
                {topics.map((t, i) => (
                  <motion.li
                    key={t.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.45, ease: EASE }}
                  >
                    <a
                      href={whatsappLink(t.msg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-[3px] border border-[#0f3d2e]/15 bg-white px-4 py-2.5 text-[13px] text-ink transition-colors hover:border-[#0f3d2e] hover:bg-[#0f3d2e] hover:text-white"
                    >
                      {t.label}
                      <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
            <a
              href={`tel:${site.phones.emergency.tel}`}
              className="flex items-center justify-center gap-2 border-t border-line py-3 text-[12.5px] text-muted hover:text-ink"
            >
              <Phone size={14} /> Emergency? Call {site.phones.emergency.display}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {nudge && !open && (
            <motion.button
              key="nudge"
              onClick={() => setOpen(true)}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="hidden rounded-[3px] bg-white px-4 py-2.5 text-[13px] text-ink shadow-[0_10px_30px_-10px_rgba(15,29,43,0.3)] sm:block"
            >
              Questions? Chat with our front desk
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {ready && (
            <motion.button
              key="fab"
              onClick={() => setOpen((o) => !o)}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
              aria-expanded={open}
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1f7a4d] text-white shadow-[0_14px_40px_-10px_rgba(31,122,77,0.7)]"
            >
              {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#1f7a4d] opacity-20 [animation-duration:2.6s]" />}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "x" : "wa"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {open ? <Close size={22} /> : <WhatsApp size={26} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
