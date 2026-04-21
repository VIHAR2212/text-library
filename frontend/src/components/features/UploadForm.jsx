import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createSnippet } from '../../lib/api';

const Spinner = () => (
  <div style={{
    width: 17, height: 17,
    border: '2.5px solid rgba(255,255,255,0.25)',
    borderTopColor: '#fff', borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  }} />
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function UploadForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!content.trim()) { toast.error('Content is required'); return; }
    setLoading(true);
    try {
      const snippet = await createSnippet({ title, content });
      setSuccess(true);
      toast.success('Snippet uploaded! ✨');
      onSuccess?.(snippet);
      setTimeout(() => { setTitle(''); setContent(''); setSuccess(false); }, 1400);
    } catch (e) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: 11,
    color: 'var(--text-primary)',
    outline: 'none',
    backdropFilter: 'blur(8px)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--font-display)',
    fontSize: '0.75rem', fontWeight: 600,
    color: 'var(--text-secondary)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 8,
  };

  return (
    <div className="glass" style={{
      padding: '28px',
      background: 'var(--upload-gradient)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Reference image style blobs */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(120,56,244,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -20, width: 160, height: 160, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(69,122,255,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -30, right: '30%', width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(68,215,173,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Title */}
        <div>
          <label style={labelStyle}>Title</label>
          <input
            type="text" value={title} maxLength={200}
            onChange={e => setTitle(e.target.value)}
            placeholder="Name your snippet..."
            style={{ ...inputStyle, padding: '12px 16px', fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 500 }}
            onFocus={e => { e.target.style.borderColor = 'var(--input-focus-border)'; e.target.style.boxShadow = `0 0 0 3px var(--input-focus-shadow)`; }}
            onBlur={e => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Content */}
        <div>
          <label style={labelStyle}>Content</label>
          <textarea
            value={content} rows={10}
            onChange={e => setContent(e.target.value)}
            placeholder="Paste your code or text here..."
            style={{ ...inputStyle, padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.84rem', lineHeight: 1.7, resize: 'vertical', minHeight: 200 }}
            onFocus={e => { e.target.style.borderColor = '#A898FF'; e.target.style.boxShadow = '0 0 0 3px rgba(168,152,255,0.15)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Submit button */}
        <motion.button
          whileHover={!loading && !success ? { scale: 1.02, y: -2, boxShadow: 'var(--btn-shadow-hover)' } : {}}
          whileTap={!loading && !success ? { scale: 0.97 } : {}}
          onClick={handleSubmit}
          disabled={loading || success}
          style={{
            width: '100%', padding: '14px',
            background: success ? 'linear-gradient(135deg, #44D7AD, #457AFF)' : 'var(--btn-gradient)',
            border: 'none', borderRadius: 12,
            color: '#fff', fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: '1rem',
            cursor: loading || success ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: success ? '0 4px 20px rgba(68,215,173,0.4)' : 'var(--btn-shadow)',
            transition: 'background 0.3s, box-shadow 0.3s',
          }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Spinner /> Uploading...
              </motion.div>
            ) : success ? (
              <motion.div key="s" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckIcon /> Uploaded!
              </motion.div>
            ) : (
              <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload Snippet
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
