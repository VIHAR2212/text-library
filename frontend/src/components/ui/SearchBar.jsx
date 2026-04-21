import { motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ClearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef(null);

  const handleChange = useCallback((e) => {
    const v = e.target.value;
    setValue(v);
    // Debounce search calls by 300ms
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(v), 300);
  }, [onSearch]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      style={{
        position: 'relative',
        maxWidth: 480,
        width: '100%',
      }}
    >
      {/* Search icon */}
      <div style={{
        position: 'absolute', left: 14, top: '50%',
        transform: 'translateY(-50%)',
        color: focused ? 'var(--accent-blue)' : 'var(--text-muted)',
        transition: 'color 0.2s',
        pointerEvents: 'none',
      }}>
        <SearchIcon />
      </div>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search by title or content..."
        style={{
          width: '100%',
          padding: '11px 40px 11px 40px',
          background: 'var(--glass-bg)',
          border: `1px solid ${focused ? 'var(--accent-blue)' : 'var(--glass-border)'}`,
          borderRadius: 12,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          outline: 'none',
          backdropFilter: 'var(--backdrop-blur)',
          boxShadow: focused ? '0 0 0 3px rgba(79,143,255,0.12)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      />

      {/* Clear button */}
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClear}
          style={{
            position: 'absolute', right: 12, top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 6,
            width: 22, height: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ClearIcon />
        </motion.button>
      )}
    </motion.div>
  );
}
