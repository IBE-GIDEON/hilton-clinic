"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, WhatsApp } from "./icons";
import { whatsappLink } from "@/lib/site";
import { EASE } from "./motion";

const topics = [
  "General enquiry",
  "Dialysis & kidney care",
  "Antenatal & maternity",
  "Laboratory tests & fees",
  "HMO / corporate billing",
  "Feedback or follow-up",
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");
  const [preferredChannel, setPreferredChannel] = useState<"whatsapp" | "phone">("whatsapp");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, topic, message, preferredChannel }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not send your message. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Network issue while sending. You can also reach us immediately on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="rounded-[3px] border border-line bg-white p-8"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage text-white">
          <Check size={20} />
        </span>
        <h3 className="heading mt-4 text-[24px] text-ink">Message received by our front desk</h3>
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
          Thank you, {name}. Our team will follow up via {preferredChannel === "whatsapp" ? "WhatsApp" : "phone call"} on{" "}
          <strong className="font-medium text-ink">{phone}</strong> shortly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={whatsappLink(`Hello Hilton Clinics, my name is ${name}. I just sent an enquiry about ${topic}: ${message}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[3px] bg-[#1f7a4d] px-5 py-3 text-[13px] font-medium text-white hover:bg-[#17613c]"
          >
            <WhatsApp size={15} /> Continue on WhatsApp now
          </a>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setName("");
              setPhone("");
              setMessage("");
            }}
            className="rounded-[3px] border border-line px-5 py-3 text-[13px] text-ink hover:border-ink"
          >
            Send another message
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-[3px] border border-line bg-white p-7 sm:p-9">
      <div>
        <p className="eyebrow text-blue">Request a Callback</p>
        <h2 className="heading mt-2 text-[24px] text-ink">Write to our front desk</h2>
        <p className="mt-1.5 text-[14.5px] text-muted">
          Ask about specialist clinic days, dialysis scheduling, lab tests or fees.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="mb-1.5 block text-[13px] font-medium text-ink">
            Your name *
          </label>
          <input
            id="c-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="field"
          />
        </div>
        <div>
          <label htmlFor="c-phone" className="mb-1.5 block text-[13px] font-medium text-ink">
            Phone / WhatsApp *
          </label>
          <input
            id="c-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0803 000 0000"
            className="field"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-topic" className="mb-1.5 block text-[13px] font-medium text-ink">
            Topic
          </label>
          <select id="c-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="field">
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="mb-1.5 block text-[13px] font-medium text-ink">Preferred reply</span>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { v: "whatsapp", l: "WhatsApp" },
                { v: "phone", l: "Phone call" },
              ] as const
            ).map((ch) => (
              <button
                type="button"
                key={ch.v}
                onClick={() => setPreferredChannel(ch.v)}
                className={`rounded-[3px] border py-3 text-[13px] transition-colors ${
                  preferredChannel === ch.v ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-ink"
                }`}
              >
                {ch.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="c-msg" className="mb-1.5 block text-[13px] font-medium text-ink">
          How can we help? *
        </label>
        <textarea
          id="c-msg"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us briefly what you need help with…"
          className="field resize-none"
        />
      </div>

      {error && (
        <p className="rounded-[3px] border border-clay/30 bg-clay/10 px-4 py-3 text-[13.5px] text-clay">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-[3px] bg-blue py-3.5 text-[13.5px] font-medium text-white transition-colors hover:bg-blue-deep disabled:opacity-50"
      >
        {submitting ? "Sending…" : "Send message to front desk"}
      </button>
    </form>
  );
}
