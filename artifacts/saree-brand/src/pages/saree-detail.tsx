import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "wouter";
import { SiWhatsapp, SiInstagram, SiPinterest } from "react-icons/si";
import { getSareeById, getAllSarees, type UISaree } from "@/services/api";
import { SAREES } from "@/data/sarees";

/* ─── fallback static lookup ─────────────────────────────── */
function staticSaree(id: string): UISaree | null {
  const n = Number(id);
  const s = SAREES.find((x) => x.id === n);
  if (!s) return null;
  return { ...s, id: String(s.id), category: s.category };
}

/* ─── palette ─────────────────────────────────────────────── */
const G = {
  bg: "#FAF7F2", cream: "#F3EDE3", gold: "#B8973E", paleGold: "#D4AF72",
  charcoal: "#2C2A26", muted: "#7A7060", dark: "#1C1A16",
  border: "rgba(184,151,62,0.18)",
};

/* ─── nav ────────────────────────────────────────────────── */
function PageNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: G.bg,
        borderBottom: scrolled ? `1px solid ${G.border}` : "1px solid transparent",
        paddingBlock: scrolled ? "0.875rem" : "1.125rem",
        transition: "padding 0.4s ease, border-color 0.4s ease",
      }}
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <div className="container mx-auto px-5 md:px-10 flex items-center justify-between">
        <Link
          href="/collections"
          className="text-[11px] uppercase tracking-[0.22em] font-sans flex items-center gap-1.5 transition-colors hover:opacity-60"
          style={{ color: G.muted }}
          data-testid="nav-back"
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M5 1L1 5L5 9M1 5H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Collections
        </Link>
        <Link href="/" className="font-serif text-2xl tracking-[0.28em] transition-opacity hover:opacity-60" style={{ color: G.charcoal }} data-testid="nav-brand">
          ANANYA
        </Link>
        <div className="hidden md:flex gap-7 text-[11px] uppercase tracking-[0.2em] font-sans" style={{ color: G.muted }}>
          <Link href="/collections" className="transition-colors hover:opacity-60">Collections</Link>
          <a href="/#story" className="transition-colors hover:opacity-60">Story</a>
        </div>
        <div className="md:hidden w-24" />
      </div>
    </motion.nav>
  );
}

/* ─── loading skeleton ───────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="pt-20 md:pt-24">
      <div className="container mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start animate-pulse">
          <div className="aspect-[3/4] bg-[#EDE8DF]" />
          <div className="flex flex-col gap-5 py-8">
            <div className="h-3 bg-[#EDE8DF] w-1/3 rounded" />
            <div className="h-8 bg-[#EDE8DF] w-2/3 rounded" />
            <div className="h-6 bg-[#EDE8DF] w-1/4 rounded" />
            <div className="h-px bg-[#EDE8DF]" />
            <div className="space-y-2">
              <div className="h-3 bg-[#EDE8DF] rounded" />
              <div className="h-3 bg-[#EDE8DF] rounded w-5/6" />
              <div className="h-3 bg-[#EDE8DF] rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── gallery ────────────────────────────────────────────── */
