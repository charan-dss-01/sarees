import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Switch, Route, Router as WouterRouter, Link } from "wouter";
import { SiWhatsapp, SiInstagram, SiPinterest } from "react-icons/si";
import CollectionsPage from "@/pages/collections";
import SareeDetailPage from "@/pages/saree-detail";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import AdminLoginPage from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminContentPage from "@/pages/admin-content";
import { AuthProvider } from "@/contexts/AuthContext";
import { getCollections, getAllSarees, getHomepage, type ApiCollection, type UISaree } from "@/services/api";
import { NotificationProvider, useToast } from "@/components/NotificationToast";
import { getSocket } from "@/lib/socket";

function StickyNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-background shadow-sm py-4" : "bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-[0.2em] font-sans">
          <Link
            href="/collections"
            className={`hover:text-primary transition-colors ${
              scrolled ? "text-foreground" : "text-white"
            }`}
            data-testid="nav-collections"
          >
            Collections
          </Link>
          <a
            href="#story"
            className={`hover:text-primary transition-colors ${
              scrolled ? "text-foreground" : "text-white"
            }`}
            data-testid="nav-story"
          >
            Story
          </a>
        </div>

        <div
          className={`font-serif text-3xl tracking-[0.25em] text-center ${
            scrolled ? "text-foreground" : "text-white"
          }`}
          data-testid="nav-brand"
        >
          ANANYA
        </div>

        <div className="hidden md:flex gap-8 text-sm uppercase tracking-[0.2em] font-sans">
          <a
            href="#craftsmanship"
            className={`hover:text-primary transition-colors ${
              scrolled ? "text-foreground" : "text-white"
            }`}
            data-testid="nav-craftsmanship"
          >
            Craftsmanship
          </a>
          <a
            href="#contact"
            className={`hover:text-primary transition-colors ${
              scrolled ? "text-foreground" : "text-white"
            }`}
            data-testid="nav-contact"
          >
            Contact
          </a>
        </div>

        <div className="md:hidden flex items-center">
          <button className={`${scrolled ? "text-foreground" : "text-white"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden flex items-center justify-center">
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(circle at center, #B8973E 0%, #3D3020 40%, #2C2A26 100%)"
        }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 z-0 bg-black/20" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 mt-16">
        <motion.p
          className="text-primary-foreground/80 text-xs md:text-sm uppercase tracking-[0.4em] mb-6 font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          EST. 1987 · VARANASI
        </motion.p>

        <motion.h1
          className="font-serif text-6xl md:text-8xl lg:text-9xl text-white font-light tracking-widest mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          ANANYA
        </motion.h1>

        <motion.p
          className="font-serif italic text-xl md:text-3xl text-[#D4AF72] mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Where silk remembers its soul.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link
            href="/collections"
            className="px-8 py-3 border border-white/50 text-white font-sans text-sm uppercase tracking-widest hover:bg-primary hover:border-primary hover:text-white transition-all duration-400 ease-out relative group overflow-hidden inline-block"
            data-testid="btn-explore-hero"
          >
            <span className="relative z-10">Explore Collection</span>
            <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-white/50 text-xs uppercase tracking-widest font-sans">Scroll</span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <motion.div
            className="w-full h-1/2 bg-white"
            animate={{ y: [-24, 48] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

const STATIC_COLLECTIONS = [
  { _id: "s1", name: "Bridal",   subtitle: "The Wedding Trousseau", image: "/images/bridal.png",   createdAt: "" },
  { _id: "s2", name: "Festive",  subtitle: "Celebration Silks",     image: "/images/festive.png",  createdAt: "" },
  { _id: "s3", name: "Handloom", subtitle: "Artisanal Heritage",    image: "/images/handloom.png", createdAt: "" },
] satisfies (ApiCollection & { subtitle: string })[];

const STATIC_ARRIVALS = [
  { id: "a1", name: "Ivory & Gold Banarasi",  price: "₹24,500", img: "/images/arrival-1.png" },
  { id: "a2", name: "Midnight Blue Chanderi", price: "₹18,000", img: "/images/arrival-2.png" },
  { id: "a3", name: "Regal Maroon Paithani",  price: "₹32,000", img: "/images/arrival-3.png" },
  { id: "a4", name: "Rose Pink Organza",       price: "₹16,500", img: "/images/arrival-4.png" },
];

function CollectionSkeleton() {
  return (
    <div className="animate-pulse flex flex-col">
      <div className="aspect-[3/4] mb-6 bg-card" />
      <div className="flex flex-col items-center gap-2">
        <div className="h-2.5 bg-card rounded w-24" />
        <div className="h-7 bg-card rounded w-32" />
        <div className="h-2.5 bg-card rounded w-16" />
      </div>
    </div>
  );
}

function FeaturedCollections() {
  const [collections, setCollections] = useState<(ApiCollection & { subtitle?: string })[]>(STATIC_COLLECTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollections()
      .then((data) => { if (data.length > 0) setCollections(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="collections" className="py-24 md:py-32 bg-background px-6 md:px-12">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="flex flex-col items-center mb-16 md:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
        >
          <h2 className="font-serif text-4xl md:text-5xl text-foreground font-light mb-6">Our Collections</h2>
          <div className="w-24 h-[1px] bg-primary" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <CollectionSkeleton key={i} />)
            : collections.map((item, i) => (
              <motion.div
                key={item._id}
                className="group cursor-pointer flex flex-col"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.2 } }
                }}
                data-testid={`collection-card-${item.name.toLowerCase()}`}
              >
                <Link href="/collections" className="flex flex-col">
                  <div className="overflow-hidden aspect-[3/4] mb-6 relative bg-card">
                    <motion.img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-primary uppercase tracking-[0.2em] text-xs font-sans mb-3">
                      {"subtitle" in item ? (item as { subtitle: string }).subtitle : "Fine Silks"}
                    </span>
                    <h3 className="font-serif text-3xl text-foreground mb-4 font-light group-hover:text-primary transition-colors duration-300">{item.name}</h3>
                    <span className="text-muted-foreground uppercase tracking-widest text-xs font-sans pb-1 border-b border-transparent group-hover:border-primary transition-colors duration-300">Explore</span>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}

function NewArrivals() {
  const [products, setProducts] = useState<typeof STATIC_ARRIVALS>(STATIC_ARRIVALS);

  useEffect(() => {
    getAllSarees({ limit: 4 })
      .then(({ sarees }) => {
        if (sarees.length > 0) {
          setProducts(sarees.map((s) => ({ id: s.id, name: s.name, price: s.price, img: s.img })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 bg-card px-6 md:px-12 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="flex justify-between items-end mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
        >
          <h2 className="font-serif text-4xl text-foreground font-light">New Arrivals</h2>
          <Link href="/collections" className="hidden md:inline-block text-primary uppercase tracking-widest text-xs font-sans pb-1 border-b border-primary hover:text-foreground hover:border-foreground transition-colors duration-300" data-testid="link-view-all">View All</Link>
        </motion.div>

        <div className="flex overflow-x-auto gap-6 md:gap-8 pb-8 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {products.map((item, i) => (
            <motion.div
              key={i}
              className="min-w-[280px] md:min-w-[320px] max-w-[320px] flex-shrink-0 snap-start group cursor-pointer"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: i * 0.1 } }
              }}
              data-testid={`product-card-${i}`}
            >
              <div className="aspect-[3/4] overflow-hidden mb-5 bg-background relative">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              </div>
              <div className="flex flex-col">
                <h4 className="font-serif text-xl text-foreground mb-1 font-light">{item.name}</h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-muted-foreground font-sans text-sm">{item.price}</span>
                  <span className="text-primary text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">Add to Wishlist</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section id="story" className="py-24 md:py-32 bg-background px-6 md:px-12">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <motion.div
            className="flex flex-col order-2 md:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, x: -40 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
          >
            <h2 className="font-serif italic text-4xl md:text-5xl text-foreground font-light mb-8 leading-tight">
              Woven into every thread is a story.
            </h2>
            <div className="space-y-6 text-muted-foreground font-sans text-base leading-relaxed md:text-lg mb-10">
              <p>
                In the narrow, sun-drenched alleys of Varanasi, time moves differently. Here, our master weavers sit at traditional pit looms, hands moving with practiced grace, orchestrating a silent symphony of silk and zari.
              </p>
              <p>
                An Ananya saree is not manufactured; it is birthed. Each piece takes weeks, sometimes months, to complete. It is a living art form passed down through generations, holding within its folds the quiet dignity of true craftsmanship.
              </p>
            </div>
            <a href="#" className="inline-flex text-primary uppercase tracking-[0.2em] text-sm font-sans items-center group w-fit" data-testid="link-read-story">
              Read Our Story
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </motion.div>

          <motion.div
            className="order-1 md:order-2 aspect-[4/5] md:aspect-square overflow-hidden bg-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, x: 40 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } }
            }}
          >
            <img src="/images/story.png" alt="Craftsman weaving silk" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WhatsAppCTA() {
  return (
    <section className="py-24 px-6 md:px-12 bg-accent text-accent-foreground flex flex-col items-center text-center">
      <motion.div
        className="max-w-2xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
        }}
      >
        <h2 className="font-serif text-3xl md:text-5xl font-light mb-6">Your dream saree, just a message away.</h2>
        <p className="font-sans text-accent-foreground/80 text-sm md:text-base leading-relaxed mb-10">
          Speak directly with our styling experts. Personal consultations, custom orders, and exclusive pieces — available on WhatsApp.
        </p>
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-sans uppercase tracking-widest text-sm font-medium hover:bg-[#1EBE5A] transition-colors duration-300 hover:scale-105 transform ease-out"
          data-testid="btn-whatsapp"
        >
          <SiWhatsapp className="text-xl" />
          Chat on WhatsApp
        </a>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-background py-16 px-6 border-t border-border flex flex-col items-center text-center">
      <div className="w-16 h-[1px] bg-primary mb-12" />
      <h2 className="font-serif text-3xl tracking-[0.3em] text-foreground mb-8">ANANYA</h2>
      <div className="flex flex-wrap justify-center gap-8 mb-12 font-sans uppercase tracking-widest text-xs text-muted-foreground">
        <Link href="/collections" className="hover:text-primary transition-colors" data-testid="footer-link-collections">Collections</Link>
        <a href="#story" className="hover:text-primary transition-colors" data-testid="footer-link-story">Story</a>
        <a href="#contact" className="hover:text-primary transition-colors" data-testid="footer-link-contact">Contact</a>
      </div>
      <div className="flex gap-6 mb-12 text-muted-foreground">
        <a href="#" className="hover:text-primary transition-colors" data-testid="footer-social-ig"><SiInstagram className="text-xl" /></a>
        <a href="#" className="hover:text-primary transition-colors" data-testid="footer-social-pin"><SiPinterest className="text-xl" /></a>
      </div>
      <p className="font-sans text-xs text-muted-foreground tracking-widest">
        &copy; 2025 Ananya. All rights reserved.
      </p>
    </footer>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
      <StickyNav />
      <main>
        <HeroSection />
        <FeaturedCollections />
        <NewArrivals />
        <BrandStory />
        <WhatsAppCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ── socket listener — subscribes to real-time events ─────── */
function SocketListener() {
  const { push } = useToast();

  useEffect(() => {
    const socket = getSocket();

    function onNewSaree(data: { title: string; price: number; image: string }) {
      push({
        kind: "new_saree",
        title: `New saree added: ${data.title}`,
        body: `₹${Number(data.price).toLocaleString("en-IN")}`,
      });
    }

    function onAdminMessage(data: { message: string }) {
      push({
        kind: "admin_message",
        title: "Announcement",
        body: data.message,
      });
    }

    socket.on("new_saree", onNewSaree);
    socket.on("admin_message", onAdminMessage);

    return () => {
      socket.off("new_saree", onNewSaree);
      socket.off("admin_message", onAdminMessage);
    };
  }, [push]);

  return null;
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <SocketListener />
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/collections" component={CollectionsPage} />
            <Route path="/saree/:id" component={SareeDetailPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/admin" component={AdminLoginPage} />
            <Route path="/admin/dashboard" component={AdminDashboard} />
            <Route path="/admin/content" component={AdminContentPage} />
            <Route>
              <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
                <div className="text-center">
                  <p className="font-serif text-2xl text-[#7A7060] mb-4">Page not found</p>
                  <Link href="/" className="text-[#B8973E] uppercase tracking-widest text-xs font-sans">← Return Home</Link>
                </div>
              </div>
            </Route>
          </Switch>
        </WouterRouter>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
