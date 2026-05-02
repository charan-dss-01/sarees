import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ── types ──────────────────────────────────────────────── */
export type ToastKind = "new_saree" | "admin_message" | "success" | "error";

export interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  body?: string;
}

interface ToastCtx {
  push: (t: Omit<Toast, "id">) => void;
}

/* ── context ─────────────────────────────────────────────── */
const Ctx = createContext<ToastCtx | null>(null);

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside <NotificationProvider>");
  return ctx;
}

/* ── accent colours per kind ─────────────────────────────── */
const ACCENT: Record<ToastKind, { bar: string; icon: string }> = {
  new_saree:     { bar: "#B8973E", icon: "#B8973E" },
  admin_message: { bar: "#6C63FF", icon: "#6C63FF" },
  success:       { bar: "#2D9B6E", icon: "#2D9B6E" },
  error:         { bar: "#C0392B", icon: "#C0392B" },
};

/* ── icon per kind ───────────────────────────────────────── */
function ToastIcon({ kind }: { kind: ToastKind }) {
  const color = ACCENT[kind].icon;
  if (kind === "new_saree") return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h12M4 8h12M4 12h8M4 16h5"/>
    </svg>
  );
  if (kind === "admin_message") return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h16v11a1 1 0 01-1 1H3a1 1 0 01-1-1V4z"/><path d="M2 4l8 7 8-7"/>
    </svg>
  );
  if (kind === "error") return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10l4 4 8-8"/>
    </svg>
  );
}

/* ── single toast card ───────────────────────────────────── */
const AUTO_DISMISS = 5000;

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const accent = ACCENT[toast.kind];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0,  scale: 1    }}
      exit={{    opacity: 0, x: 80, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      style={{
        background: "#1A1917",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        overflow: "hidden",
        width: 320,
        position: "relative",
        cursor: "pointer",
      }}
      onClick={() => onDismiss(toast.id)}
      role="alert"
    >
      {/* left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 3, background: accent.bar, borderRadius: "12px 0 0 12px",
      }} />

      <div style={{ padding: "14px 16px 14px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ marginTop: 1, flexShrink: 0 }}>
          <ToastIcon kind={toast.kind} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: "#F4F2EE", margin: 0, lineHeight: 1.4 }}>
            {toast.title}
          </p>
          {toast.body && (
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "4px 0 0", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {toast.body}
            </p>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(toast.id); }}
          style={{ color: "rgba(255,255,255,0.3)", lineHeight: 1, background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0 }}
          aria-label="Dismiss"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M2 2l8 8M10 2l-8 8"/>
          </svg>
        </button>
      </div>

      {/* progress bar */}
      <motion.div
        style={{ position: "absolute", bottom: 0, left: 0, height: 2, background: accent.bar, opacity: 0.4 }}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: AUTO_DISMISS / 1000, ease: "linear" }}
      />
    </motion.div>
  );
}

/* ── provider ────────────────────────────────────────────── */
let nextId = 0;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = String(++nextId);
    setToasts((prev) => [...prev.slice(-4), { ...t, id }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <Ctx.Provider value={{ push }}>
      {children}

      {/* toast stack — bottom-right */}
      <div
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          display: "flex", flexDirection: "column", gap: 10,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <div key={t.id} style={{ pointerEvents: "auto" }}>
              <ToastCard toast={t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
