/**
 * ProgramCard — with physics-driven 3D tilt (desktop) or plain entrance (touch/reduced).
 *
 * The tilt uses Framer Motion useMotionValue + useSpring instead of react-parallax-tilt.
 * Spring: stiffness=150, damping=15, mass=0.5 — natural overshoot on mouse leave.
 *
 * A radial-gradient "glare" layer tracks the mouse to simulate a reflective surface.
 * The card body sits on translateZ(40px) so it visibly separates from the card
 * background when tilted — this is the real depth cue.
 *
 * Touch / reduced-motion: no tilt, no glare — only the whileInView entrance fade.
 */

import { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { useReducedMotion, useIsTouchDevice } from '../../hooks/useReducedMotion';
import styles from './ProgramCard.module.css';

const SPRING = { stiffness: 150, damping: 15, mass: 0.5 };
const MAX_TILT = 8; // degrees

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const cardVariantReduced = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.06, duration: 0.3 },
  }),
};

// ── Plain card (touch / reduced motion) ─────────────────────────────────────
function PlainCard({ program, index, variant }) {
  return (
    <motion.article
      className={styles.card}
      variants={variant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      custom={index}
      aria-label={`Program: ${program.name}`}
      id={`program-card-${program.slug}`}
    >
      <CardInner program={program} />
    </motion.article>
  );
}

// ── Shared card inner content ────────────────────────────────────────────────
function CardInner({ program, elevated = false }) {
  const bodyStyle = elevated ? { transform: 'translateZ(40px)' } : {};
  return (
    <>
      <div className={styles.imageWrap}>
        <img
          src={program.image}
          alt={program.shortName}
          className={styles.image}
          loading="lazy"
          width={400}
          height={225}
        />
        <span className={styles.badge}>{program.duration}</span>
        {program.icon && (
          <div className={styles.iconWrap}>
            <img src={program.icon} alt={`${program.acronym} icon`} className={styles.iconImg} />
          </div>
        )}
      </div>

      <div className={styles.body} style={bodyStyle}>
        <h3 className={styles.name}>{program.name}</h3>
        <div className={styles.duration}>
          <Clock size={13} />
          <span>{program.duration} Program</span>
        </div>
        <p className={styles.desc}>{program.description}</p>

        {program.features && program.features.length > 0 && (
          <ul className={styles.features} role="list">
            {program.features.slice(0, 3).map((f) => (
              <li key={f} className={styles.feature}>
                <span className={styles.featureDot} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        )}

        <Link
          to={`/programs/${program.slug}`}
          className={styles.link}
          aria-label={`Learn more about ${program.name}`}
        >
          Learn More <ArrowRight size={15} />
        </Link>
      </div>
    </>
  );
}

// ── Physics tilt card (desktop) ──────────────────────────────────────────────
function TiltCard({ program, index, variant }) {
  const cardRef = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const rotateX = useSpring(rawX, SPRING);
  const rotateY = useSpring(rawY, SPRING);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;  // 0 → 1
    const relY = (e.clientY - rect.top) / rect.height;

    rawX.set((relY - 0.5) * -MAX_TILT * 2); // top → positive rotateX
    rawY.set((relX - 0.5) * MAX_TILT * 2);  // right → positive rotateY

    // Glare follows mouse as percentage for the radial-gradient position
    glareX.set(relX * 100);
    glareY.set(relY * 100);
  }, [rawX, rawY, glareX, glareY]);

  const handleMouseLeave = useCallback(() => {
    // Springs naturally overshoot to 0 — correct behaviour
    rawX.set(0);
    rawY.set(0);
    glareX.set(50);
    glareY.set(50);
  }, [rawX, rawY, glareX, glareY]);

  // Convert glare motion values to CSS string for the radial-gradient
  const glareStyle = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18) 0%, transparent 65%)`
  );

  return (
    // Outer wrapper provides the CSS perspective context
    <div className={styles.tiltOuter}>
      <motion.article
        ref={cardRef}
        className={styles.card}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        variants={variant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        custom={index}
        aria-label={`Program: ${program.name}`}
        id={`program-card-${program.slug}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glare layer — sits on top, tracks cursor, sells reflective surface */}
        <motion.div
          className={styles.glare}
          style={{ background: glareStyle }}
          aria-hidden="true"
        />

        {/* Card content elevated on Z axis — visibly pops on tilt */}
        <CardInner program={program} elevated />
      </motion.article>
    </div>
  );
}

// ── Exported component ───────────────────────────────────────────────────────
export default function ProgramCard({ program, index = 0 }) {
  const prefersReduced = useReducedMotion();
  const isTouch = useIsTouchDevice();
  const variant = prefersReduced ? cardVariantReduced : cardVariant;

  if (isTouch || prefersReduced) {
    return <PlainCard program={program} index={index} variant={variant} />;
  }

  return <TiltCard program={program} index={index} variant={variant} />;
}
