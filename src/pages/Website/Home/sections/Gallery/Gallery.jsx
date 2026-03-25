import { useState } from 'react';
import styles from './Gallery.module.css';

// Using actual image paths as verified in markdown
import img1 from '../../../../../assets/Images/IMG_2363.JPG';
import img2 from '../../../../../assets/Images/IMG_2426 (1).JPG';
import img3 from '../../../../../assets/Images/IMG_7702.JPG';
import img4 from '../../../../../assets/Images/IMG_7709.JPG';
import img5 from '../../../../../assets/Images/IMG_7718.JPG';
import img6 from '../../../../../assets/Images/IMG_8024.JPG';
import img7 from '../../../../../assets/Images/IMG_8025.JPG';
import img8 from '../../../../../assets/Images/IMG_8026.JPG';

export default function Gallery() {
  const images = [img1, img2, img3, img4, img5, img6, img7, img8];
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  const nextImage = (e) => {
    e.stopPropagation();
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  return (
    <section id="gallery" className={styles.gallerySection}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Our Gallery</h2>
        <p className={styles.subheading}>Glimpses of life at EECOHM School of Excellence</p>
      </div>

      <div className={styles.grid}>
        {images.map((imgSrc, index) => (
          <div 
            key={index} 
            className={styles.galleryItem}
            onClick={() => openModal(index)}
          >
            <img src={imgSrc} alt={`Gallery ${index + 1}`} className={styles.galleryImage} />
            <div className={styles.overlay}>
              <span style={{ color: 'white', fontSize: '2rem' }}>⤢</span>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <button className={styles.closeBtn} onClick={closeModal}>✕</button>
          <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevImage}>&lt;</button>
          
          <img src={selectedImage} alt="Enlarged gallery view" className={styles.modalImage} onClick={(e) => e.stopPropagation()} />
          
          <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextImage}>&gt;</button>
        </div>
      )}
    </section>
  );
}
