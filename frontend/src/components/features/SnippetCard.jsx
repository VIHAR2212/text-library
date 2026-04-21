import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Exact gradients from the reference image — cycling through all 3 combos
const CARD_GRADIENTS = [
  'var(--card-gradient-1)', // blue → teal  (#457AFF → #44D7AD)
  'var(--card-gradient-2)', // purple → lavender (#7838F4 → #A898FF)
  'var(--card-gradient-3)', // orange → pink (#FF6B35 → #FF3CAC)
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Language dot colors matching the reference palette
const LANG_COLORS = {
  javascript: '#FF6B35',
  typescript: '#457AFF',
  python: '#44D7AD',
  css: '#A898FF',
  html: '#FF3CAC',
  json: '#44D7AD',
  bash: '#44D7AD',
  sql: '#FF6B35',
  default: '#A898FF',
};

export default function SnippetCard({ snippet, index }) {
  const preview = snippet.content.split('\n').slice(0, 5).join('\n');
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const langColor = LANG_COLORS[snippet.language] || LANG_COLORS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.42), ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -7, transition: { duration: 0.22, ease: [0.23,1,0.32,1] } }}
    >
      <Link to={`/snippet/${snippet.shortId}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          className="glass"
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '22px',
            minHeight: '190px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            cursor: 'pointer',
          }}
        >
          {/* Gradient tint overlay — the key frosted glass effect */}
          <div style={{
            position: 'absolute', inset: 0,
            background: gradient,
            pointerEvents: 'none',
          }} />

          {/* Subtle inner glow at top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            pointerEvents: 'none',
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: 'var(--text-primary)',
                lineHeight: 1.3,
                flex: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {snippet.title}
              </h3>
              {snippet.language && snippet.language !== 'plaintext' && (
                <span style={{
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 9px',
                  borderRadius: 100,
                  background: `${langColor}20`,
                  color: langColor,
                  border: `1px solid ${langColor}40`,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  letterSpacing: '0.04em',
                }}>
                  {snippet.language}
                </span>
              )}
            </div>

            {/* Code preview */}
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.71rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
              flex: 1,
            }}>
              {preview}
            </pre>
          </div>

          {/* Footer */}
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 10,
            borderTop: '1px solid var(--glass-border)',
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {formatDate(snippet.createdAt)}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: langColor, opacity: 0.7 }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{snippet.views} views</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
