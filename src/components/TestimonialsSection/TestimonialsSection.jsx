import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { testimonials } from '../../data/content';
import styles from './TestimonialsSection.module.css';

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: 'easeOut' },
  }),
};

const cardVariantReduced = {
  hidden: { opacity: 0 },
  visible: (i) => ({ opacity: 1, transition: { delay: i * 0.06, duration: 0.3 } }),
};

export default function TestimonialsSection() {
  const prefersReduced = useReducedMotion();
  const variant = prefersReduced ? cardVariantReduced : cardVariant;

  return (
    <section className={styles.section} aria-label="Student and faculty testimonials">
      <div className="container">
        <div className={styles.header}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Testimonials
          </motion.span>
          <motion.h2
            className={styles.heading}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Voices of <span className={styles.headingAccent}>Excellence</span>
          </motion.h2>
        </div>

        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              className={styles.card}
              variants={variant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              custom={i}
              aria-label={`Testimonial from ${t.name}`}
            >
              <img
                src={t.image}
                alt={t.name}
                className={styles.avatar}
                loading="lazy"
                width={72}
                height={72}
              />
              <div className={styles.body}>
                <div className={styles.stars} aria-label={`${t.stars} out of 5 stars`} role="img">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} size={14} className={styles.star} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className={styles.quote}>"{t.quote}"</blockquote>
                <p className={styles.name}>{t.name}</p>
                <p className={styles.role}>{t.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
