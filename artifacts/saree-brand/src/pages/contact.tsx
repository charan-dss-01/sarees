import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { SiWhatsapp, SiInstagram, SiPinterest } from "react-icons/si";

/* ─── palette ──────────────────────────────────────────── */
const G = {
  bg: "#FAF7F2",
  cream: "#F3EDE3",
  gold: "#B8973E",
  paleGold: "#D4AF72",
  charcoal: "#2C2A26",
  muted: "#7A7060",
  dark: "#1C1A16",
  border: "rgba(184,151,62,0.16)",
  borderStrong: "rgba(184,151,62,0.32)",
};

/* ─── nav ──────────────────────────────────────────────── */
function PageNav() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: G.bg, borderBottom: `1px solid ${G.border}`, paddingBlock: "1.1rem" }}
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <div className="container mx-auto px-5 md:px-10 flex items-center justify-between">
        <div className="hidden md:flex gap-7 text-[11px] uppercase tracking-[0.22em] font-sans" style={{ color: G.muted }}>
          <Link href="/collections" className="hover:opacity-60 transition-opacity">Collections</Link>
          <Link href="/about" className="hover:opacity-60 transition-opacity">Story</Link>
        </div>
        <Link href="/" className="font-serif text-2xl tracking-[0.28em] transition-opacity hover:opacity-60" style={{ color: G.charcoal }}>
          ANANYA
        </Link>
        <div className="hidden md:flex gap-7 text-[11px] uppercase tracking-[0.22em] font-sans" style={{ color: G.gold }}>
          <span>Contact</span>
        </div>
        <div className="md:hidden" />
      </div>
    </motion.nav>
  );
}

/* ─── field component ──────────────────────────────────── */
function Field({
  label,
  id,
  type = "text",
  textarea = false,
  value,
  onChange,
  required = false,
}: {
  label: string;
  id: string;
  type?: string;
  textarea?: boolean;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  const active = focused || filled;

  const base: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    outline: "none",
    fontFamily: "var(--font-sans, sans-serif)",
    fontSize: "0.9rem",
    color: G.charcoal,
    resize: "none" as const,
    paddingTop: active ? "1.25rem" : "0.9rem",
    paddingBottom: "0.75rem",
    paddingInline: 0,
    borderBottom: `1px solid ${focused ? G.gold : G.borderStrong}`,
    transition: "border-color 0.25s ease, padding 0.2s ease",
  };

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="absolute left-0 pointer-events-none transition-all duration-200 font-sans"
        style={{
          top: active ? "0.2rem" : "0.9rem",
          fontSize: active ? "0.65rem" : "0.85rem",
          letterSpacing: active ? "0.22em" : "0.05em",
          textTransform: active ? "uppercase" : "none",
          color: focused ? G.gold : G.muted,
        }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          required={required}
          style={base}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          required={required}
          style={base}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

/* ─── contact form ─────────────────────────────────────── */
type FormState = "idle" | "sending" | "sent";

function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormState>("idle");

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const whatsappText = encodeURIComponent(
    `Hi, I'm ${name || "a customer"}. ${message || "I'd like to enquire about your saree collection."}`
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 900);
  }

  return (
    <motion.div
      ref={ref}
      className="flex flex-col gap-8"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <span className="block text-[10px] uppercase tracking-[0.35em] font-sans mb-3" style={{ color: G.gold }}>
          Send a message
        </span>
        <p className="font-sans text-sm leading-relaxed" style={{ color: G.muted }}>
          Leave your name and message — we will get back to you personally within 24 hours.
        </p>
      </div>

      {status === "sent" ? (
        <motion.div
          className="py-10 flex flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: G.cream, border: `1px solid ${G.borderStrong}` }}
          >
            <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
              <path d="M1 7L7 13L19 1" stroke={G.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="font-serif text-xl font-light" style={{ color: G.charcoal }}>Thank you, {name}.</p>
          <p className="font-sans text-sm" style={{ color: G.muted }}>We will be in touch soon.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <Field label="Your name" id="name" value={name} onChange={setName} required />
          <Field label="Your message" id="message" textarea value={message} onChange={setMessage} required />

          <motion.button
            type="submit"
            disabled={status === "sending"}
            className="self-start flex items-center gap-3 font-sans text-xs uppercase tracking-[0.25em] transition-all duration-300"
            style={{
              background: G.charcoal,
              color: G.bg,
              padding: "0.85rem 2rem",
              opacity: status === "sending" ? 0.6 : 1,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="btn-send"
          >
            {status === "sending" ? (
              <>
                <motion.span
                  className="block w-3.5 h-3.5 rounded-full border border-white/50 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
                Sending…
              </>
            ) : (
              "Send Message"
            )}
          </motion.button>
        </form>
      )}
    </motion.div>
  );
}

/* ─── detail item ──────────────────────────────────────── */
function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.28em] font-sans mb-1" style={{ color: G.gold }}>{label}</p>
      <p className="font-sans text-sm leading-relaxed" style={{ color: G.charcoal }}>{value}</p>
    </div>
  );
}

