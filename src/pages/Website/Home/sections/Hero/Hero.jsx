import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

// Using the correct image path from markdown mapping
import heroBg from '../../../../../assets/Images/Home.jpg';

export default function Hero() {
  return (
    <section id="hero" className={styles.heroSection}>
      <div className={styles.background}>
        <img 
          src={heroBg} 
          alt="EECOHM School of Excellence Building" 
          className={styles.backgroundImage} 
        />
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.content}>
        <h1 className={`${styles.heading} ${styles.animateUp} ${styles.delay1}`}>
          EECOHM SCHOOL OF EXCELLENCE
        </h1>
        
        <h4 className={`${styles.subheading} ${styles.animateUp} ${styles.delay2}`}>
          LEARN . GROW . INNOVATE
        </h4>
        
        <p className={`${styles.description} ${styles.animateUp} ${styles.delay3}`}>
          EECOHM School of Excellence is a top-tier educational establishment that provides 
          comprehensive education from Pre-school till High School Diploma. Our dynamic 
          environment fosters intellectual, artistic, and physical growth in students, 
          with an emphasis on academic excellence and skill-based education.
        </p>
        
        <div className={`${styles.ctaContainer} ${styles.animateUp} ${styles.delay4}`}>
          <Link to="/login" className={styles.loginBtn}>
            Log In
          </Link>
          <Link to="/signup" className={styles.signupBtn}>
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  );
}
