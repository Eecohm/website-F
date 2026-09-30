import { motion } from 'framer-motion';
import { Bot, Monitor, FlaskConical, Theater, Sprout, BookOpen, Dumbbell, Palette, Microscope, Music, UtensilsCrossed, HeartPulse, Building2 } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './FacilitiesGrid.module.css';

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: (i % 4) * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const cardVariantReduced = {
  hidden: { opacity: 0 },
  visible: (i) => ({ opacity: 1, transition: { delay: (i % 4) * 0.04, duration: 0.3 } }),
};


const iconMap = {
  Bot, Monitor, FlaskConical, Theater, Sprout, BookOpen, Dumbbell, Palette, Microscope, Music, UtensilsCrossed, HeartPulse
};

export default function FacilitiesGrid({ facilities, limit, showHeader = true }) {
  const prefersReduced = useReducedMotion();
  const variant = prefersReduced ? cardVariantReduced : cardVariant;
  const items = limit ? facilities.slice(0, limit) : facilities;

  return (
    <section className={styles.section} aria-label="Facilities">
      {showHeader && (
        <div className="container">
          <div className={styles.header}>
            <span className={styles.eyebrow}>Campus Life</span>
            <h2 className={styles.heading}>
              World-Class <span className={styles.headingAccent}>Facilities</span>
            </h2>
          </div>
        </div>
      )}

      <div className="container">
        <div className={styles.grid} role="list">
          {items.map((facility, i) => {
            const IconComponent = iconMap[facility.icon] || Building2;
            return (
              <motion.article
                key={facility.id}
                className={styles.card}
                variants={variant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
                role="listitem"
                aria-label={facility.name}
                id={`facility-${facility.id}`}
              >
                <div className={styles.imageWrap}>
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className={styles.image}
                    loading="lazy"
                    width={400}
                    height={300}
                  />
                  <div className={styles.iconBadge} aria-hidden="true">
                    <IconComponent size={18} />
                  </div>
                </div>
                <div className={styles.body}>
                  <h3 className={styles.name}>{facility.name}</h3>
                  <p className={styles.desc}>{facility.description}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