/* ─── page ─────────────────────────────────────────────── */
export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  const waRef = useRef<HTMLDivElement>(null);
  const waInView = useInView(waRef, { once: true, amount: 0.3 });

  return (
    <div className="min-h-screen font-sans" style={{ background: G.bg, color: G.charcoal }}>
      <PageNav />

      {/* ── page header ── */}
      <div className="pt-28 pb-12 md:pt-36 md:pb-16 border-b" style={{ borderColor: G.border }}>
        <motion.div
          ref={heroRef}
          className="container mx-auto max-w-6xl px-5 md:px-10"
          initial={{ opacity: 0, y: 24 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block text-[10px] uppercase tracking-[0.38em] font-sans mb-4" style={{ color: G.gold }}>
            Get in touch
          </span>
          <h1
            className="font-serif font-light leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: G.charcoal }}
          >
            We would love to hear from you.
          </h1>
        </motion.div>
      </div>

      {/* ── main grid ── */}
      <div className="container mx-auto max-w-6xl px-5 md:px-10 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-12 lg:gap-0">

          {/* Left — WhatsApp + details */}
          <div className="flex flex-col gap-10 lg:pr-16">

            {/* WhatsApp CTA */}
            <motion.div
              ref={waRef}
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 24 }}
              animate={waInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <span className="block text-[10px] uppercase tracking-[0.35em] font-sans mb-3" style={{ color: G.gold }}>
                  Fastest response
                </span>
                <p className="font-sans text-sm leading-relaxed" style={{ color: G.muted }}>
                  Our team is available on WhatsApp for enquiries, custom orders, styling help, and sizing guidance. Most messages receive a reply within the hour.
                </p>
              </div>

              <motion.a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden flex items-center gap-3.5 font-sans text-sm uppercase tracking-[0.22em] font-medium transition-all duration-300"
                style={{ background: "#128C7E", color: "#fff", padding: "1.1rem 1.75rem", width: "fit-content" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                data-testid="btn-whatsapp-contact"
              >
                <span
                  className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-out"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)" }}
                />
                <SiWhatsapp className="text-base relative z-10" />
                <span className="relative z-10">Chat on WhatsApp</span>
              </motion.a>

              <p className="font-sans text-[11px]" style={{ color: G.muted }}>
                Available Mon–Sat, 10 am – 7 pm IST
              </p>
            </motion.div>

            {/* thin divider */}
            <div className="h-px w-full" style={{ background: G.border }} />

            {/* contact details */}
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={waInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Detail
                label="WhatsApp & Phone"
                value={
                  <a href="tel:+919876543210" className="hover:opacity-60 transition-opacity" style={{ color: G.charcoal }}>
                    +91 98765 43210
                  </a>
                }
              />
              <Detail
                label="Email"
                value={
                  <a href="mailto:hello@ananyasarees.com" className="hover:opacity-60 transition-opacity" style={{ color: G.charcoal }}>
                    hello@ananyasarees.com
                  </a>
                }
              />
              <Detail label="Studio" value="Varanasi, Uttar Pradesh, India" />
              <Detail label="Shipping" value="Pan-India delivery · International on request" />
            </motion.div>

            {/* thin divider */}
            <div className="h-px w-full" style={{ background: G.border }} />

            {/* social */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={waInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <span className="block text-[10px] uppercase tracking-[0.35em] font-sans mb-4" style={{ color: G.gold }}>
                Follow the craft
              </span>
              <div className="flex items-center gap-5">
                <a
                  href="#"
                  className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
                  style={{ color: G.muted }}
                  data-testid="social-ig"
                >
                  <SiInstagram className="text-base" />
                  Instagram
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
                  style={{ color: G.muted }}
                  data-testid="social-pin"
                >
                  <SiPinterest className="text-base" />
                  Pinterest
                </a>
              </div>
            </motion.div>
          </div>

          {/* vertical divider — desktop only */}
          <div className="hidden lg:block w-px self-stretch" style={{ background: G.border }} />

          {/* Right — contact form */}
          <div className="lg:pl-16">
            <ContactForm />
          </div>
        </div>
      </div>

      {/* ── bottom image strip ── */}
      <div className="relative overflow-hidden" style={{ height: "35vh", minHeight: 220 }}>
        <img
          src="/images/handloom.png"
          alt="Ananya weavers"
          className="w-full h-full object-cover"
          style={{ opacity: 0.45 }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${G.dark} 0%, transparent 60%)` }}
        />
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-serif text-lg md:text-2xl font-light text-white">Every thread, a conversation.</p>
        </motion.div>
      </div>

      {/* ── footer ── */}
      <footer
        className="py-10 px-5 flex flex-col items-center text-center border-t"
        style={{ background: G.bg, borderColor: G.border }}
      >
        <div className="w-8 h-px mb-7" style={{ background: G.gold }} />
        <Link href="/" className="font-serif text-xl tracking-[0.3em] mb-5 transition-opacity hover:opacity-60" style={{ color: G.charcoal }}>
          ANANYA
        </Link>
        <div className="flex flex-wrap justify-center gap-7 mb-5 font-sans uppercase tracking-widest text-[10px]" style={{ color: G.muted }}>
          <Link href="/collections" className="hover:opacity-60 transition-opacity">Collections</Link>
          <Link href="/about" className="hover:opacity-60 transition-opacity">Story</Link>
          <Link href="/contact" className="hover:opacity-60 transition-opacity" style={{ color: G.gold }}>Contact</Link>
        </div>
        <div className="flex gap-5 mb-5" style={{ color: G.muted }}>
          <a href="#" className="hover:opacity-60 transition-opacity"><SiInstagram /></a>
          <a href="#" className="hover:opacity-60 transition-opacity"><SiPinterest /></a>
        </div>
        <p className="font-sans text-[10px] tracking-widest" style={{ color: G.muted }}>
          &copy; 2025 Ananya. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
