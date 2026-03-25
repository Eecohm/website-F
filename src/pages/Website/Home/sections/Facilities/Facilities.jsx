import { facilitiesData } from '../../../data/facilitiesData';
import styles from './Facilities.module.css';

export default function Facilities() {
  return (
    <section id="school" className={styles.facilitiesSection}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Explore what our school has to offer</h2>
        <p className={styles.subheading}>Paving path for a great future with bright vision</p>
      </div>

      <div className={styles.gridContainer}>
        {facilitiesData.map((facility, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageContainer}>
              <img src={facility.image} alt={facility.name} className={styles.image} />
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>{facility.name}</h3>
              <p className={styles.description}>{facility.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
