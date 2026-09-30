import FastMarquee from 'react-fast-marquee';
const Marquee = FastMarquee.default || FastMarquee;
import styles from './MarqueeStrip.module.css';

const partners = [
  { name: 'LCCI GQ', domain: 'lccigq.com' },
  { name: 'Qualification Scotland', domain: 'sqa.org.uk' },
  { name: 'National Education Board', domain: 'neb.gov.np' },
  { name: 'Karkhana', domain: 'karkhana.asia' },
  { name: 'My Second Teacher', domain: 'mysecondteacher.com.np' },
  { name: 'Shree Arunodaya Shacos', src: '/images/pngs/arunodaya.png' },
  { name: 'E-School', src: '/images/pngs/eschool.png' }
];

const badges = partners.map(p => ({
  src: p.src || `https://www.google.com/s2/favicons?domain=${p.domain}&sz=128`,
  alt: p.name,
  name: p.name
}));

export default function MarqueeStrip() {
  return (
    <div className={styles.strip} aria-label="Accreditations and partnerships">
      <p className={styles.label}>Accreditations &amp; Partners</p>
      <Marquee
        speed={40}
        pauseOnHover
        gradient={false}
        aria-label="Scrolling partner logos"
      >
        {badges.map((badge) => (
          <div key={badge.src} className={styles.item} title={badge.name}>
            <img
              src={badge.src}
              alt={badge.alt}
              className={styles.img}
              loading="lazy"
              width={120}
              height={52}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className={styles.partnerName}>{badge.name}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
