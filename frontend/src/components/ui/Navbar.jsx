import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

const SunIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 28px', height: '62px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--backdrop-blur)',
        WebkitBackdropFilter: 'var(--backdrop-blur)',
        borderBottom: '1px solid var(--glass-border)',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 33, height: 33,
            background: 'var(--btn-gradient)',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
            color: '#fff',
            boxShadow: 'var(--btn-shadow)',
          }}>TL</div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '-0.02em',
          }}>Text Library</span>
        </motion.div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {!isHome && (
          <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '8px 18px',
                background: 'var(--btn-gradient)',
                border: 'none', borderRadius: 10,
                color: '#fff', fontFamily: 'var(--font-body)',
                fontWeight: 600, fontSize: '0.84rem',
                cursor: 'pointer', boxShadow: 'var(--btn-shadow)',
              }}>
                + Upload
              </button>
            </Link>
          </motion.div>
        )}

        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
          onClick={toggle}
          style={{
            width: 38, height: 38,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 10,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <motion.div key={theme} initial={{ rotate: -20, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </motion.div>
        </motion.button>
      </div>
    </motion.nav>
  );
}
