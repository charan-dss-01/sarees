import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  getToken, clearToken, getAllSarees, getCollections, getAnalytics,
  type UISaree, type ApiCollection, type AnalyticsData, type MonthlyUpload,
} from "@/services/api";
import { useToast } from "@/components/NotificationToast";

/* ─── palette ─────────────────────────────────────── */
const C = {
  sidebar: "#16151A",
  sidebarHover: "#1F1E25",
  sidebarActive: "#25232D",
  sidebarBorder: "rgba(255,255,255,0.06)",
  bg: "#F4F3F1",
  surface: "#FFFFFF",
  border: "#E8E5E0",
  borderStrong: "#D4CFC7",
  text: "#1A1917",
  muted: "#74716A",
  subtle: "#A09C94",
  gold: "#B8973E",
  goldLight: "#F5EDD6",
  green: "#2D9B6E",
  greenLight: "#E6F5EF",
  blue: "#2D6FB8",
  blueLight: "#E6EEFA",
  red: "#C0392B",
  redLight: "#FCECEA",
};

/* ─── static fallback activity ───────────────────── */
const ACTIVITY = [
  { time: "2 min ago",  text: "New enquiry for Crimson Zari Bridal",        dot: C.green },
  { time: "18 min ago", text: "Collection page visited 43 times today",     dot: C.blue },
  { time: "1 hr ago",   text: "Heritage Silk Weave marked as featured",     dot: C.gold },
  { time: "3 hr ago",   text: "WhatsApp enquiry: Midnight Chanderi",        dot: C.green },
  { time: "Yesterday",  text: "Blush Contemporary added to inventory",      dot: C.muted },
];

/* ─── nav items ───────────────────────────────────── */
const NAV = [
  {
    label: "Overview",
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="7" height="7" rx="1"/><rect x="11" y="2" width="7" height="7" rx="1"/>
        <rect x="2" y="11" width="7" height="7" rx="1"/><rect x="11" y="11" width="7" height="7" rx="1"/>
      </svg>
    ),
    active: true,
  },
  {
    label: "Sarees",
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h12M4 8h12M4 12h8M4 16h5"/>
      </svg>
    ),
    active: false,
  },
  {
    label: "Collections",
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 5l8-3 8 3v10l-8 3-8-3V5z"/><path d="M10 2v16M2 5l8 3 8-3"/>
      </svg>
    ),
    active: false,
  },
  {
    label: "Enquiries",
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4h16v11a1 1 0 01-1 1H3a1 1 0 01-1-1V4z"/><path d="M2 4l8 7 8-7"/>
      </svg>
    ),
    active: false,
    badge: 4,
  },
  {
    label: "Uploads",
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13V4M7 7l3-3 3 3"/><path d="M4 14v2a1 1 0 001 1h10a1 1 0 001-1v-2"/>
      </svg>
    ),
    active: false,
  },
];

const NAV_BOTTOM = [
  {
    label: "Settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="2.5"/>
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"/>
      </svg>
    ),
  },
  {
    label: "View Site",
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3h5v5M11 9l6-6"/><path d="M17 12v5H3V3h5"/>
      </svg>
    ),
    href: "/",
  },
];

