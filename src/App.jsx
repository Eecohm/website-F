import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { useReducedMotion } from './hooks/useReducedMotion';

// Route-based code splitting
const Home         = lazy(() => import('./pages/Home/Home'));
const About        = lazy(() => import('./pages/About/About'));
const Programs     = lazy(() => import('./pages/Programs/Programs'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail/ProgramDetail'));
const Facilities   = lazy(() => import('./pages/Facilities/Facilities'));
const Contact      = lazy(() => import('./pages/Contact/Contact'));
const CreditTransfer = lazy(() => import('./pages/CreditTransfer/CreditTransfer'));
const WhyEecohm   = lazy(() => import('./pages/WhyEecohm/WhyEecohm'));
const NotFound     = lazy(() => import('./pages/NotFound/NotFound'));

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
};

const pageVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.1 } },
  exit:    { opacity: 0, transition: { duration: 0.08 } },
};

// Minimal loading fallback
function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
      }}
      role="status"
      aria-label="Loading page"
    >
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '3px solid var(--color-surface-alt)',
        borderTopColor: 'var(--color-primary)',
        animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? pageVariantsReduced : pageVariants;

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          top: '-100px',
          left: 0,
          padding: '8px 16px',
          background: 'var(--color-primary)',
          color: 'white',
          fontWeight: 600,
          fontSize: '0.875rem',
          zIndex: 9999,
          borderRadius: '0 0 8px 0',
          transition: 'top 0.2s',
        }}
        onFocus={(e) => { e.currentTarget.style.top = '0'; }}
        onBlur={(e) => { e.currentTarget.style.top = '-100px'; }}
      >
        Skip to main content
      </a>

      <Navbar />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              <Route path="/"                    element={<Home />} />
              <Route path="/about"               element={<About />} />
              <Route path="/programs"            element={<Programs />} />
              <Route path="/programs/:slug"      element={<ProgramDetail />} />
              <Route path="/facilities"          element={<Facilities />} />
              <Route path="/credit-transfer"     element={<CreditTransfer />} />
              <Route path="/why-eecohm"          element={<WhyEecohm />} />
              <Route path="/contact"             element={<Contact />} />
              <Route path="*"                    element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </motion.div>
      </AnimatePresence>

      {/* Global spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
