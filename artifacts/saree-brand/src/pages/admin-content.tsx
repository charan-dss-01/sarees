import { useState, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Link } from "wouter";

/* ─── palette ─────────────────────────────────────────── */
const C = {
  sidebar: "#16151A",
  sidebarBorder: "rgba(255,255,255,0.06)",
  sidebarActive: "#25232D",
  bg: "#F4F3F1",
  surface: "#FFFFFF",
  border: "#E8E5E0",
  text: "#1A1917",
  muted: "#74716A",
  subtle: "#A09C94",
  gold: "#B8973E",
  goldLight: "#F5EDD6",
  green: "#2D9B6E",
  greenLight: "#E6F5EF",
  blue: "#2D6FB8",
  danger: "#C0392B",
  dangerLight: "#FCECEA",
};

/* ─── types ───────────────────────────────────────────── */
interface CollectionItem { id: string; title: string; subtitle: string; img: string; }
interface ArrivalItem    { id: string; name: string; price: string; img: string; }
interface HeroContent    { tagline: string; heading: string; subtitle: string; cta: string; img: string | null; }
interface StoryContent   { heading: string; body: string; img: string; }

interface PageSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  visible: boolean;
}

/* ─── initial state ───────────────────────────────────── */
const INIT_HERO: HeroContent = {
  tagline: "EST. 1987 · VARANASI",
  heading: "ANANYA",
  subtitle: "Where silk remembers its soul.",
  cta: "Explore Collection",
  img: null,
};

const INIT_COLLECTIONS: CollectionItem[] = [
  { id: "c1", title: "Bridal",   subtitle: "The Wedding Trousseau",  img: "/images/bridal.png" },
  { id: "c2", title: "Festive",  subtitle: "Celebration Silks",      img: "/images/festive.png" },
  { id: "c3", title: "Handloom", subtitle: "Artisanal Heritage",     img: "/images/handloom.png" },
];

const INIT_ARRIVALS: ArrivalItem[] = [
  { id: "a1", name: "Ivory & Gold Banarasi",   price: "₹24,500", img: "/images/arrival-1.png" },
  { id: "a2", name: "Midnight Blue Chanderi",  price: "₹18,000", img: "/images/arrival-2.png" },
  { id: "a3", name: "Regal Maroon Paithani",   price: "₹32,000", img: "/images/arrival-3.png" },
  { id: "a4", name: "Rose Pink Organza",        price: "₹16,500", img: "/images/arrival-4.png" },
];

const INIT_STORY: StoryContent = {
  heading: "Woven into every thread is a story.",
  body: "In the narrow, sun-drenched alleys of Varanasi, time moves differently. Here, our master weavers sit at traditional pit looms, hands moving with practiced grace.",
  img: "/images/story.png",
};

const INIT_SECTIONS: PageSection[] = [
  { id: "hero",        label: "Hero Banner",          visible: true, icon: <IconHero /> },
  { id: "collections", label: "Featured Collections", visible: true, icon: <IconGrid /> },
  { id: "arrivals",    label: "New Arrivals",          visible: true, icon: <IconTag /> },
  { id: "story",       label: "Brand Story",           visible: true, icon: <IconBook /> },
  { id: "whatsapp",    label: "WhatsApp CTA",          visible: true, icon: <IconChat /> },
];

