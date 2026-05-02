import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { SiWhatsapp, SiInstagram, SiPinterest } from "react-icons/si";
import { SAREES } from "@/data/sarees";

const PALETTE = {
  bg: "#FAF7F2",
  cream: "#F3EDE3",
  gold: "#B8973E",
  paleGold: "#D4AF72",
  charcoal: "#2C2A26",
  muted: "#7A7060",
  dark: "#1C1A16",
};

function PageNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500"
      style={{ background: scrolled ? PALETTE.bg : `${PALETTE.bg}f5`, boxShadow: scrolled ? "0 1px 12px rgba(44,42,38,0.06)" : "none", paddingTop: scrolled ? "1rem" : "1.25rem", paddingBottom: scrolled ? "1rem" : "1.25rem" }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/collections" className="text-xs uppercase tracking-[0.2em] font-sans transition-colors duration-200" style={{ color: PALETTE.muted }} data-testid="nav-back">
            ← Collections
          </Link>
        </div>

        <Link href="/" className="font-serif text-2xl md:text-3xl tracking-[0.25em] transition-colors duration-300 hover:opacity-70" style={{ color: PALETTE.charcoal }} data-testid="nav-brand">
          ANANYA
        </Link>

        <div className="hidden md:flex gap-7 text-xs uppercase tracking-[0.2em] font-sans" style={{ color: PALETTE.muted }}>
          <Link href="/collections" className="hover:text-[#B8973E] transition-colors" data-testid="nav-collections">Collections</Link>
          <a href="/#story" className="hover:text-[#B8973E] transition-colors" data-testid="nav-story">Story</a>
        </div>

        <div className="md:hidden text-xs uppercase tracking-widest font-sans" style={{ color: PALETTE.muted }}>
          &nbsp;
        </div>
      </div>
    </motion.nav>
  );
}

function RelatedCard({ saree }: { saree: typeof SAREES[number] }) {
  return (
    <Link href={`/saree/${saree.id}`} data-testid={`related-card-${saree.id}`}>
      <motion.div
        className="group cursor-pointer"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="overflow-hidden aspect-[3/4] mb-3 relative">
          <motion.img
            src={saree.img}
            alt={saree.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A16]/55 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <span className="text-[#D4AF72] text-[10px] uppercase tracking-widest font-sans">View →</span>
          </div>
        </div>
        <p className="font-serif text-base font-light leading-snug" style={{ color: PALETTE.charcoal }}>{saree.name}</p>
        <p className="font-sans text-sm mt-1" style={{ color: PALETTE.muted }}>{saree.price}</p>
      </motion.div>
    </Link>
  );
}

