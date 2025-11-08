import { useNavigate, useLocation } from 'react-router';
import { formatErrorMessage, getErrorTitle, isRetryableError } from '../../utils/errorHandler';
import styles from './AppError.module.css';

const AppError = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const error = location.state?.error || {};
  
  const title = getErrorTitle(error);
  const message = formatErrorMessage(error);
  const canRetry = isRetryableError(error);
  const showDetails = import.meta.env.DEV;

  const handleRetry = () => {
    // Go back and retry
    navigate(-1);
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusBadgeClass = () => {
    if (error.statusCode === 0 || error.code === 'ERR_NETWORK') {
      return 'network';
    }
    if (error.statusCode >= 500) {
      return 'server';
    }
    return 'client';
  };

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>
        {error.statusCode === 404 ? '🔍' : error.statusCode === 0 ? '📡' : '⚠️'}
      </div>

      {error.statusCode && (
        <div className={`${styles.statusBadge} ${styles[getStatusBadgeClass()]}`}>
          {error.statusCode === 0 ? 'Network Error' : `Error ${error.statusCode}`}
        </div>
      )}

      <h1 className={styles.errorTitle}>{title}</h1>
      
      <p className={styles.errorMessage}>{message}</p>

      {error.endpoint && showDetails && (
        <details className={styles.errorDetails}>
          <summary>Technical Details</summary>
          <pre>
            {JSON.stringify({
              endpoint: error.endpoint,
              statusCode: error.statusCode,
              message: error.message,
              timestamp: error.timestamp,
              code: error.code
            }, null, 2)}
          </pre>
        </details>
      )}

      <div className={styles.buttonGroup}>
        {canRetry && (
          <button 
            className={`${styles.primaryButton} ${styles.retryButton}`}
            onClick={handleRetry}
          >
            <span>🔄</span>
            Retry
          </button>
        )}
        
        <button 
          className={styles.primaryButton}
          onClick={handleGoHome}
        >
          <span>🏠</span>
          Go to Home
        </button>
        
        <button 
          className={styles.secondaryButton}
          onClick={handleGoBack}
        >
          <span>←</span>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default AppError;