/* ─── sidebar ─────────────────────────────────────── */
function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* mobile backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: "rgba(0,0,0,0.45)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed top-0 left-0 h-full z-40 flex flex-col select-none"
        style={{
          width: 224,
          background: C.sidebar,
          borderRight: `1px solid ${C.sidebarBorder}`,
        }}
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

        {/* primary nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
          {NAV.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-150 relative"
              style={{
                background: item.active ? C.sidebarActive : "transparent",
                color: item.active ? "#fff" : "rgba(255,255,255,0.45)",
              }}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              {item.active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style={{ background: C.gold }} />
              )}
              <span style={{ color: item.active ? C.gold : "rgba(255,255,255,0.35)" }}>{item.icon}</span>
              <span className="font-sans text-[13px] font-medium flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded-full" style={{ background: C.gold, color: "#fff" }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* bottom nav */}
        <div className="border-t px-3 py-4 flex flex-col gap-0.5" style={{ borderColor: C.sidebarBorder }}>
          {NAV_BOTTOM.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <span>{item.icon}</span>
                <span className="font-sans text-[13px]">{item.label}</span>
              </Link>
            ) : (
              <button
                key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 w-full"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <span>{item.icon}</span>
                <span className="font-sans text-[13px]">{item.label}</span>
              </button>
            )
          )}

          {/* user row */}
          <div className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg border" style={{ borderColor: C.sidebarBorder }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: C.gold }}>
              <span className="font-sans text-[11px] font-semibold text-white">PA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-[12px] text-white truncate">Priya Anand</p>
              <p className="font-sans text-[10px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>Admin</p>
            </div>
            <Link href="/admin" className="transition-opacity hover:opacity-60" style={{ color: "rgba(255,255,255,0.3)" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2h4v4M14 2l-6 6M6 4H3a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-3"/>
              </svg>
            </Link>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

/* ─── topbar ──────────────────────────────────────── */
function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [search, setSearch] = useState("");

  return (
    <header
      className="h-14 flex items-center gap-4 px-5 md:px-6 border-b shrink-0"
      style={{ background: C.surface, borderColor: C.border }}
    >
      {/* hamburger */}
      <button
        className="md:hidden p-1.5 rounded transition-colors"
        style={{ color: C.muted }}
        onClick={onMenuClick}
        data-testid="btn-menu"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M3 5h14M3 10h14M3 15h14"/>
        </svg>
      </button>

      {/* page title */}
      <div className="flex-1">
        <h1 className="font-sans font-semibold text-sm" style={{ color: C.text }}>Overview</h1>
        <p className="font-sans text-[11px]" style={{ color: C.subtle }}>Welcome back, Priya</p>
      </div>

      {/* search */}
      <div
        className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-lg border"
        style={{ background: C.bg, borderColor: C.border, width: 220 }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={C.subtle} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/>
        </svg>
        <input
          placeholder="Search sarees…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none font-sans text-xs w-full"
          style={{ color: C.text }}
          data-testid="topbar-search"
        />
      </div>

      {/* action buttons */}
      <button
        className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg font-sans text-xs font-medium transition-opacity hover:opacity-85"
        style={{ background: C.text, color: "#fff" }}
        data-testid="btn-add-saree"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M7 1v12M1 7h12"/>
        </svg>
        Add Saree
      </button>

      {/* notifications */}
      <button className="relative p-2 rounded-lg transition-colors hover:bg-[#F4F3F1]" style={{ color: C.muted }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2a6 6 0 016 6v3l1.5 2.5H2.5L4 11V8a6 6 0 016-6z"/><path d="M8.5 17a1.5 1.5 0 003 0"/>
        </svg>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: C.gold }} />
      </button>
    </header>
  );
}

/* ─── stat card ───────────────────────────────────── */
function StatCard({
  label, value, sub, icon, accent, trend,
}: {
  label: string; value: string | number; sub: string;
  icon: React.ReactNode; accent: string; accentLight: string;
  trend?: { dir: "up" | "down"; text: string };
} & { accentLight: string }) {
  return (
    <motion.div
      className="rounded-xl p-5 flex flex-col gap-4 border"
      style={{ background: C.surface, borderColor: C.border }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: accent + "18", color: accent }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className="flex items-center gap-1 font-sans text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{
              background: trend.dir === "up" ? C.greenLight : C.redLight,
              color: trend.dir === "up" ? C.green : C.red,
            }}
          >
            {trend.dir === "up" ? "↑" : "↓"} {trend.text}
          </span>
        )}
      </div>
      <div>
        <p className="font-sans font-bold text-2xl leading-none mb-1.5" style={{ color: C.text }}>{value}</p>
        <p className="font-sans text-sm font-medium mb-0.5" style={{ color: C.text }}>{label}</p>
        <p className="font-sans text-xs" style={{ color: C.subtle }}>{sub}</p>
      </div>
    </motion.div>
  );
}

/* ─── mini bar chart ──────────────────────────────── */
interface BarEntry { label: string; count: number; color: string; }

