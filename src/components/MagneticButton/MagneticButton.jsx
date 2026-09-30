/**
 * MagneticButton — wraps a child element with a physics-spring "magnetic pull"
 * toward the cursor when the mouse is within a defined radius.
 *
 * Applied ONLY to primary CTAs (Hero "Explore Programs", Contact submit).
 * On touch devices or prefers-reduced-motion, renders children directly.
 *
 * Spring: stiffness=300, damping=10, mass=0.5 — snappy but soft, bounces
 * slightly past zero on mouse leave (natural spring behaviour, don't suppress).
 */

import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useIsTouchDevice, useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './MagneticButton.module.css';

const SPRING = { stiffness: 300, damping: 10, mass: 0.5 };

export default function MagneticButton({ children, radius = 80, maxOffset = 10 }) {
  const isTouch = useIsTouchDevice();
  const prefersReduced = useReducedMotion();

  // Render bare children — no DOM overhead, no event listeners
  if (isTouch || prefersReduced) return children;

  return <MagneticInner radius={radius} maxOffset={maxOffset}>{children}</MagneticInner>;
}

// Separate inner component so hooks only run when magnetic is actually active
function MagneticInner({ children, radius, maxOffset }) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < radius + rect.width / 2) {
      // Map cursor delta to offset, clamp to maxOffset
      const strength = Math.max(0, 1 - dist / (radius + rect.width / 2));
      rawX.set(Math.max(-maxOffset, Math.min(maxOffset, dx * strength * 0.4)));
      rawY.set(Math.max(-maxOffset, Math.min(maxOffset, dy * strength * 0.4)));
    } else {
      rawX.set(0);
      rawY.set(0);
    }
  }, [radius, maxOffset, rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    // Springs naturally overshoot back to 0 — don't force-reset, let physics play
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <motion.div
      ref={ref}
      className={styles.magnetic}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
