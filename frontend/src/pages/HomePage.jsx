import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import SearchBar from '../components/ui/SearchBar';
import SnippetCard from '../components/features/SnippetCard';
import UploadForm from '../components/features/UploadForm';
import { useSnippets } from '../hooks/useSnippets';

function SkeletonCard({ index }) {
  return (
    <motion.div
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.12 }}
      className="glass"
      style={{ minHeight: 190, borderRadius: 18 }}
    />
  );
}

function FloatingUploadBtn({ onClick }) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1, boxShadow: '0 8px 30px rgba(120,56,244,0.6)' }}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 36, right: 36,
        width: 58, height: 58,
        borderRadius: '50%',
        background: 'var(--btn-gradient)',
        border: 'none',
        color: '#fff',
        fontSize: '1.8rem',
        fontWeight: 300,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'var(--btn-shadow)',
        zIndex: 200,
        lineHeight: 1,
      }}
      aria-label="Upload snippet"
    >
      +
    </motion.button>
  );
}

function UploadModal({ onClose, onSuccess }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 620, position: 'relative' }}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              position: 'absolute', top: -14, right: -14,
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10,
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
            }}
          >✕</motion.button>
          <UploadForm onSuccess={(snippet) => { onSuccess(snippet); onClose(); }} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const { snippets, loading, loadingMore, error, hasMore, loadMore, prependSnippet } = useSnippets(search);
  const handleSearch = useCallback((q) => setSearch(q), []);

  return (
    <>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 100px' }}>
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          style={{ textAlign: 'center', padding: '72px 0 64px' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 18px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 100, marginBottom: 32,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#44D7AD', boxShadow: '0 0 8px #44D7AD' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              no login required · free to use
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(3.5rem, 9vw, 7rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: 24,
              background: 'linear-gradient(135deg, var(--text-primary) 0%, #457AFF 45%, #A898FF 70%, #FF3CAC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Text<br />Library
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              color: 'var(--text-secondary)',
              fontWeight: 300,
              letterSpacing: '0.05em',
              marginBottom: 40,
            }}
          >
            Store. Share. Access Code Instantly.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.05, y: -3, boxShadow: 'var(--btn-shadow-hover)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowUpload(true)}
            style={{
              padding: '14px 36px',
              background: 'var(--btn-gradient)',
              border: 'none', borderRadius: 14,
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: 'var(--btn-shadow)',
              letterSpacing: '0.01em',
            }}
          >
            + Upload Snippet
          </motion.button>
        </motion.section>

        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Library</h2>
              {!loading && (
                <span style={{ padding: '3px 12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 100, fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {snippets.length} snippets
                </span>
              )}
            </motion.div>
            <SearchBar onSearch={handleSearch} />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass"
              style={{ padding: '20px', textAlign: 'center', color: 'var(--accent-warning)', marginBottom: 24 }}>
              ⚠️ {error}
            </motion.div>
          )}

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
            </div>
          ) : snippets.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass"
              style={{ padding: '70px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📭</div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                {search ? 'No snippets match your search' : 'Library is empty'}
              </p>
              <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: '0.9rem' }}>
                {search ? 'Try a different query' : 'Hit the + button to upload the first one!'}
              </p>
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {snippets.map((s, i) => <SnippetCard key={s._id} snippet={s} index={i} />)}
            </div>
          )}

          {hasMore && !loading && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={loadMore} disabled={loadingMore}
                style={{ padding: '12px 32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', cursor: loadingMore ? 'wait' : 'pointer', backdropFilter: 'var(--backdrop-blur)' }}>
                {loadingMore ? 'Loading...' : 'Load More'}
              </motion.button>
            </div>
          )}
        </section>
      </div>

      <FloatingUploadBtn onClick={() => setShowUpload(true)} />

      <AnimatePresence>
        {showUpload && (
          <UploadModal onClose={() => setShowUpload(false)} onSuccess={prependSnippet} />
        )}
      </AnimatePresence>
    </>
  );
}
