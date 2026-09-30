import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { GraduationCap, TrendingUp, Lightbulb } from 'lucide-react';
import SectionReveal from '../../components/SectionReveal/SectionReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { team, philosophy, seo } from '../../data/content';
import styles from './About.module.css';

const iconMap = { GraduationCap, TrendingUp, Lightbulb };

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const cardVariantReduced = {
  hidden: { opacity: 0 },
  visible: (i) => ({ opacity: 1, transition: { delay: i * 0.04, duration: 0.3 } }),
};

export default function About() {
  const prefersReduced = useReducedMotion();
  const variant = prefersReduced ? cardVariantReduced : cardVariant;

  // ── Diorama parallax setup ───────────────────────────────────────────────
  const historySectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: historySectionRef,
    offset: ['start end', 'end start'],
  });

  // Three layers at clearly different speeds — only active on desktop/non-reduced
  const bgY      = useTransform(scrollYProgress, [0, 1], prefersReduced ? ['0%', '0%'] : ['0%', '20%']);
  const midY     = useTransform(scrollYProgress, [0, 1], prefersReduced ? ['0%', '0%'] : ['0%', '50%']);
  const contentY = useTransform(scrollYProgress, [0, 1], prefersReduced ? ['0%', '0%'] : ['0%', '80%']);

  return (
    <>
      <Helmet>
        <title>{seo['/about'].title}</title>
        <meta name="description" content={seo['/about'].description} />
        <meta property="og:title" content={seo['/about'].title} />
        <meta property="og:description" content={seo['/about'].description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://eecohm.edu.np/about" />
      </Helmet>

      <main id="main-content">
        {/* ── Hero banner ──────────────────────────────────────────────── */}
        <section className={styles.heroSection} aria-label="About page header">
          <div className="container">
            <div className={styles.heroContent}>
              <motion.span
                className={styles.eyebrow}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                About EECOHM
              </motion.span>
              <motion.h1
                className={styles.heroTitle}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                Our Story of <span className={styles.heroAccent}>Excellence</span>
              </motion.h1>
              <motion.p
                className={styles.heroSub}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                From a single hospitality program in Jhapa to a comprehensive School of
                Excellence — a decade of transforming education in Koshi Province.
              </motion.p>
            </div>
          </div>
        </section>

        {/* ── History (diorama 3-layer parallax) ───────────────────────── */}
        <section
          ref={historySectionRef}
          className={styles.historySection}
          aria-labelledby="history-heading"
        >
          <div className="container">
            <div className={styles.dioramaWrap}>

              {/* Layer 0 — background image, slowest (×0.2) */}
              <motion.div
                className={styles.dioramaBg}
                style={{ y: bgY }}
              >
                <div className={styles.historyImageWrap}>
                  <img
                    src="/images/Images/program_2.webp"
                    alt="EECOHM campus and students"
                    className={styles.historyImage}
                    loading="lazy"
                    width={600}
                    height={450}
                  />
                </div>
              </motion.div>

              {/* Layer 1 — decorative midground shape (×0.5) */}
              <motion.div
                className={styles.dioramaMid}
                style={{ y: midY }}
                aria-hidden="true"
              >
                <div className={styles.decoShape} />
              </motion.div>

              {/* Layer 2 — text content, fastest (×0.8 — appears closest) */}
              <motion.div
                className={styles.dioramaFg}
                style={{ y: contentY }}
              >
                <span className={styles.sectionEyebrow}>Our History</span>
                <h2 id="history-heading" className={styles.sectionHeading}>
                  Born in <span className={styles.headingAccent}>2015</span>, Built for the Future
                </h2>
                <p className={styles.historyText}>
                  In 2015, Eastern Empire College Of Hotel Management was born with a bold
                  vision to redefine education in the hotel and hospitality industry. What
                  started as a single program — the Diploma in Hotel Management (DHM) —
                  quickly gained momentum, attracting ambitious students eager to build
                  careers in hospitality.
                </p>
                <p className={styles.historyText}>
                  With a strong foundation in practical learning and academic excellence, the
                  institution soon expanded, introducing +2 level programs including the
                  Advanced Diploma in Hotel Management (ADHM), Advanced Diploma in Computer
                  Science (ADCS), and Business Studies.
                </p>
                <p className={styles.historyText}>
                  By 2025, EECOHM took its biggest leap yet, transforming into EECOHM School
                  of Excellence — offering programs from Pre-Group (PG) levels to Advanced
                  Diplomas, cementing its place as a leader in academic excellence and
                  industry readiness in Koshi Province.
                </p>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── Philosophy ──────────────────────────────────────────────── */}
        <section className={styles.philosophySection} aria-labelledby="philosophy-heading">
          <div className="container">
            <div className={styles.philosophyHeader}>
              <SectionReveal>
                <span className={styles.sectionEyebrow}>Our Philosophy</span>
                <h2 id="philosophy-heading" className={styles.sectionHeading}>
                  Learn. Grow. <span className={styles.headingAccent}>Innovate.</span>
                </h2>
              </SectionReveal>
            </div>

            <div className={styles.philosophyGrid}>
              {philosophy.map((item, i) => {
                const Icon = iconMap[item.icon] || GraduationCap;
                return (
                  <motion.div
                    key={item.key}
                    className={styles.philosophyCard}
                    variants={variant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    custom={i}
                  >
                    <div className={styles.philosophyIcon} aria-hidden="true">
                      <Icon size={26} />
                    </div>
                    <h3 className={styles.philosophyCardTitle}>{item.heading}</h3>
                    <p className={styles.philosophyCardText}>{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Team ────────────────────────────────────────────────────── */}
        <section className={styles.teamSection} aria-labelledby="team-heading">
          <div className="container">
            <div className={styles.teamHeader}>
              <SectionReveal>
                <span className={styles.sectionEyebrow}>Leadership</span>
                <h2 id="team-heading" className={styles.sectionHeading}>
                  Meet Our <span className={styles.headingAccent}>Team</span>
                </h2>
              </SectionReveal>
            </div>

            <div className={styles.teamGrid}>
              {team.map((member, i) => (
                <motion.article
                  key={member.name}
                  className={styles.teamCard}
                  variants={variant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  custom={i}
                  aria-label={`${member.name}, ${member.role}`}
                >
                  <div className={styles.teamImageWrap}>
                    <img
                      src={member.image}
                      alt={member.name}
                      className={styles.teamImage}
                      loading="lazy"
                      width={200}
                      height={200}
                    />
                  </div>
                  <div className={styles.teamInfo}>
                    <p className={styles.teamName}>{member.name}</p>
                    <p className={styles.teamRole}>{member.role}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
