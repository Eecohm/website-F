import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './SectionReveal.module.css';

/**
 * Reusable scroll-reveal wrapper.
 * direction: 'up' | 'left' | 'right' | 'clip'
 */
export default function SectionReveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  once = true,
}) {
  const prefersReduced = useReducedMotion();

  const hiddenState = prefersReduced
    ? { opacity: 0 }
    : direction === 'up'
    ? { opacity: 0, y: 32 }
    : direction === 'left'
    ? { opacity: 0, x: -40 }
    : direction === 'right'
    ? { opacity: 0, x: 40 }
    : direction === 'clip'
    ? { opacity: 0, clipPath: 'inset(0 100% 0 0)' }
    : { opacity: 0 };

  const visibleState = prefersReduced
    ? { opacity: 1, transition: { delay, duration: 0.3 } }
    : direction === 'clip'
    ? { opacity: 1, clipPath: 'inset(0 0% 0 0)', transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    : { opacity: 1, y: 0, x: 0, transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] } };

  return (
    <motion.div
      className={`${styles.wrap} ${className}`}
      initial={hiddenState}
      whileInView={visibleState}
      viewport={{ once, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}
