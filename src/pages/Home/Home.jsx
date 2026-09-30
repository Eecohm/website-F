import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, GraduationCap, TrendingUp, Lightbulb } from 'lucide-react';
import Hero from '../../components/Hero/Hero';
import StatsSection from '../../components/StatsSection/StatsSection';
import ProgramCard from '../../components/ProgramCard/ProgramCard';
import TestimonialsSection from '../../components/TestimonialsSection/TestimonialsSection';
import MarqueeStrip from '../../components/MarqueeStrip/MarqueeStrip';
import SectionReveal from '../../components/SectionReveal/SectionReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { programs, philosophy, seo } from '../../data/content';
import styles from './Home.module.css';

const FacilitiesGrid = lazy(() => import('../../components/FacilitiesGrid/FacilitiesGrid'));
const ProgramShowcase3D = lazy(() => import('../../components/ProgramShowcase3D/ProgramShowcase3D'));
import { facilities } from '../../data/content';

const iconMap = { GraduationCap, TrendingUp, Lightbulb };

// Show only top 3 flagship programs on homepage
const featuredPrograms = programs.slice(0, 3);

export default function Home() {
  const prefersReduced = useReducedMotion();

  return (
    <>
      <Helmet>
        <title>{seo['/'].title}</title>
        <meta name="description" content={seo['/'].description} />
        <meta property="og:title" content={seo['/'].title} />
        <meta property="og:description" content={seo['/'].description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/Images/Home.webp" />
        <link rel="canonical" href="https://eecohm.edu.np/" />
      </Helmet>

      <main className={styles.main} id="main-content">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Marquee strip */}
        <MarqueeStrip />

        {/* 3. Featured Programs */}
        <section className={styles.programsSection} aria-labelledby="programs-heading">
          <div className="container">
            <div className={styles.sectionHeader}>
              <SectionReveal>
                <span className={styles.eyebrow}>What We Offer</span>
                <h2 id="programs-heading" className={styles.sectionHeading}>
                  Our Flagship <span className={styles.headingAccent}>Programs</span>
                </h2>
                <p className={styles.sectionSubhead}>
                  NEB-affiliated programs designed for real-world success, with dual
                  certifications and internship placement.
                </p>
              </SectionReveal>
            </div>

            <div className={styles.programsGrid}>
              {featuredPrograms.map((prog, i) => (
                <ProgramCard key={prog.slug} program={prog} index={i} />
              ))}
            </div>

            <div className={styles.viewAllWrap}>
              <motion.div
                whileHover={prefersReduced ? {} : { scale: 1.03 }}
                whileTap={prefersReduced ? {} : { scale: 0.97 }}
              >
                <Link to="/programs" className={styles.viewAllBtn} id="home-view-all-programs">
                  View All Programs <ArrowRight size={17} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. Interactive 3D Program Showcase */}
        <Suspense fallback={<div style={{ minHeight: 560 }} />}>
          <ProgramShowcase3D />
        </Suspense>

        {/* 5. Stats */}
        <StatsSection />

        {/* 5. About strip */}
        <section className={styles.aboutStrip} aria-labelledby="about-heading">
          <div className="container">
            <div className={styles.aboutGrid}>
              <SectionReveal direction="left">
                <div className={styles.aboutImageWrap}>
                  <img
                    src="/images/Images/program_3.webp"
                    alt="EECOHM students"
                    className={styles.aboutImage}
                    loading="lazy"
                    width={600}
                    height={450}
                  />
                  <div className={styles.aboutBadge}>Est. 2015</div>
                </div>
              </SectionReveal>

              <div className={styles.aboutContent}>
                <SectionReveal direction="right">
                  <h2 id="about-heading" className={styles.sectionHeading}>
                    A Decade of Shaping <span className={styles.headingAccent}>Excellence</span>
                  </h2>
                  <p className={styles.aboutText}>
                    What began as a single Hotel Management program in Birtamod, Jhapa
                    in 2015 has grown into EECOHM School of Excellence — a comprehensive
                    institution now offering programs from Pre-School to Advanced Diplomas,
                    with students placed in top hotels, IT firms, and businesses across
                    Nepal and abroad.
                  </p>
                </SectionReveal>

                <div className={styles.philosophyList}>
                  {philosophy.map((item, i) => {
                    const Icon = iconMap[item.icon] || GraduationCap;
                    return (
                      <SectionReveal key={item.key} direction="right" delay={i * 0.1}>
                        <div className={styles.philosophyItem}>
                          <div className={styles.philosophyIcon} aria-hidden="true">
                            <Icon size={22} />
                          </div>
                          <div className={styles.philosophyText}>
                            <h4>{item.heading}</h4>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      </SectionReveal>
                    );
                  })}
                </div>

                <SectionReveal direction="right" delay={0.4}>
                  <Link to="/about" className={styles.aboutLink} id="home-about-link">
                    Read Our Full Story <ArrowRight size={16} />
                  </Link>
                </SectionReveal>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Facilities preview */}
        <Suspense fallback={<div style={{ minHeight: 300 }} />}>
          <FacilitiesGrid facilities={facilities} limit={4} showHeader />
        </Suspense>

        {/* 7. Testimonials */}
        <TestimonialsSection />
      </main>
    </>
  );
}
