import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { SiInstagram, SiPinterest, SiWhatsapp } from "react-icons/si";

const CATEGORIES = ["All", "Bridal", "Festive", "Handloom", "Contemporary"] as const;
type Category = typeof CATEGORIES[number];

const ALL_PIECES = [
  {
    id: 1,
    name: "Crimson Zari Bridal",
    category: "Bridal" as Category,
    fabric: "Benarasi Silk",
    price: "₹68,000",
    img: "/images/bridal.png",
    size: "tall",
  },
  {
    id: 2,
    name: "Ivory & Gold Banarasi",
    category: "Bridal" as Category,
    fabric: "Pure Silk",
    price: "₹24,500",
    img: "/images/arrival-1.png",
    size: "square",
  },
  {
    id: 3,
    name: "Emerald Kanjivaram",
    category: "Festive" as Category,
    fabric: "Kanjivaram Silk",
    price: "₹38,000",
    img: "/images/festive.png",
    size: "tall",
  },
  {
    id: 4,
    name: "Midnight Chanderi",
    category: "Contemporary" as Category,
    fabric: "Chanderi Silk",
    price: "₹18,000",
    img: "/images/arrival-2.png",
    size: "square",
  },
  {
    id: 5,
    name: "Heritage Silk Weave",
    category: "Handloom" as Category,
    fabric: "Hand-woven Silk",
    price: "₹52,000",
    img: "/images/handloom.png",
    size: "wide",
  },
  {
    id: 6,
    name: "Regal Maroon Paithani",
    category: "Festive" as Category,
    fabric: "Paithani Silk",
    price: "₹32,000",
    img: "/images/arrival-3.png",
    size: "tall",
  },
  {
    id: 7,
    name: "Rose Pink Organza",
    category: "Contemporary" as Category,
    fabric: "Pure Organza",
    price: "₹16,500",
    img: "/images/arrival-4.png",
    size: "square",
  },
  {
    id: 8,
    name: "Varanasi Artisan Loom",
    category: "Handloom" as Category,
    fabric: "Handspun Cotton-Silk",
    price: "₹44,000",
    img: "/images/story.png",
    size: "tall",
  },
  {
    id: 9,
    name: "Golden Bridal Drape",
    category: "Bridal" as Category,
    fabric: "Benarasi Brocade",
    price: "₹85,000",
    img: "/images/arrival-1.png",
    size: "square",
  },
  {
    id: 10,
    name: "Deep Festive Silk",
    category: "Festive" as Category,
    fabric: "Mysore Silk",
    price: "₹28,500",
    img: "/images/arrival-3.png",
    size: "square",
  },
  {
    id: 11,
    name: "Natural Loom Tussar",
    category: "Handloom" as Category,
    fabric: "Tussar Silk",
    price: "₹35,000",
    img: "/images/handloom.png",
    size: "tall",
  },
  {
    id: 12,
    name: "Blush Contemporary",
    category: "Contemporary" as Category,
    fabric: "Organza Georgette",
    price: "₹21,000",
    img: "/images/arrival-4.png",
    size: "square",
  },
];

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

        <Link href="/" className="font-serif text-2xl md:text-3xl tracking-[0.25em] text-[#2C2A26] text-center hover:text-[#B8973E] transition-colors duration-300" data-testid="nav-brand">
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
          <Link href="/" className="text-[#7A7060] text-xs uppercase tracking-widest font-sans">← Home</Link>
        </div>
      </div>
    </motion.nav>
  );
}

function CollectionCard({ piece, index }: { piece: typeof ALL_PIECES[number]; index: number }) {
  const aspectClass =
    piece.size === "tall"
      ? "aspect-[3/4]"
      : piece.size === "wide"
      ? "aspect-[4/3]"
      : "aspect-square";

  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      data-testid={`collection-card-${piece.id}`}
    >
      <div className={`${aspectClass} overflow-hidden relative`}>
        <motion.img
          src={piece.img}
          alt={piece.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A16]/75 via-[#1C1A16]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A16]/50 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <span className="block text-[#D4AF72] uppercase tracking-[0.2em] text-[10px] md:text-xs font-sans mb-1 opacity-90">
            {piece.category} · {piece.fabric}
          </span>
          <h3 className="font-serif text-white text-lg md:text-xl font-light leading-tight mb-2">
            {piece.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-white/80 font-sans text-sm">{piece.price}</span>
            <span className="text-[#D4AF72] uppercase tracking-widest text-[10px] font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              View →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered =
    activeCategory === "All"
      ? ALL_PIECES
      : ALL_PIECES.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2A26] font-sans">
      <CollectionsNav scrolled={scrolled} />

      <div className="pt-28 pb-6 px-6 md:px-12">
        <div className="container mx-auto max-w-7xl">
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
          </motion.div>

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

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-5 space-y-4 md:space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((piece, i) => (
                <div key={piece.id} className="break-inside-avoid">
                  <CollectionCard piece={piece} index={i} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

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
              Custom orders, personal styling consultations, and exclusive pieces available directly.
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

      <footer className="bg-[#FAF7F2] py-12 px-6 border-t border-[#D4AF72]/20 flex flex-col items-center text-center">
        <div className="w-10 h-[1px] bg-[#B8973E] mb-8" />
        <Link href="/" className="font-serif text-2xl tracking-[0.3em] text-[#2C2A26] hover:text-[#B8973E] transition-colors mb-6" data-testid="footer-brand">
          ANANYA
        </Link>
        <div className="flex flex-wrap justify-center gap-6 mb-6 font-sans uppercase tracking-widest text-[10px] text-[#7A7060]">
          <Link href="/collections" className="hover:text-[#B8973E] transition-colors" data-testid="footer-link-collections">Collections</Link>
          <a href="/#story" className="hover:text-[#B8973E] transition-colors" data-testid="footer-link-story">Story</a>
          <a href="/#contact" className="hover:text-[#B8973E] transition-colors" data-testid="footer-link-contact">Contact</a>
        </div>
        <div className="flex gap-5 mb-6 text-[#7A7060]">
          <a href="#" className="hover:text-[#B8973E] transition-colors" data-testid="footer-ig"><SiInstagram /></a>
          <a href="#" className="hover:text-[#B8973E] transition-colors" data-testid="footer-pin"><SiPinterest /></a>
        </div>
        <p className="font-sans text-[10px] text-[#7A7060] tracking-widest">
          &copy; 2025 Ananya. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
