import PropTypes from 'prop-types';
import styles from './AppLoading.module.css';

/**
 * Reusable Loading Component
 * 
 * @param {string} size - 'small' | 'medium' | 'large' | 'xlarge'
 * @param {string} variant - 'spinner' | 'skeleton' | 'overlay'
 * @param {boolean} fullscreen - Center in viewport
 * @param {string} text - Optional loading text
 */
const AppLoading = ({ 
  size = 'medium', 
  variant = 'spinner', 
  fullscreen = false,
  text = '',
  skeletonCount = 3
}) => {
  
  if (variant === 'skeleton') {
    return (
      <div className={styles.container}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className={`${styles.skeleton} ${styles.skeletonCard}`} />
        ))}
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className={styles.overlay}>
        <div className={styles.overlayContent}>
          <div className={`${styles.spinner} ${styles[size]}`}></div>
          {text && <p className={styles.text}>{text}</p>}
        </div>
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={`${styles.container} ${fullscreen ? styles.fullscreen : ''}`}>
      <div className={`${styles.spinner} ${styles[size]}`}></div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

AppLoading.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  variant: PropTypes.oneOf(['spinner', 'skeleton', 'overlay']),
  fullscreen: PropTypes.bool,
  text: PropTypes.string,
  skeletonCount: PropTypes.number
};

export default AppLoading;
