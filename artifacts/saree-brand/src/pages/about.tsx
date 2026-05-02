import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
};

/* ─── reusable animation hook ──────────────────────────── */
function useFadeUp(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  return { ref, inView };
}

/* ─── section label ────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-[10px] uppercase tracking-[0.35em] font-sans mb-5"
      style={{ color: G.gold }}
    >
      {children}
    </span>
  );
}

/* ─── divider ──────────────────────────────────────────── */
function GoldLine({ className = "" }: { className?: string }) {
  return <div className={`h-px ${className}`} style={{ background: G.border }} />;
}

/* ─── nav ──────────────────────────────────────────────── */
function PageNav() {
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: G.bg, paddingBlock: "1.1rem" }}
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: G.border, opacity: borderOpacity }}
      />
      <div className="container mx-auto px-5 md:px-10 flex items-center justify-between">
        <div className="hidden md:flex gap-7 text-[11px] uppercase tracking-[0.22em] font-sans" style={{ color: G.muted }}>
          <Link href="/collections" className="hover:opacity-60 transition-opacity">Collections</Link>
          <Link href="/about" className="transition-opacity" style={{ color: G.gold }}>Story</Link>
        </div>

        <Link href="/" className="font-serif text-2xl tracking-[0.28em] transition-opacity hover:opacity-60" style={{ color: G.charcoal }}>
          ANANYA
        </Link>

        <div className="hidden md:flex gap-7 text-[11px] uppercase tracking-[0.22em] font-sans" style={{ color: G.muted }}>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">Contact</a>
        </div>
        <div className="md:hidden" />
      </div>
    </motion.nav>
  );
}