function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const dragX = useRef(0);

  function go(next: number, dir: number) { setDirection(dir); setActive(next); }
  function prev() { go((active - 1 + images.length) % images.length, -1); }
  function next() { go((active + 1) % images.length, 1); }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: G.cream }}>
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 text-[10px] uppercase tracking-[0.22em] font-sans" style={{ background: "rgba(28,26,22,0.6)", color: G.paleGold, backdropFilter: "blur(8px)" }}>
            Ananya
          </span>
        </div>

        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={active}
            src={images[active]}
            alt={`${name} — view ${active + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.32, 0, 0.67, 0] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragStart={() => { dragX.current = 0; }}
            onDrag={(_e, info) => { dragX.current = info.offset.x; }}
            onDragEnd={() => {
              if (dragX.current < -48) next();
              else if (dragX.current > 48) prev();
            }}
            style={{ userSelect: "none", WebkitUserDrag: "none" } as React.CSSProperties}
            data-testid={`gallery-img-${active}`}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button onClick={prev} className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background: "rgba(250,247,242,0.85)", backdropFilter: "blur(4px)" }} data-testid="btn-gallery-prev">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M5 1L1 5L5 9M1 5H13" stroke={G.charcoal} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={next} className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background: "rgba(250,247,242,0.85)", backdropFilter: "blur(4px)" }} data-testid="btn-gallery-next">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1L13 5L9 9M13 5H1" stroke={G.charcoal} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 md:hidden">
            {images.map((_, i) => (
              <button key={i} onClick={() => go(i, i > active ? 1 : -1)} className="transition-all duration-300" style={{ width: i === active ? 20 : 6, height: 4, background: i === active ? G.paleGold : "rgba(250,247,242,0.55)", borderRadius: 2 }} data-testid={`dot-${i}`} />
            ))}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="hidden md:flex gap-2.5">
          {images.map((src, i) => (
            <button key={i} onClick={() => go(i, i > active ? 1 : -1)} className="flex-1 overflow-hidden transition-all duration-300" style={{ aspectRatio: "3/4", outline: i === active ? `2px solid ${G.gold}` : "2px solid transparent", opacity: i === active ? 1 : 0.55 }} data-testid={`thumb-${i}`}>
              <img src={src} alt={`${name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── related card ───────────────────────────────────────── */
function RelatedCard({ saree }: { saree: UISaree }) {
  return (
    <Link href={`/saree/${saree.id}`} data-testid={`related-card-${saree.id}`}>
      <motion.div className="group cursor-pointer" whileHover={{ y: -3 }} transition={{ duration: 0.3 }}>
        <div className="overflow-hidden mb-3" style={{ aspectRatio: "3/4", background: G.cream }}>
          <motion.img src={saree.img} alt={saree.name} className="w-full h-full object-cover" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} />
        </div>
        <p className="font-serif text-sm font-light leading-snug mb-0.5" style={{ color: G.charcoal }}>{saree.name}</p>
        <p className="font-sans text-xs" style={{ color: G.muted }}>{saree.price}</p>
      </motion.div>
    </Link>
  );
}

/* ─── page ───────────────────────────────────────────────── */
export default function SareeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";

  const [saree, setSaree] = useState<UISaree | null>(null);
  const [related, setRelated] = useState<UISaree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

    setLoading(true);
    setError(null);

    getSareeById(id)
      .then((data) => {
        setSaree(data);
        // fetch related by same category
        return getAllSarees({ limit: 20 }).then(({ sarees }) => {
          setRelated(sarees.filter((s) => s.category === data.category && s.id !== id).slice(0, 4));
        }).catch(() => {
          // fallback related from static data
          const fallback = SAREES
            .filter((s) => s.category === data.category && String(s.id) !== id)
            .slice(0, 4)
            .map((s) => ({ ...s, id: String(s.id), category: s.category }));
          setRelated(fallback);
        });
      })
      .catch(() => {
        // try static fallback
        const fb = staticSaree(id);
        if (fb) {
          setSaree(fb);
          const fallbackRelated = SAREES
            .filter((s) => s.category === fb.category && String(s.id) !== id)
            .slice(0, 4)
            .map((s) => ({ ...s, id: String(s.id), category: s.category }));
          setRelated(fallbackRelated);
        } else {
          setError("Saree not found.");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen font-sans" style={{ background: G.bg }}>
        <PageNav />
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !saree) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: G.bg }}>
        <p className="font-serif text-2xl" style={{ color: G.muted }}>Saree not found</p>
        <Link href="/collections" className="text-xs uppercase tracking-widest font-sans" style={{ color: G.gold }}>← Back to Collections</Link>
      </div>
    );
  }

  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in "${saree.name}" (${saree.fabric}, ${saree.price}). Could you share more details?`);

  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    }),
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: G.bg, color: G.charcoal }}>
      <PageNav />

      {/* hero grid */}
      <div className="pt-20 md:pt-24">
        <div className="container mx-auto max-w-6xl px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16 xl:gap-20 items-start">

            {/* gallery */}
            <motion.div className="lg:sticky lg:top-24" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <Gallery images={saree.images} name={saree.name} />
            </motion.div>

            {/* details */}
            <div className="flex flex-col gap-7 py-0 lg:py-8">
              {/* breadcrumb */}
              <motion.nav className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] font-sans flex-wrap" style={{ color: G.muted }} custom={0} variants={fadeUp} initial="hidden" animate="show">
                <Link href="/" className="hover:opacity-60 transition-opacity">Home</Link>
                <span style={{ color: G.paleGold }}>/</span>
                <Link href="/collections" className="hover:opacity-60 transition-opacity">Collections</Link>
                <span style={{ color: G.paleGold }}>/</span>
                <span style={{ color: G.gold }}>{saree.category}</span>
              </motion.nav>

              {/* name + price */}
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
                <p className="text-[11px] uppercase tracking-[0.3em] font-sans mb-2.5" style={{ color: G.gold }}>
                  {saree.fabric} · {saree.origin}
                </p>
                <h1 className="font-serif font-light leading-tight mb-5" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: G.charcoal }}>
                  {saree.name}
                </h1>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl md:text-3xl font-light" style={{ color: G.charcoal }}>{saree.price}</span>
                  <span className="text-[10px] font-sans uppercase tracking-widest" style={{ color: G.muted }}>Incl. all taxes</span>
                </div>
              </motion.div>

              <motion.div className="h-px" style={{ background: G.border }} custom={2} variants={fadeUp} initial="hidden" animate="show" />

              {/* description */}
              <motion.p className="font-sans leading-[1.8] text-sm md:text-base" style={{ color: G.muted }} custom={3} variants={fadeUp} initial="hidden" animate="show">
                {saree.description}
              </motion.p>

              {/* occasion */}
              {saree.occasion && (
                <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
                  <p className="text-[10px] uppercase tracking-[0.26em] font-sans mb-1.5" style={{ color: G.gold }}>Occasion</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: G.charcoal }}>{saree.occasion}</p>
                </motion.div>
              )}

              {/* tags */}
              {saree.tags.length > 0 && (
                <motion.div className="flex flex-wrap gap-2" custom={5} variants={fadeUp} initial="hidden" animate="show">
                  {saree.tags.map((tag) => (
                    <span key={tag} className="px-3.5 py-1 text-[10px] uppercase tracking-[0.18em] font-sans" style={{ border: `1px solid ${G.border}`, color: G.muted }}>
                      {tag}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* CTA */}
              <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="pt-1">
                <a
                  href={`https://wa.me/919876543210?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full flex items-center justify-center gap-3 font-sans text-sm uppercase tracking-[0.22em] font-medium transition-all duration-300 relative overflow-hidden"
                  style={{ background: "#128C7E", color: "#fff", paddingBlock: "1.1rem" }}
                  data-testid="btn-whatsapp-saree"
                >
                  <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-out" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
                  <SiWhatsapp className="text-lg relative z-10" />
                  <span className="relative z-10">Enquire on WhatsApp</span>
                </a>
                <Link
                  href="/collections"
                  className="mt-3 w-full flex items-center justify-center py-4 font-sans text-xs uppercase tracking-[0.22em] transition-all duration-300 border hover:bg-[#2C2A26] hover:text-white"
                  style={{ borderColor: `${G.charcoal}25`, color: G.charcoal }}
                  data-testid="btn-view-all"
                >
                  View All Collections
                </Link>
              </motion.div>

              <motion.div className="h-px" style={{ background: G.border }} custom={7} variants={fadeUp} initial="hidden" animate="show" />

              {/* details grid */}
              <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show">
                <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-6">
                  {([
                    ["Origin", saree.origin],
                    ["Weave Time", saree.weaveTime],
                    ["Fabric", saree.fabric],
                    ["Category", saree.category],
                  ] as [string, string][]).map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[10px] uppercase tracking-[0.26em] font-sans mb-1" style={{ color: G.gold }}>{label}</p>
                      <p className="font-sans text-sm" style={{ color: G.charcoal }}>{val}</p>
                    </div>
                  ))}
                </div>

                {saree.care.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.26em] font-sans mb-2.5" style={{ color: G.gold }}>Care Instructions</p>
                    <ul className="space-y-1.5">
                      {saree.care.map((c, i) => (
                        <li key={i} className="flex items-start gap-2.5 font-sans text-sm leading-snug" style={{ color: G.muted }}>
                          <span className="mt-[3px] shrink-0 w-3 h-px inline-block" style={{ background: G.paleGold }} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-20 md:mt-28 border-t" style={{ borderColor: G.border }}>
          <div className="container mx-auto max-w-6xl px-5 md:px-10 py-16 md:py-20">
            <motion.div className="flex flex-col items-start mb-10 md:mb-12" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans mb-2" style={{ color: G.gold }}>More from {saree.category}</span>
              <h2 className="font-serif text-2xl md:text-3xl font-light" style={{ color: G.charcoal }}>You may also like</h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
              {related.map((rel, i) => (
                <motion.div key={rel.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.09 }}>
                  <RelatedCard saree={rel} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* bottom WhatsApp */}
      <section style={{ background: G.dark }}>
        <motion.div className="container mx-auto max-w-xl px-5 py-16 md:py-20 flex flex-col items-center text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="block text-[10px] uppercase tracking-[0.3em] font-sans mb-4" style={{ color: G.paleGold }}>Personal Consultation</span>
          <h3 className="font-serif text-2xl md:text-3xl font-light mb-3 text-white leading-snug">Questions about this piece?</h3>
          <p className="font-sans text-sm mb-9 leading-relaxed" style={{ color: "rgba(212,175,114,0.75)" }}>Our styling experts are on WhatsApp for consultations, custom orders, and sizing guidance.</p>
          <a href={`https://wa.me/919876543210?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 font-sans text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] relative overflow-hidden" style={{ background: "#128C7E", color: "#fff", padding: "1rem 2.25rem" }} data-testid="btn-whatsapp-bottom">
            <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-out" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
            <SiWhatsapp className="text-base relative z-10" />
            <span className="relative z-10">Chat on WhatsApp</span>
          </a>
        </motion.div>
      </section>

      {/* footer */}
      <footer className="py-12 px-5 flex flex-col items-center text-center border-t" style={{ background: G.bg, borderColor: G.border }}>
        <div className="w-8 h-px mb-7" style={{ background: G.gold }} />
        <Link href="/" className="font-serif text-xl tracking-[0.3em] mb-5 transition-opacity hover:opacity-60" style={{ color: G.charcoal }} data-testid="footer-brand">ANANYA</Link>
        <div className="flex flex-wrap justify-center gap-7 mb-5 font-sans uppercase tracking-widest text-[10px]" style={{ color: G.muted }}>
          <Link href="/collections" className="hover:opacity-60 transition-opacity">Collections</Link>
          <a href="/#story" className="hover:opacity-60 transition-opacity">Story</a>
          <a href="/#contact" className="hover:opacity-60 transition-opacity">Contact</a>
        </div>
        <div className="flex gap-5 mb-5" style={{ color: G.muted }}>
          <a href="#" className="hover:opacity-60 transition-opacity" data-testid="footer-ig"><SiInstagram /></a>
          <a href="#" className="hover:opacity-60 transition-opacity" data-testid="footer-pin"><SiPinterest /></a>
        </div>
        <p className="font-sans text-[10px] tracking-widest" style={{ color: G.muted }}>&copy; 2025 Ananya. All rights reserved.</p>
      </footer>
    </div>
  );
}
