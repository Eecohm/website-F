import { useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import FastCountUp from 'react-countup';
const CountUp = FastCountUp.default || FastCountUp;
import { useReducedMotion, useIsDesktop } from '../../hooks/useReducedMotion';
import MagneticButton from '../MagneticButton/MagneticButton';
import { stats } from '../../data/content';
import styles from './Hero.module.css';

// ── Lazy-load the R3F scene — only fetched after hero enters viewport ────────
// This import is never in the initial JS bundle.
const HeroScene = lazy(() => import('../HeroScene/HeroScene'));

// ── Animation variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const wordVariant = {
  hidden: { y: '110%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const wordVariantReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.55, ease: 'easeOut' } }),
};

const fadeUpReduced = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({ opacity: 1, transition: { delay: i * 0.08, duration: 0.3 } }),
};

const headlineLines = [
  ['Shaping', 'Careers,'],
  ['Building', <span key="futures" className={styles.accent}>Futures.</span>],
];

// ── CSS blob fallback (mobile + reduced-motion) ──────────────────────────────
function CssBlobs({ reduced }) {
  if (reduced) return null; // Static blobs already exist in DOM via CSS; just skip animation
  return (
    <>
      <div className={styles.blob + ' ' + styles.blob1} aria-hidden="true" />
      <div className={styles.blob + ' ' + styles.blob2} aria-hidden="true" />
      <div className={styles.blob + ' ' + styles.blob3} aria-hidden="true" />
    </>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const prefersReduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const ref = useRef(null);

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 500], [0, prefersReduced ? 0 : 80]);

  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  // Intersection trigger for lazy-loading the 3D scene — fires once
  const [sceneRef, sceneInView] = useInView({ triggerOnce: true, threshold: 0 });

  const wv = prefersReduced ? wordVariantReduced : wordVariant;
  const fu = prefersReduced ? fadeUpReduced : fadeUp;

  const show3D = isDesktop && !prefersReduced;

  return (
    <section className={styles.hero} ref={ref} aria-label="Hero section">
      {/* ── Parallax background image — always in DOM for SEO/LCP ── */}
      <motion.img
        src="/images/Images/Home.webp"
        alt="EECOHM School of Excellence campus"
        className={styles.bgImage}
        style={{ y: imageY }}
        loading="eager"
        fetchPriority="high"
        width={1920}
        height={1080}
      />

      {/* ── Gradient overlay ── */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* ── 3D scene (desktop) OR CSS blobs (mobile/reduced) ──────────────── */}
      {/* sceneRef is placed here so intersection fires as soon as hero is visible */}
      <div ref={sceneRef} className={styles.sceneAnchor} aria-hidden="true">
        {show3D && sceneInView ? (
          // Suspense fallback = CSS blobs while Three.js chunk downloads
          <Suspense fallback={<CssBlobs reduced={prefersReduced} />}>
            <HeroScene />
          </Suspense>
        ) : (
          <CssBlobs reduced={prefersReduced} />
        )}
      </div>

      {/* ── Content — always in DOM, fully crawlable ─────────────────────── */}
      <div className={styles.content}>
        {/* Eyebrow */}
        <motion.div
          className={styles.eyebrow}
          variants={fu}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          Est. 2015 · Birtamod, Jhapa · NEB Affiliated
        </motion.div>

        {/* Staggered headline */}
        <motion.h1
          className={styles.headline}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label="Shaping Careers, Building Futures."
        >
          {headlineLines.map((words, lineIdx) => (
            <span key={lineIdx} style={{ display: 'block' }}>
              {words.map((word, wi) => (
                <span key={wi} className={styles.wordWrap}>
                  <motion.span
                    style={{ display: 'inline-block', marginRight: '0.28em' }}
                    variants={wv}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </motion.h1>

        {/* Sub */}
        <motion.p
          className={styles.sub}
          variants={fu}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          Eastern Empire College Of Hotel Management — offering NEB-affiliated programs
          in Computer Science, Hotel Management, and Business Studies since 2015.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className={styles.ctas}
          variants={fu}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          {/* Primary CTA — wrapped in MagneticButton on desktop */}
          <MagneticButton radius={80} maxOffset={10}>
            <motion.div
              whileHover={prefersReduced ? {} : { scale: 1.04, y: -2, boxShadow: '0 12px 40px rgba(255,189,89,0.45)' }}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
            >
              <Link to="/programs" className={styles.btnPrimary} id="hero-explore-btn">
                Explore Programs <ArrowRight size={18} />
              </Link>
            </motion.div>
          </MagneticButton>

          <motion.div
            whileHover={prefersReduced ? {} : { scale: 1.04, y: -2 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
          >
            <Link to="/about" className={styles.btnSecondary} id="hero-about-btn">
              Our Story
            </Link>
          </motion.div>
        </motion.div>

        {/* Inline stats */}
        <div className={styles.statsBar} ref={statsRef} aria-label="Quick statistics">
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>
                {statsInView ? (
                  <CountUp end={s.value} duration={2.5} suffix={s.suffix} useEasing enableScrollSpy={false} />
                ) : (
                  `0${s.suffix}`
                )}
              </span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollDot} />
        <span>Scroll</span>
      </div>
    </section>
  );
}
