'use client';
/**
 * DepartmentsApp.jsx
 * Tablas: departamentos (id, address, created_at) | mensajes (id, departamento_id, content, created_at)
 * CSS-in-JS puro — sin Tailwind. Totalmente responsive (mobile-first).
 */

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #F4F4F2;
    --bg2:       #EBEBEA;
    --white:     #FFFFFF;
    --border:    #E3E3E0;
    --border2:   #D0D0CC;
    --muted:     #9A9A96;
    --text:      #141414;
    --text2:     #444444;
    --danger:    #D13030;
    --danger-bg: #FEF0F0;
    --sh-sm:     0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
    --sh-md:     0 4px 16px rgba(0,0,0,.08);
    --sh-lg:     0 12px 40px rgba(0,0,0,.14);
    --r:         10px;
    --r-lg:      16px;
    --r-xl:      20px;
  }

  html { background: var(--bg); }
  body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  /* ── TOPBAR ── */
  .im-topbar {
    position: sticky;
    top: 0;
    z-index: 100;
    height: 52px;
    background: #111;
    border-bottom: 1px solid #222;
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 8px;
  }
  .im-topbar-logo {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.2px;
  }
  .im-topbar-logo span { color: #888; font-weight: 400; }
  .im-topbar-dot { width: 3px; height: 3px; border-radius: 50%; background: #444; flex-shrink: 0; }
  .im-topbar-sub {
    font-size: 10px;
    font-weight: 500;
    color: #555;
    letter-spacing: 2px;
    text-transform: uppercase;
    display: none;
  }

  /* ── PAGE ── */
  .im-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px 16px 64px;
  }

  /* ── PAGE HEADER ── */
  .im-eyebrow {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }
  .im-page-title {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.5px;
    line-height: 1.1;
    margin-bottom: 4px;
  }
  .im-page-sub {
    font-size: 13px;
    color: var(--muted);
    font-weight: 300;
    margin-bottom: 24px;
  }

  /* ── SEARCH ── */
  .im-search-wrap {
    position: relative;
    width: 100%;
    margin-bottom: 20px;
  }
  .im-search-ico {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    display: flex;
    pointer-events: none;
  }
  .im-search {
    width: 100%;
    padding: 11px 16px 11px 38px;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    box-shadow: var(--sh-sm);
    transition: border-color .2s, box-shadow .2s;
    -webkit-appearance: none;
  }
  .im-search:focus {
    border-color: #141414;
    box-shadow: 0 0 0 3px rgba(20,20,20,.07);
  }
  .im-search::placeholder { color: var(--muted); }

  /* ── GRID ── */
  .im-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* ── DEPT CARD ── */
  .im-card {
    background: var(--white);
    border: 1.5px solid transparent;
    border-radius: var(--r-xl);
    padding: 18px;
    cursor: pointer;
    box-shadow: var(--sh-sm);
    transition: box-shadow .2s, border-color .2s, transform .15s;
    display: flex;
    flex-direction: column;
    gap: 12px;
    -webkit-tap-highlight-color: transparent;
  }
  .im-card:active { transform: scale(.99); box-shadow: var(--sh-sm); }
  .im-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .im-card-ico {
    width: 36px;
    height: 36px;
    background: var(--bg2);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    flex-shrink: 0;
  }
  /* On mobile, always show actions (no hover) */
  .im-card-actions {
    display: flex;
    gap: 2px;
    opacity: 1;
  }
  .im-card-name {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.3;
  }
  .im-card-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .im-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    font-weight: 500;
    color: var(--muted);
    background: var(--bg);
    border-radius: 100px;
    padding: 3px 10px;
  }
  .im-view-link {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text2);
  }
  .im-view-link .chev { transition: transform .15s; }

  /* ── ICON BUTTON ── */
  .im-ibtn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: var(--bg2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    transition: background .15s, color .15s;
    -webkit-tap-highlight-color: transparent;
  }
  .im-ibtn:active { background: var(--bg2); }
  .im-ibtn.danger { background: var(--danger-bg); color: var(--danger); }

  /* ── BUTTONS ── */
  .im-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    border-radius: var(--r);
    border: none;
    cursor: pointer;
    padding: 12px 18px;
    transition: opacity .15s, transform .1s;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .im-btn:active:not(:disabled) { opacity: .8; transform: scale(.98); }
  .im-btn:disabled { opacity: .45; cursor: not-allowed; }
  .im-btn-dark { background: var(--text); color: #fff; }
  .im-btn-outline {
    background: var(--white);
    color: var(--text2);
    border: 1.5px solid var(--border);
    box-shadow: var(--sh-sm);
  }
  .im-btn-danger { background: var(--danger); color: #fff; }
  .im-btn-full { width: 100%; }

  /* ── DETAIL HEADER ── */
  .im-detail-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .im-detail-header h1 {
    font-size: 22px !important;
    letter-spacing: -0.3px !important;
  }

  /* ── TOOLBAR ── */
  .im-toolbar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 18px;
  }
  .im-toolbar-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .im-count {
    font-size: 12px;
    color: var(--muted);
    font-weight: 400;
    margin-left: auto;
    white-space: nowrap;
  }

  /* ── FORM CARD ── */
  .im-form-card {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--r-xl);
    padding: 20px 16px;
    margin-bottom: 18px;
    box-shadow: var(--sh-sm);
    animation: imFadeDown .2s ease;
  }
  .im-form-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 16px;
  }
  .im-label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .im-textarea {
    width: 100%;
    padding: 12px 14px;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: var(--r);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: var(--text);
    outline: none;
    resize: vertical;
    min-height: 96px;
    line-height: 1.6;
    transition: border-color .2s, background .2s;
    -webkit-appearance: none;
  }
  .im-textarea:focus {
    border-color: var(--text);
    background: var(--white);
  }
  .im-textarea::placeholder { color: var(--muted); }
  .im-input {
    width: 100%;
    padding: 12px 14px;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: var(--r);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: var(--text);
    outline: none;
    margin-bottom: 16px;
    transition: border-color .2s, background .2s;
    -webkit-appearance: none;
  }
  .im-input:focus {
    border-color: var(--text);
    background: var(--white);
  }
  .im-form-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 14px;
  }

  /* ── MESSAGE CARD ── */
  .im-msg-list { display: flex; flex-direction: column; gap: 8px; }
  .im-msg {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: var(--r-lg);
    padding: 14px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: var(--sh-sm);
    animation: imFadeUp .18s ease;
  }
  .im-msg-text {
    font-size: 14px;
    color: var(--text2);
    line-height: 1.65;
    font-weight: 400;
    word-break: break-word;
  }
  .im-msg-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .im-msg-actions { display: flex; gap: 6px; }
  .im-msg-date {
    font-size: 11px;
    color: var(--muted);
    font-weight: 500;
  }

  /* ── EMPTY STATE ── */
  .im-empty { text-align: center; padding: 56px 20px; }
  .im-empty-ico {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--bg2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    color: var(--muted);
  }
  .im-empty-title {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 600;
    color: var(--text2);
    margin-bottom: 4px;
  }
  .im-empty-sub { font-size: 13px; color: var(--muted); }

  /* ── MODAL ── */
  .im-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10,10,10,.55);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 200;
    padding: 0;
    animation: imFadeIn .15s ease;
  }
  .im-modal {
    background: var(--white);
    border-radius: 24px 24px 0 0;
    padding: 28px 20px 36px;
    width: 100%;
    max-width: 100%;
    box-shadow: var(--sh-lg);
    animation: imSlideUp .2s ease;
  }
  .im-modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 19px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
  }
  .im-modal-body {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.65;
    margin-bottom: 20px;
  }
  .im-modal-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .im-modal-drag {
    width: 40px;
    height: 4px;
    background: var(--border2);
    border-radius: 2px;
    margin: 0 auto 20px;
  }

  /* ── SPINNER ── */
  .im-spinner { animation: imSpin 1s linear infinite; }
  .im-center { display: flex; justify-content: center; align-items: center; padding: 56px 0; color: var(--muted); }

  /* ── TOAST ── */
  .im-toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 300;
    padding: 12px 22px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    box-shadow: var(--sh-lg);
    animation: imFadeUp .2s ease;
    white-space: nowrap;
  }
  .im-toast-ok  { background: var(--text); color: #fff; }
  .im-toast-err { background: var(--danger); color: #fff; }

  /* ── ANIMATIONS ── */
  @keyframes imFadeIn   { from { opacity: 0 } to { opacity: 1 } }
  @keyframes imFadeDown { from { opacity: 0; transform: translateY(-8px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes imFadeUp   { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes imSlideUp  { from { transform: translateY(100%) } to { transform: translateY(0) } }
  @keyframes imSpin     { to { transform: rotate(360deg) } }

  /* ═══════════════════════════════════
     TABLET  ≥ 600px
  ═══════════════════════════════════ */
  @media (min-width: 600px) {
    .im-topbar { padding: 0 24px; height: 56px; }
    .im-topbar-logo { font-size: 15px; }
    .im-topbar-sub { display: block; font-size: 10.5px; }
    .im-page { padding: 36px 24px 80px; }
    .im-page-title { font-size: 32px; }
    .im-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .im-card-actions { opacity: 0; }
    .im-card:hover .im-card-actions { opacity: 1; }
    .im-card:hover { box-shadow: var(--sh-md); border-color: var(--border2); transform: translateY(-2px); }
    .im-ibtn { background: transparent; width: 28px; height: 28px; }
    .im-ibtn:hover { background: var(--bg2); color: var(--text2); }
    .im-ibtn.danger { background: transparent; color: var(--muted); }
    .im-ibtn.danger:hover { background: var(--danger-bg); color: var(--danger); }
    .im-toolbar { flex-direction: row; align-items: center; }
    .im-form-actions { flex-direction: row; justify-content: flex-end; }
    .im-form-actions .im-btn { width: auto; }
    .im-msg { flex-direction: row; align-items: flex-start; }
    .im-msg-footer { flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
    .im-msg-actions { opacity: 0; transition: opacity .15s; }
    .im-msg:hover .im-msg-actions { opacity: 1; }
    .im-msg-text { flex: 1; }
    .im-modal { border-radius: 24px; max-width: 420px; padding: 32px; margin: auto; }
    .im-overlay { align-items: center; padding: 16px; }
    .im-modal-actions { flex-direction: row; justify-content: flex-end; }
    .im-modal-actions .im-btn { width: auto; }
    .im-modal-drag { display: none; }
    .im-search-wrap { max-width: 300px; }
    .im-btn { padding: 10px 18px; font-size: 13.5px; }
    .im-btn-full { width: auto; }
    .im-toast { left: auto; right: 24px; transform: none; bottom: 24px; border-radius: var(--r); }
  }

  /* ═══════════════════════════════════
     DESKTOP  ≥ 960px
  ═══════════════════════════════════ */
  @media (min-width: 960px) {
    .im-topbar { padding: 0 36px; }
    .im-page { padding: 48px 36px 80px; }
    .im-page-title { font-size: 38px; letter-spacing: -1px; }
    .im-grid { grid-template-columns: repeat(3, 1fr); }
    .im-detail-header h1 { font-size: 30px !important; }
  }
`;

// ── ICONS ─────────────────────────────────────────────────────────────────────
const SearchIco = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const BuildingIco = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />
  </svg>
);
const PencilIco = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIco = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
);
const ArrowIco = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const PlusIco = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const MsgIco = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const ChevIco = () => (
  <svg className="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const SpinIco = ({ size = 24 }) => (
  <svg className="im-spinner" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

// ── UTILS ─────────────────────────────────────────────────────────────────────
function fmtDate(str) {
  if (!str) return "";
  return new Date(str).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
}
function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return [toast, show];
}

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────
function IBtn({ children, onClick, danger }) {
  return (
    <button className={`im-ibtn${danger ? " danger" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="im-overlay" onClick={onClose}>
      <div className="im-modal" onClick={e => e.stopPropagation()}>
        <div className="im-modal-drag" />
        {children}
      </div>
    </div>
  );
}


// ── MSG IMAGE ─────────────────────────────────────────────────────────────────
// Carga imágenes de Supabase Storage. Genera signed URL si falla la pública.
function MsgImage({ url }) {
  const [src, setSrc] = useState(url);
  const [failed, setFailed] = useState(false);

  useEffect(() => { setSrc(url); setFailed(false); }, [url]);

  async function handleError() {
    if (failed) return;
    setFailed(true);
    // Extraer bucket y path desde la URL pública
    // URL format: .../storage/v1/object/public/BUCKET/PATH
    try {
      const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
      if (!match) return;
      const [, bucket, path] = match;
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 3600);
      if (!error && data?.signedUrl) setSrc(data.signedUrl);
    } catch (e) {
      console.error("No se pudo cargar la imagen", e);
    }
  }

  if (!src) return null;
  return (
    <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", border: "1.5px solid var(--border)", background: "var(--bg2)" }}>
      <img
        src={src}
        alt="imagen adjunta"
        style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block", cursor: "pointer" }}
        onClick={() => window.open(src, "_blank")}
        onError={handleError}
      />
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const [deptSearch, setDeptSearch] = useState("");
  const [msgSearch, setMsgSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [newImgUrl, setNewImgUrl] = useState("");
  const [sending, setSending] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [toast, showToast] = useToast();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("departamentos").select("*").order("address");
      if (error) showToast("Error al cargar departamentos", "err");
      else setDepartments(data || []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selectedDept) return;
    (async () => {
      setLoadingMsgs(true);
      setMessages([]);
      const { data, error } = await supabase
        .from("mensajes").select("*")
        .eq("departamento_id", selectedDept.id)
        .order("created_at", { ascending: false });
      if (error) showToast("Error al cargar mensajes", "err");
      else setMessages(data || []);
      setLoadingMsgs(false);
    })();
  }, [selectedDept]);

  async function handleSend() {
    if (!newMsg.trim()) return;
    setSending(true);
    const { data, error } = await supabase
      .from("mensajes")
      .insert([{ departamento_id: selectedDept.id, content: newMsg.trim(), url_imagen: newImgUrl.trim() || null }])
      .select().single();
    if (error) showToast("Error al enviar", "err");
    else {
      setMessages(prev => [data, ...prev]);
      showToast("Mensaje enviado ✓");
      setNewMsg(""); setNewImgUrl(""); setShowForm(false);
    }
    setSending(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    if (deleteTarget.type === "dept") {
      const { error } = await supabase.from("departamentos").delete().eq("id", deleteTarget.id);
      if (error) showToast("Error al eliminar", "err");
      else {
        setDepartments(prev => prev.filter(d => d.id !== deleteTarget.id));
        if (selectedDept?.id === deleteTarget.id) setSelectedDept(null);
        showToast("Departamento eliminado");
      }
    } else {
      const { error } = await supabase.from("mensajes").delete().eq("id", deleteTarget.id);
      if (error) showToast("Error al eliminar", "err");
      else {
        setMessages(prev => prev.filter(m => m.id !== deleteTarget.id));
        showToast("Mensaje eliminado");
      }
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  async function handleEdit() {
    if (!editTarget?.value?.trim()) return;
    setSaving(true);
    if (editTarget.type === "dept") {
      const { error } = await supabase
        .from("departamentos").update({ address: editTarget.value.trim() }).eq("id", editTarget.id);
      if (error) showToast("Error al guardar", "err");
      else {
        setDepartments(prev => prev.map(d => d.id === editTarget.id ? { ...d, address: editTarget.value.trim() } : d));
        if (selectedDept?.id === editTarget.id)
          setSelectedDept(p => ({ ...p, address: editTarget.value.trim() }));
        showToast("Guardado ✓");
      }
    } else {
      const { error } = await supabase
        .from("mensajes").update({ content: editTarget.value.trim() }).eq("id", editTarget.id);
      if (error) showToast("Error al guardar", "err");
      else {
        setMessages(prev => prev.map(m =>
          m.id === editTarget.id ? { ...m, content: editTarget.value.trim() } : m
        ));
        showToast("Guardado ✓");
      }
    }
    setSaving(false);
    setEditTarget(null);
  }

  const filteredDepts = departments.filter(d =>
    d.address?.toLowerCase().includes(deptSearch.toLowerCase())
  );
  const filteredMsgs = messages.filter(m =>
    m.content?.toLowerCase().includes(msgSearch.toLowerCase())
  );

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* TOPBAR */}
      <header className="im-topbar">
        <span className="im-topbar-logo">Gestión <span>Inmobiliaria</span></span>
        <div className="im-topbar-dot" />
        <span className="im-topbar-sub">Panel Admin</span>
      </header>

      <main className="im-page">
        {!selectedDept ? (
          <>
            {/* ── DEPARTMENTS ── */}
            <p className="im-eyebrow">Inmobiliaria</p>
            <h1 className="im-page-title">Departamentos</h1>
            <p className="im-page-sub">Administrá los departamentos y sus mensajes</p>

            <div className="im-search-wrap">
              <span className="im-search-ico"><SearchIco /></span>
              <input
                className="im-search"
                placeholder="Buscar departamento..."
                value={deptSearch}
                onChange={e => setDeptSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="im-center"><SpinIco size={30} /></div>
            ) : filteredDepts.length === 0 ? (
              <div className="im-empty">
                <div className="im-empty-ico"><BuildingIco /></div>
                <p className="im-empty-title">Sin resultados</p>
                <p className="im-empty-sub">No se encontraron departamentos</p>
              </div>
            ) : (
              <div className="im-grid">
                {filteredDepts.map(dept => (
                  <div key={dept.id} className="im-card" onClick={() => setSelectedDept(dept)}>
                    <div className="im-card-top">
                      <div className="im-card-ico"><BuildingIco /></div>
                      <div className="im-card-actions" onClick={e => e.stopPropagation()}>
                        <IBtn onClick={() => setEditTarget({ type: "dept", id: dept.id, value: dept.address })}>
                          <PencilIco />
                        </IBtn>
                        <IBtn danger onClick={() => setDeleteTarget({ type: "dept", id: dept.id, label: dept.address })}>
                          <TrashIco />
                        </IBtn>
                      </div>
                    </div>
                    <p className="im-card-name">{dept.address}</p>
                    <div className="im-card-foot">
                      <span className="im-badge"><MsgIco size={11} /> Mensajes</span>
                      <span className="im-view-link">Ver todos <ChevIco /></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* ── DETAIL ── */}
            <div className="im-detail-header">
              <div>
                <p className="im-eyebrow">Departamento</p>
                <h1 className="im-page-title">{selectedDept.address}</h1>
              </div>
              <button
                className="im-btn im-btn-outline"
                onClick={() => { setSelectedDept(null); setShowForm(false); setMsgSearch(""); }}
              >
                <ArrowIco /> Volver
              </button>
            </div>

            {showForm && (
              <div className="im-form-card">
                <p className="im-form-title">Nuevo mensaje</p>
                <label className="im-label">Mensaje</label>
                <textarea
                  className="im-textarea"
                  placeholder="Escribí tu mensaje aquí..."
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                />
                <div style={{ marginTop: 14 }}>
                  <label className="im-label">URL de imagen (opcional)</label>
                  <input
                    className="im-input"
                    style={{ marginBottom: 0 }}
                    type="url"
                    placeholder="https://..."
                    value={newImgUrl}
                    onChange={e => setNewImgUrl(e.target.value)}
                  />
                  {newImgUrl.trim() && (
                    <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", border: "1.5px solid var(--border)", maxHeight: 180 }}>
                      <img
                        src={newImgUrl.trim()}
                        alt="preview"
                        style={{ width: "100%", maxHeight: 180, objectFit: "cover", display: "block" }}
                        onError={e => { e.target.style.display = "none"; }}
                      />
                    </div>
                  )}
                </div>
                <div className="im-form-actions">
                  <button className="im-btn im-btn-outline im-btn-full" onClick={() => { setShowForm(false); setNewMsg(""); setNewImgUrl(""); }}>
                    Cancelar
                  </button>
                  <button
                    className="im-btn im-btn-dark im-btn-full"
                    onClick={handleSend}
                    disabled={sending || !newMsg.trim()}
                  >
                    {sending ? <SpinIco size={14} /> : <PlusIco />}
                    {sending ? "Enviando..." : "Enviar mensaje"}
                  </button>
                </div>
              </div>
            )}

            {!showForm && (
              <div className="im-toolbar">
                <button className="im-btn im-btn-dark im-btn-full" onClick={() => setShowForm(true)}>
                  <PlusIco /> Nuevo mensaje
                </button>
                <div className="im-toolbar-row">
                  <div className="im-search-wrap" style={{ flex: 1, maxWidth: "none", marginBottom: 0 }}>
                    <span className="im-search-ico"><SearchIco /></span>
                    <input
                      className="im-search"
                      placeholder="Buscar mensajes..."
                      value={msgSearch}
                      onChange={e => setMsgSearch(e.target.value)}
                    />
                  </div>
                  <span className="im-count">{filteredMsgs.length} mens.</span>
                </div>
              </div>
            )}

            {loadingMsgs ? (
              <div className="im-center"><SpinIco /></div>
            ) : !showForm && filteredMsgs.length === 0 ? (
              <div className="im-empty">
                <div className="im-empty-ico"><MsgIco size={20} /></div>
                <p className="im-empty-title">Sin mensajes</p>
                <p className="im-empty-sub">Este departamento no tiene mensajes aún</p>
              </div>
            ) : (
              <div className="im-msg-list">
                {filteredMsgs.map(msg => (
                  <div key={msg.id} className="im-msg">
                    <p className="im-msg-text">{msg.content}</p>
                    {msg.url_imagen && <MsgImage url={msg.url_imagen} />}
                    <div className="im-msg-footer">
                      <div className="im-msg-actions">
                        <IBtn onClick={() => setEditTarget({ type: "msg", id: msg.id, value: msg.content })}>
                          <PencilIco />
                        </IBtn>
                        <IBtn danger onClick={() => setDeleteTarget({ type: "msg", id: msg.id, label: msg.content?.slice(0, 60) })}>
                          <TrashIco />
                        </IBtn>
                      </div>
                      <span className="im-msg-date">{fmtDate(msg.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* DELETE MODAL */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <p className="im-modal-title">Confirmar eliminación</p>
          <p className="im-modal-body">
            ¿Seguro que querés eliminar <strong style={{ color: "#222" }}>"{deleteTarget.label}"</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="im-modal-actions">
            <button className="im-btn im-btn-danger im-btn-full" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Eliminando..." : "Eliminar"}
            </button>
            <button className="im-btn im-btn-outline im-btn-full" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </button>
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editTarget && (
        <Modal onClose={() => setEditTarget(null)}>
          <p className="im-modal-title">{editTarget.type === "dept" ? "Editar dirección" : "Editar mensaje"}</p>
          <label className="im-label">{editTarget.type === "dept" ? "Dirección" : "Mensaje"}</label>
          {editTarget.type === "dept" ? (
            <input
              autoFocus
              className="im-input"
              value={editTarget.value}
              onChange={e => setEditTarget(p => ({ ...p, value: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleEdit()}
            />
          ) : (
            <textarea
              autoFocus
              className="im-textarea"
              style={{ marginBottom: 16 }}
              value={editTarget.value}
              onChange={e => setEditTarget(p => ({ ...p, value: e.target.value }))}
            />
          )}
          <div className="im-modal-actions">
            <button className="im-btn im-btn-dark im-btn-full" onClick={handleEdit} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <button className="im-btn im-btn-outline im-btn-full" onClick={() => setEditTarget(null)}>
              Cancelar
            </button>
          </div>
        </Modal>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`im-toast ${toast.type === "err" ? "im-toast-err" : "im-toast-ok"}`}>
          {toast.msg}
        </div>
      )}
    </>
  );
}