/* ─── hero ─────────────────────────────────────────────── */
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 140]);
  const opacity = useTransform(scrollY, [0, 380], [1, 0]);

  return (
    <section className="relative overflow-hidden flex items-end" style={{ minHeight: "92vh", background: G.dark }}>
      {/* parallax image */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="/images/story.png"
          alt="Ananya — The House of Sarees"
          className="w-full h-full object-cover"
          style={{ opacity: 0.55 }}
        />
      </motion.div>

      {/* gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(28,26,22,0.92) 0%, rgba(28,26,22,0.3) 60%, transparent 100%)" }}
      />

      {/* text */}
      <motion.div
        className="relative z-10 container mx-auto px-5 md:px-10 pb-16 md:pb-24"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block text-[10px] uppercase tracking-[0.4em] font-sans mb-6" style={{ color: G.paleGold }}>
            The House of Sarees
          </span>
          <h1
            className="font-serif font-light text-white leading-[1.1] mb-6"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            Woven with
            <br />
            <em className="not-italic" style={{ color: G.paleGold }}>intention.</em>
          </h1>
          <p className="font-sans text-sm md:text-base leading-relaxed max-w-md" style={{ color: "rgba(250,247,242,0.65)" }}>
            Every Ananya saree begins with a question: what does it mean to wear something made entirely by hand?
          </p>
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-sans" style={{ color: "rgba(212,175,114,0.6)", writingMode: "vertical-rl" }}>
          Scroll
        </span>
        <motion.div
          className="w-px h-12"
          style={{ background: "rgba(212,175,114,0.35)" }}
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

/* ─── alternating section ──────────────────────────────── */
interface StorySectionProps {
  label: string;
  heading: string;
  body: React.ReactNode;
  img: string;
  imgAlt: string;
  reverse?: boolean;
  quote?: string;
}

function StorySection({ label, heading, body, img, imgAlt, reverse = false, quote }: StorySectionProps) {
  const { ref: imgRef, inView: imgInView } = useFadeUp(0.2);
  const { ref: txtRef, inView: txtInView } = useFadeUp(0.2);

  return (
    <section className="py-16 md:py-24 lg:py-32" style={{ background: G.bg }}>
      <div className="container mx-auto max-w-6xl px-5 md:px-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center ${reverse ? "lg:direction-rtl" : ""}`}>

          {/* image */}
          <motion.div
            ref={imgRef}
            className={`relative overflow-hidden ${reverse ? "lg:order-2" : "lg:order-1"}`}
            initial={{ opacity: 0, x: reverse ? 30 : -30 }}
            animate={imgInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ aspectRatio: "4/5", background: G.cream }}>
              <img
                src={img}
                alt={imgAlt}
                className="w-full h-full object-cover"
                style={{ display: "block" }}
              />
            </div>
            {/* accent line */}
            <motion.div
              className="absolute top-6 w-12 h-px"
              style={{
                background: G.gold,
                [reverse ? "right" : "left"]: "-24px",
              }}
              initial={{ scaleX: 0 }}
              animate={imgInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            />
          </motion.div>

          {/* text */}
          <motion.div
            ref={txtRef}
            className={`flex flex-col gap-6 ${reverse ? "lg:order-1" : "lg:order-2"}`}
            initial={{ opacity: 0, y: 28 }}
            animate={txtInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Label>{label}</Label>
            <h2
              className="font-serif font-light leading-[1.2]"
              style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.5rem)", color: G.charcoal }}
            >
              {heading}
            </h2>

            {quote && (
              <blockquote
                className="border-l-2 pl-5 font-serif text-lg md:text-xl font-light italic leading-relaxed"
                style={{ borderColor: G.gold, color: G.muted }}
              >
                "{quote}"
              </blockquote>
            )}

            <div className="font-sans text-sm md:text-base leading-[1.85]" style={{ color: G.muted }}>
              {body}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── full-width quote ─────────────────────────────────── */
function FullWidthQuote() {
  const { ref, inView } = useFadeUp(0.3);

  return (
    <section className="py-20 md:py-28" style={{ background: G.dark }}>
      <motion.div
        ref={ref}
        className="container mx-auto max-w-3xl px-5 md:px-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-8 h-px mx-auto mb-8" style={{ background: G.gold }} />
        <p
          className="font-serif font-light italic leading-[1.5] text-white"
          style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
        >
          "A saree is not sewn — it is woven whole, in one breath, without a single seam. <br className="hidden md:block" />
          It is the only garment in the world that arrives as it will be worn."
        </p>
        <span className="block mt-7 text-[10px] uppercase tracking-[0.35em] font-sans" style={{ color: G.paleGold }}>
          Ananya House Principle
        </span>
      </motion.div>
    </section>
  );
}

/* ─── values strip ─────────────────────────────────────── */
const VALUES = [
  {
    num: "01",
    title: "Handloom First",
    body: "We work only with handloom fabrics. No power looms, no shortcuts. Each thread is placed by a human hand on a human loom.",
  },
  {
    num: "02",
    title: "Artisan Wages",
    body: "Every weaver is paid above the industry rate and credited by name. Their skill is not a commodity — it is the product.",
  },
  {
    num: "03",
    title: "Zero Middlemen",
    body: "We buy directly from weaving families. No wholesale agents, no factory floors. You and the weaver — no one else in between.",
  },
];

function ValuesStrip() {
  const { ref, inView } = useFadeUp(0.2);

  return (
    <section className="py-16 md:py-24" style={{ background: G.cream }}>
      <div className="container mx-auto max-w-6xl px-5 md:px-10">
        <motion.div
          className="text-center mb-14"
          ref={ref}
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          <Label>How we work</Label>
          <h2
            className="font-serif font-light"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: G.charcoal }}
          >
            Our commitments
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: G.border }}>
          {VALUES.map((v, i) => {
            const { ref: vRef, inView: vInView } = useFadeUp(0.2);
            return (
              <motion.div
                key={v.num}
                ref={vRef}
                className="px-0 md:px-10 py-10 md:py-0 first:pl-0 last:pr-0"
                initial={{ opacity: 0, y: 20 }}
                animate={vInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <span className="block font-serif text-3xl mb-5" style={{ color: G.border.replace("0.16", "0.5") }}>
                  {v.num}
                </span>
                <h3 className="font-serif text-lg font-light mb-3" style={{ color: G.charcoal }}>{v.title}</h3>
                <p className="font-sans text-sm leading-[1.8]" style={{ color: G.muted }}>{v.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── founder note ─────────────────────────────────────── */
function FounderNote() {
  const { ref, inView } = useFadeUp(0.2);

  return (
    <section className="py-16 md:py-28" style={{ background: G.bg }}>
      <div className="container mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-center">

          {/* portrait */}
          <motion.div
            ref={ref}
            className="relative"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ aspectRatio: "3/4", background: G.cream, overflow: "hidden" }}>
              <img src="/images/handloom.png" alt="Ananya founder" className="w-full h-full object-cover" />
            </div>
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 hidden md:block"
              style={{ background: G.cream, zIndex: -1 }}
            />
          </motion.div>

          {/* letter */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <Label>A note from the founder</Label>
            <h2
              className="font-serif font-light leading-tight"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: G.charcoal }}
            >
              I started Ananya because I could not find a saree that told the truth.
            </h2>

            <GoldLine className="w-12" />

            <div className="flex flex-col gap-4 font-sans text-sm md:text-[0.9rem] leading-[1.9]" style={{ color: G.muted }}>
              <p>
                Every shop I visited had beautiful sarees, but none of them could tell me who made it, where it came from, or how long it took. The weaver had no name. The place had no story. The price had no meaning.
              </p>
              <p>
                I spent two years traveling to weaving villages — Varanasi, Kanchipuram, Bhagalpur, Chanderi — and sitting beside the men and women at their looms. I learned that the knowledge they carry is extraordinarily deep and dangerously fragile. That a master weaver's son might choose a factory job because the economics of handloom no longer made sense.
              </p>
              <p>
                Ananya is my attempt to change that equation. To make handloom sarees desirable enough that the next generation of weavers chooses the loom.
              </p>
            </div>

            <div className="mt-2">
              <p className="font-serif text-lg italic" style={{ color: G.charcoal }}>— Priya Anand</p>
              <p className="font-sans text-[11px] uppercase tracking-widest mt-0.5" style={{ color: G.muted }}>Founder, Ananya</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── numbers strip ────────────────────────────────────── */
const STATS = [
  { value: "48", unit: "+", label: "Weaving families" },
  { value: "12", unit: "yrs", label: "Average loom mastery" },
  { value: "6", unit: " states", label: "Textile traditions" },
  { value: "100", unit: "%", label: "Direct from loom" },
];

function StatsStrip() {
  const { ref, inView } = useFadeUp(0.2);

  return (
    <section className="py-16 border-t border-b" style={{ background: G.cream, borderColor: G.border }}>
      <div
        ref={ref}
        className="container mx-auto max-w-6xl px-5 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-10"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            className="text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <p className="font-serif font-light leading-none mb-2" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: G.charcoal }}>
              {s.value}<span style={{ color: G.gold, fontSize: "0.55em" }}>{s.unit}</span>
            </p>
            <p className="font-sans text-[11px] uppercase tracking-[0.22em]" style={{ color: G.muted }}>{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── cta ──────────────────────────────────────────────── */
function ClosingCTA() {
  const { ref, inView } = useFadeUp(0.3);

  return (
    <section className="py-20 md:py-28" style={{ background: G.bg }}>
      <motion.div
        ref={ref}
        className="container mx-auto max-w-lg px-5 text-center flex flex-col items-center gap-7"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-8 h-px" style={{ background: G.gold }} />
        <h2
          className="font-serif font-light leading-tight"
          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", color: G.charcoal }}
        >
          Wear the work of a master's hands.
        </h2>
        <p className="font-sans text-sm leading-relaxed" style={{ color: G.muted }}>
          Every saree in the collection is named, sourced, and documented. Begin with the one that calls to you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link
            href="/collections"
            className="flex-1 flex items-center justify-center py-4 font-sans text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:opacity-80"
            style={{ background: G.charcoal, color: G.bg }}
          >
            Explore Collection
          </Link>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-4 font-sans text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:opacity-85"
            style={{ background: "#128C7E", color: "#fff" }}
          >
            <SiWhatsapp />
            WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── footer ───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-10 px-5 flex flex-col items-center text-center border-t" style={{ background: G.bg, borderColor: G.border }}>
      <div className="w-8 h-px mb-7" style={{ background: G.gold }} />
      <Link href="/" className="font-serif text-xl tracking-[0.3em] mb-5 transition-opacity hover:opacity-60" style={{ color: G.charcoal }}>
        ANANYA
      </Link>
      <div className="flex flex-wrap justify-center gap-7 mb-5 font-sans uppercase tracking-widest text-[10px]" style={{ color: G.muted }}>
        <Link href="/collections" className="hover:opacity-60 transition-opacity">Collections</Link>
        <Link href="/about" className="hover:opacity-60 transition-opacity">Story</Link>
        <a href="https://wa.me/919876543210" className="hover:opacity-60 transition-opacity">Contact</a>
      </div>
      <div className="flex gap-5 mb-5" style={{ color: G.muted }}>
        <a href="#" className="hover:opacity-60 transition-opacity"><SiInstagram /></a>
        <a href="#" className="hover:opacity-60 transition-opacity"><SiPinterest /></a>
      </div>
      <p className="font-sans text-[10px] tracking-widest" style={{ color: G.muted }}>
        &copy; 2025 Ananya. All rights reserved.
      </p>
    </footer>
  );
}

/* ─── page ─────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: G.bg, color: G.charcoal }}>
      <PageNav />
      <Hero />

      <StorySection
        label="Where it began"
        heading="A question asked beside a loom in Varanasi."
        body={
          <>
            <p className="mb-4">
              In 2018, founder Priya Anand sat for the first time beside a pit loom in a narrow lane off Varanasi's Kabir Nagar. The weaver — a man named Ramesh — had been at his craft for thirty-one years. His loom was older than he was. The saree he was building, thread by thread, would take six weeks to complete.
            </p>
            <p>
              "He showed me the design — a peacock in gold zari — and told me he had learned it from his father, who learned it from his father. Three generations of one family, all living inside a single pattern." That conversation became Ananya.
            </p>
          </>
        }
        img="/images/bridal.png"
        imgAlt="A weaver at his loom in Varanasi"
      />

      <GoldLine className="container mx-auto max-w-6xl mx-5 md:mx-auto" />

      <StorySection
        label="The craft"
        heading="Everything we sell took longer to make than you might imagine."
        quote="The thread doesn't know it's becoming something beautiful. The weaver does."
        body={
          <>
            <p className="mb-4">
              A Benarasi silk takes anywhere from three to twelve weeks to weave, depending on the density of the zari and the complexity of the pattern. A Kanjivaram can require up to forty shuttles of coloured thread, each placed by hand in a sequence the weaver holds entirely in memory.
            </p>
            <p>
              No two Ananya sarees are identical. Even within the same design, the hand of the weaver introduces small variations — slight irregularities in the zari tension, a whisper of asymmetry in the border — that mark each piece as unrepeatable. We consider these not imperfections but signatures.
            </p>
          </>
        }
        img="/images/handloom.png"
        imgAlt="Close-up of handloom silk weaving"
        reverse
      />

      <StatsStrip />

      <StorySection
        label="The weavers"
        heading="We know every loom by name — because we know the person behind it."
        body={
          <>
            <p className="mb-4">
              Ananya currently works directly with 48 weaving families across six Indian states. We visit each workshop at least once a year. We share meals. We watch children grow up beside looms. We document each weaver's specific speciality — the patterns only they know, the techniques passed down in their family alone.
            </p>
            <p>
              When you buy an Ananya saree, we can tell you who wove it, where they live, and how long they have been working that specific loom. That information is not marketing copy. It is the product.
            </p>
          </>
        }
        img="/images/festive.png"
        imgAlt="Weaving community in South India"
      />

      <FullWidthQuote />
      <ValuesStrip />
      <FounderNote />
      <ClosingCTA />
      <Footer />
    </div>
  );
}