/* ─── icon helpers ────────────────────────────────────── */
function IconHero()  { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="3" width="14" height="10" rx="1.5"/><path d="M1 6h14"/></svg>; }
function IconGrid()  { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>; }
function IconTag()   { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 1h6l7 7-6 6-7-7V1z"/><circle cx="4.5" cy="4.5" r="1"/></svg>; }
function IconBook()  { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 14s-7-2-7-8V3l7-2 7 2v3c0 6-7 8-7 8z"/></svg>; }
function IconChat()  { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M13 1H3a2 2 0 00-2 2v7a2 2 0 002 2h2l3 3 3-3h2a2 2 0 002-2V3a2 2 0 00-2-2z"/></svg>; }
function IconDrag()  { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 4h6M5 8h6M5 12h6"/></svg>; }
function IconEye()   { return <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/></svg>; }
function IconEyeOff(){ return <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 2l12 12M6.5 6.6A2 2 0 0010 10M5 4.3C2.7 5.7 1 8 1 8s3 5 7 5c1.5 0 2.9-.5 4-1.3M9 3.1A6.5 6.5 0 0115 8s-.8 1.4-2 2.6"/></svg>; }
function IconUpload(){ return <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 10V3M5 6l3-3 3 3"/><path d="M3 12v1.5a.5.5 0 00.5.5h9a.5.5 0 00.5-.5V12"/></svg>; }
function IconCheck() { return <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8l4 4 8-8"/></svg>; }

/* ─── image upload hook ───────────────────────────────── */
function useImageUpload(initial: string) {
  const [src, setSrc] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);
  function trigger() { inputRef.current?.click(); }
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setSrc(URL.createObjectURL(file));
    e.target.value = "";
  }
  return { src, setSrc, trigger, inputRef, onFile };
}

/* ─── upload button ───────────────────────────────────── */
function UploadBtn({ onTrigger }: { onTrigger: () => void }) {
  return (
    <button
      type="button"
      onClick={onTrigger}
      className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      style={{ background: "rgba(26,25,23,0.55)", backdropFilter: "blur(2px)" }}
    >
      <IconUpload />
      <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-white">Change</span>
    </button>
  );
}

/* ─── section card wrapper ────────────────────────────── */
function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border" style={{ background: C.surface, borderColor: C.border }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.border }}>
        <p className="font-sans font-semibold text-sm" style={{ color: C.text }}>{title}</p>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ─── text input ──────────────────────────────────────── */
function TextInput({ label, value, onChange, multiline = false }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans text-[10px] uppercase tracking-[0.2em]" style={{ color: C.subtle }}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg px-3 py-2.5 font-sans text-sm outline-none resize-none transition-colors"
          style={{ border: `1.5px solid ${C.border}`, color: C.text, background: C.bg }}
          onFocus={(e) => (e.target.style.borderColor = C.gold)}
          onBlur={(e) => (e.target.style.borderColor = C.border)}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg px-3 py-2.5 font-sans text-sm outline-none transition-colors"
          style={{ border: `1.5px solid ${C.border}`, color: C.text, background: C.bg }}
          onFocus={(e) => (e.target.style.borderColor = C.gold)}
          onBlur={(e) => (e.target.style.borderColor = C.border)}
        />
      )}
    </div>
  );
}

/* ─── sidebar ─────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Overview",    href: "/admin/dashboard", icon: <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="7" height="7" rx="1"/><rect x="11" y="2" width="7" height="7" rx="1"/><rect x="2" y="11" width="7" height="7" rx="1"/><rect x="11" y="11" width="7" height="7" rx="1"/></svg> },
  { label: "Sarees",      href: "#",                icon: <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4h12M4 8h12M4 12h8M4 16h5"/></svg> },
  { label: "Collections", href: "#",                icon: <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 5l8-3 8 3v10l-8 3-8-3V5z"/><path d="M10 2v16"/></svg> },
  { label: "Content",     href: "/admin/content",   icon: <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="16" height="14" rx="1.5"/><path d="M6 7h8M6 11h5"/></svg>, active: true },
  { label: "Enquiries",   href: "#",                icon: <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 4h16v11a1 1 0 01-1 1H3a1 1 0 01-1-1V4z"/><path d="M2 4l8 7 8-7"/></svg> },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-30 md:hidden" style={{ background: "rgba(0,0,0,0.4)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
        )}
      </AnimatePresence>
      <motion.aside
        className="fixed top-0 left-0 h-full z-40 flex flex-col"
        style={{ width: 224, background: C.sidebar, borderRight: `1px solid ${C.sidebarBorder}` }}
        initial={false}
        animate={{ x: open ? 0 : -224 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: C.sidebarBorder }}>
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: C.gold }}>
            <span className="font-serif text-xs text-white font-bold">A</span>
          </div>
          <div>
            <p className="font-serif text-sm tracking-widest text-white leading-none">ANANYA</p>
            <p className="font-sans text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Admin</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg relative transition-colors"
              style={{ background: item.active ? C.sidebarActive : "transparent", color: item.active ? "#fff" : "rgba(255,255,255,0.45)" }}
            >
              {item.active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style={{ background: C.gold }} />}
              <span style={{ color: item.active ? C.gold : "rgba(255,255,255,0.35)" }}>{item.icon}</span>
              <span className="font-sans text-[13px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t px-3 py-4 flex flex-col gap-0.5" style={{ borderColor: C.sidebarBorder }}>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 3h4v4M10 6l6-6"/><path d="M16 10v6H2V2h6"/></svg>
            <span className="font-sans text-[13px]">View Site</span>
          </Link>
          <div className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg border" style={{ borderColor: C.sidebarBorder }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: C.gold }}>
              <span className="font-sans text-[11px] font-semibold text-white">PA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-[12px] text-white truncate">Priya Anand</p>
              <p className="font-sans text-[10px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>Admin</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

/* ─── save toast ──────────────────────────────────────── */
function SaveToast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg font-sans text-sm"
          style={{ background: C.text, color: "#fff" }}
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <span style={{ color: C.gold }}><IconCheck /></span>
          Changes saved to draft
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── hero editor ─────────────────────────────────────── */
function HeroEditor() {
  const [hero, setHero] = useState<HeroContent>(INIT_HERO);
  const { src, trigger, inputRef, onFile } = useImageUpload("/images/story.png");
  const setField = (k: keyof HeroContent) => (v: string) => setHero(p => ({ ...p, [k]: v }));

  return (
    <SectionCard title="Hero Banner">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* preview */}
        <div className="flex flex-col gap-2">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em]" style={{ color: C.subtle }}>Preview</span>
          <div
            className="relative overflow-hidden rounded-lg group"
            style={{ aspectRatio: "16/9", background: "#2C2A26" }}
          >
            <img src={src} alt="hero" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-1">
              <p className="font-sans text-[8px] uppercase tracking-[0.3em] text-white/60">{hero.tagline}</p>
              <p className="font-serif text-2xl text-white tracking-widest">{hero.heading}</p>
              <p className="font-serif italic text-xs text-[#D4AF72]">{hero.subtitle}</p>
              <div className="mt-2 px-3 py-1 border border-white/40 text-white font-sans text-[8px] uppercase tracking-widest">
                {hero.cta}
              </div>
            </div>
            <UploadBtn onTrigger={trigger} />
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          </div>
          <p className="font-sans text-[11px]" style={{ color: C.subtle }}>Hover to change background image</p>
        </div>

        {/* fields */}
        <div className="flex flex-col gap-4">
          <TextInput label="Tagline" value={hero.tagline} onChange={setField("tagline")} />
          <TextInput label="Heading" value={hero.heading} onChange={setField("heading")} />
          <TextInput label="Subtitle" value={hero.subtitle} onChange={setField("subtitle")} />
          <TextInput label="CTA Button Text" value={hero.cta} onChange={setField("cta")} />
        </div>
      </div>
    </SectionCard>
  );
}

