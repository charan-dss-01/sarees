import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { SiInstagram, SiPinterest, SiWhatsapp } from "react-icons/si";
import { SAREES, CATEGORIES, type FilterCategory } from "@/data/sarees";

function CollectionsNav({ scrolled }: { scrolled: boolean }) {
  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-[#FAF7F2] shadow-sm py-4" : "bg-[#FAF7F2]/95 py-5"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] font-sans text-[#7A7060]">
          <Link href="/collections" className="text-[#B8973E] font-medium" data-testid="nav-collections">
            Collections
          </Link>
          <a href="/#story" className="hover:text-[#B8973E] transition-colors" data-testid="nav-story">
            Story
          </a>
        </div>

        <Link
          href="/"
          className="font-serif text-2xl md:text-3xl tracking-[0.25em] text-[#2C2A26] text-center hover:text-[#B8973E] transition-colors duration-300"
          data-testid="nav-brand"
        >
          ANANYA
        </Link>

        <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] font-sans text-[#7A7060]">
          <a href="/#craftsmanship" className="hover:text-[#B8973E] transition-colors" data-testid="nav-craftsmanship">
            Craftsmanship
          </a>
          <a href="/#contact" className="hover:text-[#B8973E] transition-colors" data-testid="nav-contact">
            Contact
          </a>
        </div>

        <div className="md:hidden">
          <Link href="/" className="text-[#7A7060] text-xs uppercase tracking-widest font-sans">
            ← Home
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

function SareeCard({
  saree,
  index,
}: {
  saree: (typeof SAREES)[number];
  index: number;
}) {
  const aspectClass =
    saree.size === "tall"
      ? "aspect-[3/4]"
      : saree.size === "wide"
      ? "aspect-[4/3]"
      : "aspect-square";

  return (
    <Link href={`/saree/${saree.id}`} data-testid={`saree-card-${saree.id}`}>
      <motion.div
        className="group relative cursor-pointer overflow-hidden"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
      >
        <div className={`${aspectClass} overflow-hidden relative`}>
          {/* Base gradient always visible for legibility */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#1C1A16]/60 via-[#1C1A16]/05 to-transparent" />

          {/* Deeper hover overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#1C1A16]/80 via-[#1C1A16]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <motion.img
            src={saree.img}
            alt={saree.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          {/* Card content overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-5 md:p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <span className="block text-[#D4AF72] uppercase tracking-[0.2em] text-[10px] md:text-xs font-sans mb-1.5">
              {saree.category} · {saree.fabric}
            </span>
            <h3 className="font-serif text-white text-lg md:text-xl font-light leading-tight mb-2">
              {saree.name}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-white/75 font-sans text-sm">{saree.price}</span>
              <motion.span
                className="text-[#D4AF72] uppercase tracking-widest text-[10px] font-sans"
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  View details →
                </span>
              </motion.span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered =
    activeCategory === "All"
      ? SAREES
      : SAREES.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2A26] font-sans">
      <CollectionsNav scrolled={scrolled} />

      <div className="pt-28 pb-6 px-6 md:px-12">
        <div className="container mx-auto max-w-7xl">

          {/* Page heading */}
          <motion.div
            className="flex flex-col items-center text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#B8973E] uppercase tracking-[0.35em] text-xs font-sans mb-4">
              The Ananya Edit
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-[#2C2A26] font-light tracking-wide mb-5">
              Collections
            </h1>
            <div className="w-16 h-[1px] bg-[#B8973E]" />
            <p className="mt-6 text-[#7A7060] font-sans text-sm max-w-md leading-relaxed">
              Each piece is woven by hand, carrying the heritage of Indian textile traditions. Select any saree to explore its full story.
            </p>
          </motion.div>

          {/* Category filters */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-xs uppercase tracking-[0.2em] font-sans transition-all duration-300 border ${
                  activeCategory === cat
                    ? "border-[#B8973E] bg-[#B8973E] text-white"
                    : "border-[#D4AF72]/40 text-[#7A7060] hover:border-[#B8973E] hover:text-[#B8973E]"
                }`}
                data-testid={`filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Masonry grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-5 space-y-4 md:space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((saree, i) => (
                <div key={saree.id} className="break-inside-avoid">
                  <SareeCard saree={saree} index={i} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Count label */}
          <motion.p
            className="text-center font-sans text-xs uppercase tracking-widest mt-10 text-[#7A7060]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}{" "}
            {activeCategory !== "All" ? `in ${activeCategory}` : "in collection"}
          </motion.p>

          {/* WhatsApp CTA */}
          <motion.div
            className="flex flex-col items-center mt-16 md:mt-24 py-16 border-t border-[#D4AF72]/20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-2xl md:text-4xl font-light text-[#2C2A26] mb-3 text-center">
              Your dream saree, just a message away.
            </h2>
            <p className="text-[#7A7060] font-sans text-sm mb-8 text-center max-w-md leading-relaxed">
              Custom orders, personal styling consultations, and exclusive pieces — speak with our experts directly.
            </p>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-3.5 font-sans uppercase tracking-widest text-xs hover:bg-[#1EBE5A] transition-all duration-300 hover:scale-105 transform rounded-full"
              data-testid="btn-whatsapp-collections"
            >
              <SiWhatsapp className="text-base" />
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#FAF7F2] py-12 px-6 border-t border-[#D4AF72]/20 flex flex-col items-center text-center">
        <div className="w-10 h-[1px] bg-[#B8973E] mb-8" />
        <Link
          href="/"
          className="font-serif text-2xl tracking-[0.3em] text-[#2C2A26] hover:text-[#B8973E] transition-colors mb-6"
          data-testid="footer-brand"
        >
          ANANYA
        </Link>
        <div className="flex flex-wrap justify-center gap-6 mb-6 font-sans uppercase tracking-widest text-[10px] text-[#7A7060]">
          <Link href="/collections" className="hover:text-[#B8973E] transition-colors" data-testid="footer-link-collections">
            Collections
          </Link>
          <a href="/#story" className="hover:text-[#B8973E] transition-colors" data-testid="footer-link-story">
            Story
          </a>
          <a href="/#contact" className="hover:text-[#B8973E] transition-colors" data-testid="footer-link-contact">
            Contact
          </a>
        </div>
        <div className="flex gap-5 mb-6 text-[#7A7060]">
          <a href="#" className="hover:text-[#B8973E] transition-colors" data-testid="footer-ig">
            <SiInstagram />
          </a>
          <a href="#" className="hover:text-[#B8973E] transition-colors" data-testid="footer-pin">
            <SiPinterest />
          </a>
        </div>
        <p className="font-sans text-[10px] text-[#7A7060] tracking-widest">
          &copy; 2025 Ananya. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
