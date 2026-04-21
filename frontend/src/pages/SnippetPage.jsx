import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { fetchSnippet, deleteSnippet } from '../lib/api';

// ─── Icons ────────────────────────────────────────────────────────────────────
const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function detectLanguage(content) {
  try {
    const result = hljs.highlightAuto(content, [
      'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp',
      'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'css', 'html',
      'xml', 'json', 'yaml', 'sql', 'bash', 'shell', 'markdown',
    ]);
    return result;
  } catch {
    return { value: content, language: 'plaintext' };
  }
}

// Skeleton loader for the snippet detail page
function SnippetSkeleton() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      {[80, 200, 40, 500].map((h, i) => (
        <motion.div
          key={i}
          className="glass"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
          style={{ height: h, borderRadius: 12, marginBottom: 16 }}
        />
      ))}
    </div>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────
function ActionBtn({ onClick, children, variant = 'glass', disabled = false, danger = false }) {
  const styles = {
    glass: {
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      color: 'var(--text-secondary)',
    },
    primary: {
      background: 'var(--gradient-btn)',
      border: 'none',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(79,143,255,0.35)',
    },
    danger: {
      background: 'rgba(239,68,68,0.1)',
      border: '1px solid rgba(239,68,68,0.3)',
      color: '#ef4444',
    },
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.04, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '9px 16px',
        borderRadius: 10,
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        fontSize: '0.85rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.2s',
        opacity: disabled ? 0.6 : 1,
        ...(danger ? styles.danger : styles[variant]),
      }}
    >
      {children}
    </motion.button>
  );
}

// ─── Line numbers ─────────────────────────────────────────────────────────────
function LineNumbers({ count }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'flex-end',
      padding: '20px 12px 20px 20px',
      minWidth: 48,
      userSelect: 'none',
      borderRight: '1px solid var(--glass-border)',
      flexShrink: 0,
    }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          lineHeight: '1.7',
          color: 'var(--text-muted)',
        }}>
          {i + 1}
        </span>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SnippetPage() {
  const { shortId } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSnippet(shortId);
        setSnippet(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [shortId]);

  // Apply syntax highlighting after snippet loads
  useEffect(() => {
    if (snippet && codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [snippet]);

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.content);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  // Download as .txt
  const handleDownload = () => {
    const blob = new Blob([snippet.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snippet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Download started!', { icon: '⬇️' });
  };

  // Delete snippet
  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    try {
      await deleteSnippet(shortId);
      toast.success('Snippet deleted');
      navigate('/', { replace: true });
    } catch (e) {
      toast.error(e.message);
      setDeleting(false);
    }
  };

  if (loading) return <SnippetSkeleton />;

  if (error) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: '48px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>💔</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>{error}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This snippet may have been deleted or the link is invalid.</p>
          <ActionBtn variant="primary" onClick={() => navigate('/')}>
            <BackIcon /> Back to Library
          </ActionBtn>
        </motion.div>
      </div>
    );
  }

  const lineCount = (snippet.content.match(/\n/g) || []).length + 1;
  const highlighted = detectLanguage(snippet.content);
  const detectedLang = highlighted.language || 'plaintext';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 80px' }}
    >
      {/* ── Back button ─────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -3 }}
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.88rem',
          cursor: 'pointer',
          marginBottom: 28,
          padding: 0,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <BackIcon /> Back
      </motion.button>

      {/* ── Header card ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="glass"
        style={{
          padding: '28px 28px 24px',
          marginBottom: 16,
          background: 'var(--gradient-upload)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: '30%', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,143,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              flex: 1,
            }}>
              {snippet.title}
            </h1>
            {/* Language badge */}
            <span style={{
              padding: '5px 14px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 100,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--accent-blue)',
              flexShrink: 0,
              alignSelf: 'flex-start',
            }}>
              {detectedLang}
            </span>
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              📅 {formatDate(snippet.createdAt)}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              👁 {snippet.views} views
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              📝 {lineCount} lines
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {snippet.content.length.toLocaleString()} chars
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Action bar ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, flexWrap: 'wrap',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/* Copy */}
          <ActionBtn variant="primary" onClick={handleCopy}>
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckIcon /> Copied!
                </motion.div>
              ) : (
                <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CopyIcon /> Copy
                </motion.div>
              )}
            </AnimatePresence>
          </ActionBtn>

          {/* Download */}
          <motion.button
            whileHover={{ scale: 1.04, y: -1, boxShadow: '0 4px 16px rgba(45,212,191,0.3)' }}
            whileTap={{ scale: 0.96 }}
            onClick={handleDownload}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 16px',
              background: 'rgba(45,212,191,0.12)',
              border: '1px solid rgba(45,212,191,0.3)',
              borderRadius: 10,
              color: 'var(--accent-teal)',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <DownloadIcon /> Download .txt
          </motion.button>
        </div>

        {/* Delete */}
        <ActionBtn danger onClick={handleDelete} disabled={deleting}>
          <TrashIcon />
          <AnimatePresence mode="wait">
            {confirmDelete ? (
              <motion.span key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#ef4444', fontWeight: 600 }}>
                Confirm delete?
              </motion.span>
            ) : (
              <motion.span key="delete" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {deleting ? 'Deleting...' : 'Delete'}
              </motion.span>
            )}
          </AnimatePresence>
        </ActionBtn>
      </motion.div>

      {/* ── Code viewer ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="glass"
        style={{ overflow: 'hidden', position: 'relative' }}
      >
        {/* Code viewer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid var(--glass-border)',
          background: 'var(--glass-bg)',
        }}>
          {/* Traffic light dots */}
          <div style={{ display: 'flex', gap: 7 }}>
            {['#ef4444', '#f59e0b', '#10b981'].map((c, i) => (
              <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.8 }} />
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {snippet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {detectedLang}
          </span>
        </div>

        {/* Code block with line numbers */}
        <div style={{ display: 'flex', overflowX: 'auto', maxHeight: '70vh', overflowY: 'auto' }}>
          <LineNumbers count={lineCount} />
          <div style={{ flex: 1, padding: '20px 20px 20px 16px', minWidth: 0 }}>
            <pre style={{ margin: 0 }}>
              <code
                ref={codeRef}
                className={detectedLang !== 'plaintext' ? `language-${detectedLang}` : ''}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  lineHeight: 1.7,
                  color: 'var(--text-primary)',
                  display: 'block',
                  whiteSpace: 'pre',
                }}
              >
                {snippet.content}
              </code>
            </pre>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