function CategoryBreakdown({ barData }: { barData: BarEntry[] }) {
  const barMax = Math.max(...barData.map(b => b.count), 1);
  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-5"
      style={{ background: C.surface, borderColor: C.border }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-sans font-semibold text-sm" style={{ color: C.text }}>By Category</p>
          <p className="font-sans text-xs mt-0.5" style={{ color: C.subtle }}>Inventory breakdown</p>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {barData.map((b, i) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="font-sans text-xs w-24 shrink-0" style={{ color: C.muted }}>{b.label}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: C.bg }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: b.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(b.count / barMax) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="font-sans text-xs font-semibold w-4 text-right shrink-0" style={{ color: C.text }}>{b.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── recent uploads table ────────────────────────── */
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Bridal:        { bg: C.goldLight,  text: C.gold },
  Festive:       { bg: C.blueLight,  text: C.blue },
  Handloom:      { bg: C.greenLight, text: C.green },
  Contemporary:  { bg: "#F0EDE8",    text: C.muted },
};

function RecentUploads({ sarees, loading }: { sarees: UISaree[]; loading: boolean }) {
  return (
    <div
      className="rounded-xl border flex flex-col"
      style={{ background: C.surface, borderColor: C.border }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.border }}>
        <div>
          <p className="font-sans font-semibold text-sm" style={{ color: C.text }}>Recent Uploads</p>
          <p className="font-sans text-xs mt-0.5" style={{ color: C.subtle }}>Latest additions to inventory</p>
        </div>
        <Link
          href="/collections"
          className="font-sans text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: C.gold }}
        >
          View all →
        </Link>
      </div>

      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Saree", "Category", "Fabric", "Price", "Status"].map(h => (
                <th key={h} className="px-5 py-3 font-sans text-[11px] uppercase tracking-[0.15em] font-medium" style={{ color: C.subtle }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sarees.map((s, i) => {
              const badge = CATEGORY_COLORS[s.category] ?? { bg: "#eee", text: "#666" };
              return (
                <motion.tr
                  key={s.id}
                  className="border-b last:border-0"
                  style={{ borderColor: C.border }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0" style={{ background: C.bg }}>
                        <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-sans text-sm font-medium" style={{ color: C.text }}>{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-sans text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: badge.bg, color: badge.text }}>
                      {s.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-sans text-sm" style={{ color: C.muted }}>{s.fabric}</td>
                  <td className="px-5 py-3.5 font-sans text-sm font-medium" style={{ color: C.text }}>{s.price ?? ""}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-sans text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: C.greenLight, color: C.green }}>
                      Live
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* mobile list */}
      <div className="md:hidden flex flex-col divide-y" style={{ borderColor: C.border }}>
        {sarees.map((s) => {
          const badge = CATEGORY_COLORS[s.category] ?? { bg: "#eee", text: "#666" };
          return (
            <div key={s.id} className="flex items-center gap-3.5 px-5 py-3.5">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0" style={{ background: C.bg }}>
                <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-medium truncate" style={{ color: C.text }}>{s.name}</p>
                <p className="font-sans text-xs" style={{ color: C.muted }}>{s.fabric}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="font-sans text-xs font-semibold" style={{ color: C.text }}>{s.price}</span>
                <span className="font-sans text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.text }}>
                  {s.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── activity feed ───────────────────────────────── */
function ActivityFeed() {
  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-5"
      style={{ background: C.surface, borderColor: C.border }}
    >
      <div>
        <p className="font-sans font-semibold text-sm" style={{ color: C.text }}>Recent Activity</p>
        <p className="font-sans text-xs mt-0.5" style={{ color: C.subtle }}>Latest events</p>
      </div>
      <div className="flex flex-col gap-0">
        {ACTIVITY.map((a, i) => (
          <motion.div
            key={i}
            className="flex gap-3.5 py-3.5 border-b last:border-0"
            style={{ borderColor: C.border }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <div className="relative mt-1.5 shrink-0">
              <div className="w-2 h-2 rounded-full" style={{ background: a.dot }} />
              {i < ACTIVITY.length - 1 && (
                <div className="absolute top-3 left-[3px] w-px h-full" style={{ background: C.border }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm leading-snug" style={{ color: C.text }}>{a.text}</p>
              <p className="font-sans text-[11px] mt-1" style={{ color: C.subtle }}>{a.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── broadcast panel ─────────────────────────────── */
function BroadcastPanel() {
  const { push } = useToast();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSend() {
    const msg = message.trim();
    if (!msg || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({ message: msg }),
      });
      if (!res.ok) throw new Error("Failed");
      setMessage("");
      setSent(true);
      push({ kind: "success", title: "Broadcast sent!", body: msg });
      setTimeout(() => setSent(false), 3000);
    } catch {
      push({ kind: "error", title: "Broadcast failed", body: "Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-5"
      style={{ background: C.surface, borderColor: C.border }}
    >
      <div>
        <p className="font-sans font-semibold text-sm" style={{ color: C.text }}>Broadcast Message</p>
        <p className="font-sans text-xs mt-0.5" style={{ color: C.subtle }}>Send a real-time announcement to all visitors</p>
      </div>

      <div className="flex flex-col gap-3">
        <input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="e.g. New festive collection launched!"
          maxLength={500}
          className="w-full px-3.5 py-2.5 rounded-lg border font-sans text-sm outline-none transition-colors"
          style={{
            background: C.bg,
            borderColor: C.border,
            color: C.text,
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = C.gold)}
          onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
        />

        <button
          onClick={handleSend}
          disabled={!message.trim() || sending}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-sans text-xs font-semibold uppercase tracking-[0.12em] transition-all"
          style={{
            background: sent ? C.green : message.trim() ? C.gold : C.border,
            color: message.trim() || sent ? "#fff" : C.subtle,
            cursor: !message.trim() || sending ? "not-allowed" : "pointer",
            opacity: sending ? 0.7 : 1,
          }}
        >
          {sending ? (
            <>
              <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Sending…
            </>
          ) : sent ? (
            <>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 7l4 4 6-6"/>
              </svg>
              Sent!
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10L18 3l-7 15-2-6-6-2z"/>
              </svg>
              Send Broadcast
            </>
          )}
        </button>

        <p className="font-sans text-[11px] text-right" style={{ color: C.subtle }}>
          {message.length}/500
        </p>
      </div>
    </div>
  );
}

/* ─── monthly uploads chart ───────────────────────── */
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.sidebar, border: `1px solid rgba(255,255,255,0.08)`,
      borderRadius: 8, padding: "8px 12px",
    }}>
      <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif", fontSize: 11, marginBottom: 2 }}>{label}</p>
      <p style={{ color: C.gold, fontFamily: "sans-serif", fontSize: 13, fontWeight: 600 }}>
        {payload[0].value} {payload[0].value === 1 ? "saree" : "sarees"}
      </p>
    </div>
  );
}

function MonthlyUploadsChart({ data, loading }: { data: { month: string; count: number }[]; loading: boolean }) {
  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-5"
      style={{ background: C.surface, borderColor: C.border }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-sans font-semibold text-sm" style={{ color: C.text }}>Monthly Uploads</p>
          <p className="font-sans text-xs mt-0.5" style={{ color: C.subtle }}>Sarees added per month (last 12 months)</p>
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${C.gold} transparent ${C.gold} ${C.gold}` }} />
        </div>
      ) : data.length === 0 || data.every(d => d.count === 0) ? (
        <div className="h-40 flex flex-col items-center justify-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.subtle} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 4-8"/>
          </svg>
          <p className="font-sans text-xs" style={{ color: C.subtle }}>No upload data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barSize={16}>
            <CartesianGrid vertical={false} stroke={C.border} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontFamily: "sans-serif", fontSize: 10, fill: C.subtle }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontFamily: "sans-serif", fontSize: 10, fill: C.subtle }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: `${C.gold}12` }} />
            <Bar dataKey="count" fill={C.gold} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

/* ─── page ────────────────────────────────────────── */
export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sarees, setSarees] = useState<UISaree[]>([]);
  const [collections, setCollections] = useState<ApiCollection[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  /* auth guard */
  useEffect(() => {
    if (!getToken()) navigate("/admin");
  }, [navigate]);

  /* fetch data */
  useEffect(() => {
    Promise.all([
      getAllSarees({ limit: 100 }).then(({ sarees: s }) => setSarees(s)),
      getCollections().then(setCollections),
      getAnalytics().then(setAnalytics).catch(() => {}),
    ])
      .catch(() => {})
      .finally(() => setDataLoading(false));
  }, []);

  const totalSarees = analytics?.totalSarees ?? sarees.length;
  const totalCategories = analytics?.totalCollections ?? (collections.length || 4);
  const totalValue = sarees.reduce((acc, s) => acc + s.priceNum, 0);
  const enquiriesCount = analytics?.enquiriesCount ?? 0;
  const monthlyData: MonthlyUpload[] = analytics?.monthlySareeUploads ?? [];

  const CAT_COLORS = [C.gold, C.blue, C.green, C.muted, C.red];
  const barData: BarEntry[] = collections.length
    ? collections.map((col, i) => ({
        label: col.name,
        count: sarees.filter((s) => s.category === col.name).length,
        color: CAT_COLORS[i % CAT_COLORS.length],
      }))
    : [
        { label: "Bridal",       count: sarees.filter((s) => s.category === "Bridal").length,       color: C.gold },
        { label: "Festive",      count: sarees.filter((s) => s.category === "Festive").length,      color: C.blue },
        { label: "Handloom",     count: sarees.filter((s) => s.category === "Handloom").length,     color: C.green },
        { label: "Contemporary", count: sarees.filter((s) => s.category === "Contemporary").length, color: C.muted },
      ];

  function handleLogout() {
    clearToken();
    navigate("/admin");
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: C.bg }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* main */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ marginLeft: 0 }}
      >
        {/* desktop sidebar spacer */}
        <div className="hidden md:block" style={{ position: "fixed", left: 224, top: 0, bottom: 0, width: 0 }} />

        <div className="flex flex-col flex-1 overflow-hidden md:ml-[224px]">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          {/* scrollable content */}
          <main className="flex-1 overflow-y-auto px-5 md:px-6 py-6">
            <div className="max-w-6xl mx-auto flex flex-col gap-6">

              {/* stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total Sarees"
                  value={totalSarees}
                  sub="In active inventory"
                  accent={C.gold}
                  accentLight={C.goldLight}
                  trend={{ dir: "up", text: "12%" }}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h12M4 8h12M4 12h8M4 16h5"/>
                    </svg>
                  }
                />
                <StatCard
                  label="Collections"
                  value={totalCategories}
                  sub="Active categories"
                  accent={C.blue}
                  accentLight={C.blueLight}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 5l8-3 8 3v10l-8 3-8-3V5z"/><path d="M10 2v16"/>
                    </svg>
                  }
                />
                <StatCard
                  label="Enquiries"
                  value={enquiriesCount}
                  sub="WhatsApp enquiries"
                  accent={C.green}
                  accentLight={C.greenLight}
                  trend={enquiriesCount > 0 ? { dir: "up", text: `${enquiriesCount} total` } : undefined}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 4h16v11a1 1 0 01-1 1H3a1 1 0 01-1-1V4z"/><path d="M2 4l8 7 8-7"/>
                    </svg>
                  }
                />
                <StatCard
                  label="Catalogue Value"
                  value={`₹${(totalValue / 100000).toFixed(1)}L`}
                  sub="Total inventory worth"
                  accent={C.muted}
                  accentLight="#F0EDE8"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="10" cy="10" r="8"/><path d="M10 6v8M7.5 8.5C7.5 7 8.5 6 10 6s2.5 1 2.5 2.5-1 2-2.5 2-2.5 1-2.5 2.5S8.5 15 10 15s2.5-1 2.5-2.5"/>
                    </svg>
                  }
                />
              </div>

              {/* monthly chart — full width */}
              <MonthlyUploadsChart data={monthlyData} loading={dataLoading} />

              {/* middle row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <RecentUploads sarees={sarees.slice(0, 6)} loading={dataLoading} />
                </div>
                <div className="flex flex-col gap-4">
                  <CategoryBreakdown barData={barData} />
                  <BroadcastPanel />
                  <ActivityFeed />
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
