import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

/* ─── palette ──────────────────────────────────────────── */
const G = {
  bg: "#F7F6F4",
  white: "#FFFFFF",
  charcoal: "#1E1C19",
  muted: "#6B6760",
  border: "#E4E0D8",
  borderFocus: "#B8973E",
  gold: "#B8973E",
  error: "#C0392B",
  subtle: "#F0EDE8",
};

/* ─── floating label input ─────────────────────────────── */
function InputField({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  error,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const active = focused || value.length > 0;
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPw ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="relative rounded-lg transition-all duration-200"
        style={{
          background: G.white,
          border: `1.5px solid ${error ? G.error : focused ? G.borderFocus : G.border}`,
          boxShadow: focused ? `0 0 0 3px ${G.borderFocus}18` : "none",
        }}
      >
        {/* floating label */}
        <label
          htmlFor={id}
          className="absolute left-4 pointer-events-none transition-all duration-200 font-sans select-none"
          style={{
            top: active ? "0.45rem" : "50%",
            transform: active ? "none" : "translateY(-50%)",
            fontSize: active ? "0.65rem" : "0.875rem",
            letterSpacing: active ? "0.12em" : "0",
            textTransform: active ? "uppercase" : "none",
            color: focused ? G.gold : G.muted,
          }}
        >
          {label}
        </label>

        <input
          id={id}
          type={resolvedType}
          value={value}
          autoComplete={autoComplete}
          spellCheck={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent font-sans text-sm outline-none"
          style={{
            color: G.charcoal,
            paddingTop: active ? "1.5rem" : "0.9rem",
            paddingBottom: active ? "0.55rem" : "0.9rem",
            paddingLeft: "1rem",
            paddingRight: isPassword ? "3rem" : "1rem",
          }}
          data-testid={`input-${id}`}
        />

        {/* show / hide password toggle */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPw((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
            style={{ color: G.muted }}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* inline error */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="font-sans text-xs pl-1"
            style={{ color: G.error }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── page ─────────────────────────────────────────────── */
type Status = "idle" | "loading" | "error";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  function validate() {
    let ok = true;
    if (!email.trim()) { setEmailErr("Email is required."); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailErr("Enter a valid email address."); ok = false; }
    else setEmailErr("");

    if (!password) { setPasswordErr("Password is required."); ok = false; }
    else if (password.length < 6) { setPasswordErr("Password must be at least 6 characters."); ok = false; }
    else setPasswordErr("");

    return ok;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    // Simulate auth — replace with real API call
    setTimeout(() => setStatus("error"), 1400);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5"
      style={{ background: G.bg }}
    >
      {/* card */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* brand mark */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-block font-serif text-2xl tracking-[0.3em] transition-opacity hover:opacity-60"
            style={{ color: G.charcoal }}
          >
            ANANYA
          </Link>
          <p
            className="font-sans text-[10px] uppercase tracking-[0.3em] mt-2"
            style={{ color: G.muted }}
          >
            Admin Portal
          </p>
        </div>

        {/* card body */}
        <div
          className="rounded-2xl px-8 py-9 md:px-10 md:py-10"
          style={{
            background: G.white,
            border: `1px solid ${G.border}`,
            boxShadow: "0 4px 32px rgba(44,42,38,0.07)",
          }}
        >
          <h1
            className="font-sans font-semibold text-xl mb-1.5"
            style={{ color: G.charcoal }}
          >
            Sign in
          </h1>
          <p className="font-sans text-sm mb-8" style={{ color: G.muted }}>
            Enter your credentials to access the dashboard.
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <InputField
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={(v) => { setEmail(v); setEmailErr(""); setStatus("idle"); }}
              autoComplete="email"
              error={emailErr}
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(v) => { setPassword(v); setPasswordErr(""); setStatus("idle"); }}
              autoComplete="current-password"
              error={passwordErr}
            />

            {/* server-level error banner */}
            <AnimatePresence>
              {status === "error" && (
                <motion.div
                  className="flex items-start gap-3 rounded-lg px-4 py-3"
                  style={{ background: "#FDF2F1", border: `1px solid #F0C0BB` }}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  data-testid="error-banner"
                >
                  <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke={G.error} strokeWidth="1.4"/>
                    <path d="M8 5v3.5M8 11h.01" stroke={G.error} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="font-sans text-xs leading-relaxed" style={{ color: G.error }}>
                    Invalid email or password. Please try again.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* submit */}
            <motion.button
              type="submit"
              disabled={status === "loading"}
              className="relative w-full flex items-center justify-center gap-2.5 font-sans text-sm font-medium tracking-wide rounded-lg transition-opacity mt-1"
              style={{
                background: G.charcoal,
                color: "#fff",
                padding: "0.875rem",
                opacity: status === "loading" ? 0.75 : 1,
              }}
              whileHover={{ scale: status === "loading" ? 1 : 1.015 }}
              whileTap={{ scale: status === "loading" ? 1 : 0.985 }}
              data-testid="btn-login"
            >
              {status === "loading" ? (
                <>
                  <motion.span
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Signing in…</span>
                </>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </form>

          {/* forgot password */}
          <div className="mt-6 text-center">
            <a
              href="#"
              className="font-sans text-xs transition-opacity hover:opacity-60"
              style={{ color: G.muted }}
              data-testid="link-forgot"
            >
              Forgot password?
            </a>
          </div>
        </div>

        {/* back to site */}
        <div className="mt-7 text-center">
          <Link
            href="/"
            className="font-sans text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-60 flex items-center justify-center gap-2"
            style={{ color: G.muted }}
            data-testid="link-back"
          >
            <svg width="12" height="9" viewBox="0 0 14 10" fill="none">
              <path d="M5 1L1 5L5 9M1 5H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to site
          </Link>
        </div>
      </motion.div>

      {/* subtle background grid texture */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(circle, ${G.border} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          opacity: 0.6,
        }}
      />
    </div>
  );
}
