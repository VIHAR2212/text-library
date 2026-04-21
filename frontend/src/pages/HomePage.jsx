import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import SearchBar from '../components/ui/SearchBar';
import SnippetCard from '../components/features/SnippetCard';
import UploadForm from '../components/features/UploadForm';
import { useSnippets } from '../hooks/useSnippets';

// Grid skeleton loader
function SkeletonCard({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
      className="glass"
      style={{ minHeight: 180, borderRadius: 16 }}
    />
  );
}

export default function HomePage() {
  const [search, setSearch] = useState('');
  const { snippets, loading, loadingMore, error, hasMore, loadMore, prependSnippet } = useSnippets(search);

  const handleSearch = useCallback((q) => setSearch(q), []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        style={{ textAlign: 'center', padding: '64px 0 48px' }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 100,
            marginBottom: 24,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
            no login required · free to use
          </span>
        </motion.div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2.8rem, 6vw, 5rem)',
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          marginBottom: 16,
          background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-blue) 70%, var(--accent-purple) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Text Library
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          color: 'var(--text-secondary)',
          fontWeight: 300,
          letterSpacing: '0.02em',
          marginBottom: 48,
        }}>
          Store. Share. Access Code Instantly.
        </p>

        {/* Upload form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          style={{ maxWidth: 680, margin: '0 auto' }}
        >
          <UploadForm onSuccess={prependSnippet} />
        </motion.div>
      </motion.section>

      {/* ── Library section ──────────────────────────────────── */}
      <section>
        {/* Section header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 28,
        }}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.4rem',
              color: 'var(--text-primary)',
            }}>
              Library
            </h2>
            {!loading && (
              <span style={{
                padding: '3px 10px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 100,
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
                {snippets.length} snippets
              </span>
            )}
          </motion.div>

          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass"
            style={{ padding: '20px', textAlign: 'center', color: 'var(--accent-orange)', marginBottom: 24 }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
          </div>
        ) : snippets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass"
            style={{ padding: '60px 20px', textAlign: 'center' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>
              {search ? 'No snippets match your search' : 'No snippets yet'}
            </p>
            <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: '0.9rem' }}>
              {search ? 'Try a different query' : 'Upload the first one above!'}
            </p>
          </motion.div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {snippets.map((s, i) => (
              <SnippetCard key={s._id} snippet={s} index={i} />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', marginTop: 40 }}
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={loadMore}
              disabled={loadingMore}
              style={{
                padding: '12px 32px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 12,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: loadingMore ? 'wait' : 'pointer',
                backdropFilter: 'var(--backdrop-blur)',
                transition: 'all 0.2s',
              }}
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </motion.button>
          </motion.div>
        )}
      </section>
    </div>
  );
}