export default function SareeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const saree = SAREES.find((s) => s.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!saree) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: PALETTE.bg }}>
        <p className="font-serif text-2xl mb-4" style={{ color: PALETTE.muted }}>Saree not found</p>
        <Link href="/collections" className="text-xs uppercase tracking-widest font-sans" style={{ color: PALETTE.gold }}>← Back to Collections</Link>
      </div>
    );
  }

  const related = SAREES.filter((s) => s.category === saree.category && s.id !== saree.id).slice(0, 4);
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in the "${saree.name}" (${saree.fabric}, ${saree.price}). Could you please share more details?`);

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.1, ease: "easeOut" } }),
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: PALETTE.bg, color: PALETTE.charcoal }}>
      <PageNav />

      {/* Main content */}
      <div className="pt-24 pb-0">
        {/* Hero grid: image + info */}
        <div className="container mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 xl:gap-24 items-start">

            {/* Image column */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
            >
              <div className="overflow-hidden aspect-[3/4] lg:aspect-[4/5] sticky top-24">
                <motion.img
                  src={saree.img}
                  alt={saree.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                {/* Category badge */}
                <div className="absolute top-5 left-5">
                  <span
                    className="px-3 py-1 text-[10px] uppercase tracking-[0.25em] font-sans"
                    style={{ background: "rgba(28,26,22,0.65)", color: PALETTE.paleGold, backdropFilter: "blur(6px)" }}
                  >
                    {saree.category}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Details column */}
            <div className="py-6 lg:py-12 flex flex-col gap-8">

              {/* Breadcrumb */}
              <motion.div
                className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-sans"
                style={{ color: PALETTE.muted }}
                custom={0} variants={fadeUp} initial="hidden" animate="visible"
              >
                <Link href="/" className="hover:text-[#B8973E] transition-colors">Home</Link>
                <span>/</span>
                <Link href="/collections" className="hover:text-[#B8973E] transition-colors">Collections</Link>
                <span>/</span>
                <span style={{ color: PALETTE.gold }}>{saree.category}</span>
              </motion.div>

              {/* Title & Price */}
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                <p className="text-xs uppercase tracking-[0.3em] font-sans mb-3" style={{ color: PALETTE.gold }}>
                  {saree.fabric} · {saree.origin}
                </p>
                <h1 className="font-serif text-3xl md:text-4xl xl:text-5xl font-light leading-tight mb-5" style={{ color: PALETTE.charcoal }}>
                  {saree.name}
                </h1>
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-2xl md:text-3xl font-light" style={{ color: PALETTE.charcoal }}>
                    {saree.price}
                  </span>
                  <span className="text-xs font-sans uppercase tracking-widest" style={{ color: PALETTE.muted }}>
                    Incl. all taxes
                  </span>
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div className="h-[1px]" style={{ background: `${PALETTE.paleGold}33` }} custom={2} variants={fadeUp} initial="hidden" animate="visible" />

              {/* Description */}
              <motion.p
                className="font-sans text-base leading-relaxed md:text-lg"
                style={{ color: PALETTE.muted }}
                custom={3} variants={fadeUp} initial="hidden" animate="visible"
              >
                {saree.description}
              </motion.p>

              {/* Occasion */}
              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
                <p className="text-[11px] uppercase tracking-[0.25em] font-sans mb-2" style={{ color: PALETTE.gold }}>Occasion</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: PALETTE.charcoal }}>{saree.occasion}</p>
              </motion.div>

              {/* Tags */}
              <motion.div
                className="flex flex-wrap gap-2"
                custom={5} variants={fadeUp} initial="hidden" animate="visible"
              >
                {saree.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-[11px] uppercase tracking-[0.15em] font-sans border"
                    style={{ border: `1px solid ${PALETTE.paleGold}55`, color: PALETTE.muted }}
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 pt-2"
                custom={6} variants={fadeUp} initial="hidden" animate="visible"
              >
                <a
                  href={`https://wa.me/919876543210?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-3 px-7 py-4 font-sans text-xs uppercase tracking-widest font-medium transition-all duration-300 hover:opacity-90 active:scale-[0.98] rounded-full"
                  style={{ background: "#25D366", color: "#fff" }}
                  data-testid="btn-whatsapp-saree"
                >
                  <SiWhatsapp className="text-base" />
                  Enquire on WhatsApp
                </a>
                <Link
                  href="/collections"
                  className="flex-1 inline-flex items-center justify-center px-7 py-4 font-sans text-xs uppercase tracking-widest transition-all duration-300 border hover:bg-[#2C2A26] hover:text-white"
                  style={{ borderColor: `${PALETTE.charcoal}40`, color: PALETTE.charcoal }}
                  data-testid="btn-view-more"
                >
                  View More
                </Link>
              </motion.div>

              {/* Divider */}
              <motion.div className="h-[1px]" style={{ background: `${PALETTE.paleGold}33` }} custom={7} variants={fadeUp} initial="hidden" animate="visible" />

              {/* Details accordion */}
              <motion.div
                className="flex flex-col gap-5"
                custom={8} variants={fadeUp} initial="hidden" animate="visible"
              >
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] font-sans mb-1.5" style={{ color: PALETTE.gold }}>Origin</p>
                    <p className="font-sans text-sm" style={{ color: PALETTE.charcoal }}>{saree.origin}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] font-sans mb-1.5" style={{ color: PALETTE.gold }}>Weave Time</p>
                    <p className="font-sans text-sm" style={{ color: PALETTE.charcoal }}>{saree.weaveTime}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] font-sans mb-1.5" style={{ color: PALETTE.gold }}>Fabric</p>
                    <p className="font-sans text-sm" style={{ color: PALETTE.charcoal }}>{saree.fabric}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] font-sans mb-1.5" style={{ color: PALETTE.gold }}>Category</p>
                    <p className="font-sans text-sm" style={{ color: PALETTE.charcoal }}>{saree.category}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] font-sans mb-2" style={{ color: PALETTE.gold }}>Care Instructions</p>
                  <ul className="space-y-1">
                    {saree.care.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 font-sans text-sm" style={{ color: PALETTE.muted }}>
                        <span style={{ color: PALETTE.gold, marginTop: 1 }}>—</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Related sarees */}
        {related.length > 0 && (
          <section className="mt-24 md:mt-32 border-t" style={{ borderColor: `${PALETTE.paleGold}25` }}>
            <div className="container mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-24">
              <motion.div
                className="flex flex-col items-center mb-12 md:mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <span className="text-[11px] uppercase tracking-[0.3em] font-sans mb-3" style={{ color: PALETTE.gold }}>
                  More from {saree.category}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-light" style={{ color: PALETTE.charcoal }}>
                  You may also like
                </h2>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
                {related.map((rel, i) => (
                  <motion.div
                    key={rel.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <RelatedCard saree={rel} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* WhatsApp CTA strip */}
        <section
          className="py-16 px-6 flex flex-col items-center text-center"
          style={{ background: PALETTE.dark }}
        >
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-serif text-2xl md:text-3xl font-light mb-3 text-white">
              Questions about this piece?
            </h3>
            <p className="font-sans text-sm mb-7 leading-relaxed" style={{ color: `${PALETTE.paleGold}cc` }}>
              Our styling experts are available on WhatsApp for personal consultations, sizing guidance, and custom inquiries.
            </p>
            <a
              href={`https://wa.me/919876543210?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 font-sans text-xs uppercase tracking-widest font-medium transition-all duration-300 hover:scale-105 rounded-full"
              style={{ background: "#25D366", color: "#fff" }}
              data-testid="btn-whatsapp-strip"
            >
              <SiWhatsapp />
              Chat on WhatsApp
            </a>
          </motion.div>
        </section>

        {/* Footer */}
        <footer
          className="py-12 px-6 flex flex-col items-center text-center border-t"
          style={{ background: PALETTE.bg, borderColor: `${PALETTE.paleGold}22` }}
        >
          <div className="w-10 h-[1px] mb-8" style={{ background: PALETTE.gold }} />
          <Link href="/" className="font-serif text-2xl tracking-[0.3em] mb-6 transition-colors hover:opacity-60" style={{ color: PALETTE.charcoal }} data-testid="footer-brand">
            ANANYA
          </Link>
          <div className="flex flex-wrap justify-center gap-6 mb-6 font-sans uppercase tracking-widest text-[10px]" style={{ color: PALETTE.muted }}>
            <Link href="/collections" className="hover:text-[#B8973E] transition-colors">Collections</Link>
            <a href="/#story" className="hover:text-[#B8973E] transition-colors">Story</a>
            <a href="/#contact" className="hover:text-[#B8973E] transition-colors">Contact</a>
          </div>
          <div className="flex gap-5 mb-6" style={{ color: PALETTE.muted }}>
            <a href="#" className="hover:text-[#B8973E] transition-colors" data-testid="footer-ig"><SiInstagram /></a>
            <a href="#" className="hover:text-[#B8973E] transition-colors" data-testid="footer-pin"><SiPinterest /></a>
          </div>
          <p className="font-sans text-[10px] tracking-widest" style={{ color: PALETTE.muted }}>
            &copy; 2025 Ananya. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
