import { useRef } from 'react';
import CourseCard from './CourseCard';
import { coursesData } from '../../../data/coursesData';
import styles from './Courses.module.css';

export default function Courses() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350; // Approximated card width + gap
      const currentScroll = scrollRef.current.scrollLeft;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="programs" className={styles.coursesSection}>
      <div className={styles.header}>
        <h2 className={styles.heading}>OUR COURSES</h2>
        <div className={styles.controls}>
          <button className={styles.scrollBtn} onClick={() => scroll('left')} aria-label="Scroll left">
            &lt;
          </button>
          <button className={styles.scrollBtn} onClick={() => scroll('right')} aria-label="Scroll right">
            &gt;
          </button>
        </div>
      </div>

      <div className={styles.scrollContainer} ref={scrollRef}>
        <div className={styles.cardsTrack}>
          {coursesData.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
