// Respect prefers-reduced-motion — returns true when user prefers reduced motion
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

// Returns true on touch/small-screen devices — used to disable tilt effect
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(
      window.matchMedia('(hover: none), (pointer: coarse)').matches ||
      'ontouchstart' in window
    );
  }, []);
  return isTouch;
}

// Returns true on desktop (non-touch, non-coarse pointer, width > 768)
// Used to gate 3D WebGL scene — hard off on mobile/tablet
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => {
      const notCoarse = window.matchMedia('(pointer: fine)').matches;
      const wideEnough = window.innerWidth > 768;
      setIsDesktop(notCoarse && wideEnough);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isDesktop;
}