/* ─── collections editor ──────────────────────────────── */
function CollectionCard({ item, onChange }: {
  item: CollectionItem;
  onChange: (updated: CollectionItem) => void;
}) {
  const { src, trigger, inputRef, onFile } = useImageUpload(item.img);
  const update = (k: keyof CollectionItem) => (v: string) => onChange({ ...item, [k]: v });

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative overflow-hidden rounded-lg group cursor-pointer"
        style={{ aspectRatio: "3/4", background: C.bg }}
      >
        <img src={src} alt={item.title} className="w-full h-full object-cover" />
        <UploadBtn onTrigger={trigger} />
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

        <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 flex items-end justify-between"
          style={{ background: "linear-gradient(to top, rgba(26,25,23,0.7) 0%, transparent 100%)" }}>
          <span className="font-serif text-white text-sm">{item.title}</span>
          <span className="font-sans text-[9px] uppercase tracking-wider text-white/60 flex items-center gap-1">
            <IconUpload /> Upload
          </span>
        </div>
      </div>
      <TextInput label="Title" value={item.title} onChange={update("title")} />
      <TextInput label="Subtitle" value={item.subtitle} onChange={update("subtitle")} />
    </div>
  );
}

function CollectionsEditor() {
  const [items, setItems] = useState(INIT_COLLECTIONS);
  return (
    <SectionCard title="Featured Collections">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {items.map((item) => (
          <CollectionCard
            key={item.id}
            item={item}
            onChange={(updated) => setItems(p => p.map(i => i.id === updated.id ? updated : i))}
          />
        ))}
      </div>
    </SectionCard>
  );
}

