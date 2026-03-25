import { useState } from 'react';
import styles from './CourseCard.module.css';

export default function CourseCard({ course }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={course.photo} alt={course.name} className={styles.image} />
        <div className={styles.iconWrapper}>
          <img src={course.icon} alt="Icon" className={styles.icon} />
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{course.name}</h3>
        <span className={styles.duration}>{course.duration}</span>
        
        <p className={styles.description}>{course.description}</p>
        
        <div className={`${styles.features} ${isExpanded ? styles.expanded : ''}`}>
          <ul className={styles.featureList}>
            {course.keyFeatures.map((feature, idx) => (
              <li key={idx} className={styles.featureItem}>{feature}</li>
            ))}
          </ul>
        </div>
        
        <button 
          className={styles.toggleBtn} 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Learn More'}
        </button>
      </div>
    </div>
  );
}
