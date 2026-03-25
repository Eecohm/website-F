import { useState, useEffect } from 'react';
import { testimonialsData } from '../../../data/testimonialsData';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentTestimonial = testimonialsData[currentIndex];
  
  return (
    <section id="testimonials" className={styles.testimonialsSection}>
      <h2 className={styles.heading}>What People Say</h2>
      
      <div className={styles.sliderContainer}>
        <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevSlide} aria-label="Previous">
          &lt;
        </button>
        
        <div key={currentIndex} className={styles.card}>
          <div className={styles.imageContainer}>
            <img src={currentTestimonial.image} alt={currentTestimonial.name} />
          </div>
          <div className={styles.stars}>
            {'★'.repeat(currentTestimonial.stars)}{'☆'.repeat(5 - currentTestimonial.stars)}
          </div>
          <p className={styles.review}>{currentTestimonial.review}</p>
          <div className={styles.author}>
            <h4 className={styles.name}>{currentTestimonial.name}</h4>
            <span className={styles.role}>{currentTestimonial.role}</span>
          </div>
        </div>
        
        <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextSlide} aria-label="Next">
          &gt;
        </button>
      </div>

      <div className={styles.dots}>
        {testimonialsData.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