/* ─── arrivals editor ─────────────────────────────────── */
function ArrivalRow({ item, onChange }: {
  item: ArrivalItem;
  onChange: (updated: ArrivalItem) => void;
}) {
  const { src, trigger, inputRef, onFile } = useImageUpload(item.img);

  return (
    <div className="flex items-center gap-4 py-3.5 border-b last:border-0" style={{ borderColor: C.border }}>
      {/* thumbnail */}
      <div
        className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 group cursor-pointer"
        style={{ background: C.bg }}
      >
        <img src={src} alt={item.name} className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={trigger}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(26,25,23,0.55)" }}
        >
          <span style={{ color: "#fff" }}><IconUpload /></span>
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>

      {/* fields */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextInput label="Name" value={item.name} onChange={(v) => onChange({ ...item, name: v })} />
        <TextInput label="Price" value={item.price} onChange={(v) => onChange({ ...item, price: v })} />
      </div>
    </div>
  );
}

function ArrivalsEditor() {
  const [items, setItems] = useState(INIT_ARRIVALS);
  return (
    <SectionCard title="New Arrivals">
      <div className="flex flex-col">
        {items.map((item) => (
          <ArrivalRow
            key={item.id}
            item={item}
            onChange={(updated) => setItems(p => p.map(i => i.id === updated.id ? updated : i))}
          />
        ))}
      </div>
    </SectionCard>
  );
}

/* ─── story editor ────────────────────────────────────── */
function StoryEditor() {
  const [story, setStory] = useState(INIT_STORY);
  const { src, trigger, inputRef, onFile } = useImageUpload(story.img);

  return (
    <SectionCard title="Brand Story">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* image */}
        <div className="flex flex-col gap-2">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em]" style={{ color: C.subtle }}>Story Image</span>
          <div
            className="relative overflow-hidden rounded-lg group cursor-pointer"
            style={{ aspectRatio: "4/5", background: C.bg }}
          >
            <img src={src} alt="story" className="w-full h-full object-cover" />
            <UploadBtn onTrigger={trigger} />
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          </div>
        </div>

        {/* text fields */}
        <div className="flex flex-col gap-4">
          <TextInput label="Heading" value={story.heading} onChange={(v) => setStory(p => ({ ...p, heading: v }))} />
          <TextInput label="Body Text" value={story.body} onChange={(v) => setStory(p => ({ ...p, body: v }))} multiline />
        </div>
      </div>
    </SectionCard>
  );
}

