import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Lenis from 'lenis';
import './index.css';
import App from './App.jsx';

// ── Lenis smooth scroll ───────────────────────────────────────────────────────
// Initialised once at the app root so Lenis wraps all scroll-linked
// framer-motion useScroll / useTransform effects correctly.
function LenisProvider({ children }) {
  useEffect(() => {
    // Skip on touch devices — Lenis can interfere with native scroll momentum
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LenisProvider>
          <App />
        </LenisProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
