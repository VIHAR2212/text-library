import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/ui/Navbar';
import HomePage from './pages/HomePage';
import SnippetPage from './pages/SnippetPage';

// Page transition wrapper
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <>
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/snippet/:shortId" element={<PageTransition><SnippetPage /></PageTransition>} />
          <Route path="*" element={
            <PageTransition>
              <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '60px 40px' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 20 }}>🌌</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', marginBottom: 12 }}>404</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This page doesn't exist in the library.</p>
                  <a href="/" style={{
                    display: 'inline-block', padding: '10px 24px',
                    background: 'var(--gradient-btn)', borderRadius: 10, color: '#fff',
                    fontFamily: 'var(--font-display)', fontWeight: 600,
                    textDecoration: 'none',
                  }}>
                    Go Home
                  </a>
                </div>
              </div>
            </PageTransition>
          } />
        </Routes>
      </AnimatePresence>

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255,255,255,0.95)',
            color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(10,15,40,0.9)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(16px)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.88rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        borderTop: '1px solid var(--glass-border)',
        marginTop: 40,
      }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Text Library — open, no-auth, instant ·{' '}
          <span style={{ color: 'var(--accent-blue)' }}>Store anything, share everything</span>
        </p>
      </footer>
    </>
  );
}