/* ─── section order ───────────────────────────────────── */
function SectionReorder() {
  const [sections, setSections] = useState(INIT_SECTIONS);

  return (
    <SectionCard
      title="Section Order"
      action={<span className="font-sans text-[11px]" style={{ color: C.subtle }}>Drag to reorder</span>}
    >
      <Reorder.Group axis="y" values={sections} onReorder={setSections} className="flex flex-col gap-2">
        {sections.map((sec, i) => (
          <Reorder.Item
            key={sec.id}
            value={sec}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border cursor-grab active:cursor-grabbing"
            style={{ background: C.bg, borderColor: C.border, userSelect: "none" }}
            whileDrag={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 10 }}
          >
            {/* position */}
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center font-sans text-[11px] font-semibold shrink-0"
              style={{ background: C.gold + "18", color: C.gold }}
            >
              {i + 1}
            </span>

            {/* drag handle */}
            <span style={{ color: C.subtle, cursor: "grab" }}><IconDrag /></span>

            {/* icon + label */}
            <span style={{ color: C.gold }}>{sec.icon}</span>
            <span className="flex-1 font-sans text-sm font-medium" style={{ color: C.text }}>{sec.label}</span>

            {/* visibility toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSections(p => p.map(s => s.id === sec.id ? { ...s, visible: !s.visible } : s));
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md font-sans text-[11px] font-medium transition-colors"
              style={{
                background: sec.visible ? C.greenLight : C.border,
                color: sec.visible ? C.green : C.subtle,
              }}
              data-testid={`toggle-${sec.id}`}
            >
              {sec.visible ? <><IconEye /> Visible</> : <><IconEyeOff /> Hidden</>}
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </SectionCard>
  );
}

/* ─── page ────────────────────────────────────────────── */
export default function AdminContentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2800);
    }, 800);
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: C.bg }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-[224px]">
        {/* topbar */}
        <header className="h-14 flex items-center gap-4 px-5 md:px-6 border-b shrink-0" style={{ background: C.surface, borderColor: C.border }}>
          <button className="md:hidden p-1.5 rounded" style={{ color: C.muted }} onClick={() => setSidebarOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 5h14M3 10h14M3 15h14"/></svg>
          </button>

          <div className="flex-1">
            <h1 className="font-sans font-semibold text-sm" style={{ color: C.text }}>Homepage Content</h1>
            <p className="font-sans text-[11px]" style={{ color: C.subtle }}>Manage images, text and section order</p>
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg font-sans text-xs border transition-colors hover:bg-[#F4F3F1]"
            style={{ borderColor: C.border, color: C.muted }}
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 7a6 6 0 1012 0A6 6 0 001 7z"/><path d="M5 7h4M7 5l2 2-2 2"/></svg>
            Preview Site
          </Link>

          <motion.button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-sans text-xs font-medium transition-opacity"
            style={{ background: C.text, color: "#fff", opacity: saving ? 0.7 : 1 }}
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            data-testid="btn-publish"
          >
            {saving ? (
              <>
                <motion.span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                Saving…
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7l3 3 7-7"/></svg>
                Publish Changes
              </>
            )}
          </motion.button>
        </header>

        {/* scrollable content */}
        <main className="flex-1 overflow-y-auto px-5 md:px-6 py-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-5">

            {/* info banner */}
            <motion.div
              className="flex items-start gap-3 px-4 py-3 rounded-lg border"
              style={{ background: C.goldLight, borderColor: C.gold + "33" }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round">
                <circle cx="8" cy="8" r="7"/><path d="M8 5v4M8 11h.01"/>
              </svg>
              <p className="font-sans text-xs leading-relaxed" style={{ color: "#7A5C1E" }}>
                Changes here update the live site content. Click <strong>Publish Changes</strong> to apply. Image uploads are previewed locally — connect cloud storage to persist them.
              </p>
            </motion.div>

            <SectionReorder />
            <HeroEditor />
            <CollectionsEditor />
            <ArrivalsEditor />
            <StoryEditor />

          </div>
        </main>
      </div>

      <SaveToast show={saved} />
    </div>
  );
}
