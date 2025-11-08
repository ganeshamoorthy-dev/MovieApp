/**
 * Error Handler Utility
 * Provides centralized error handling and formatting for the application
 */

export class AppError extends Error {
  constructor(message, statusCode, originalError = null) {
    super(message);
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
    this.name = this.constructor.name;
  }
}

export class APIError extends AppError {
  constructor(message, statusCode, endpoint, originalError = null) {
    super(message, statusCode, originalError);
    this.endpoint = endpoint;
  }
}

/**
 * Formats error messages for user display
 */
export const formatErrorMessage = (error) => {
  if (error instanceof APIError) {
    switch (error.statusCode) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication failed. Please check your API credentials.';
      case 403:
        return 'Access denied. You don\'t have permission to access this resource.';
      case 404:
        return 'The requested content was not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  if (error.code === 'ERR_NETWORK') {
    return 'Network error. Please check your internet connection.';
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Gets user-friendly error title based on error type
 */
export const getErrorTitle = (error) => {
  if (error instanceof APIError) {
    switch (error.statusCode) {
      case 404:
        return 'Content Not Found';
      case 401:
      case 403:
        return 'Access Denied';
      case 429:
        return 'Too Many Requests';
      case 500:
      case 503:
        return 'Server Error';
      default:
        return 'Oops! Something Went Wrong';
    }
  }

  if (error.code === 'ERR_NETWORK') {
    return 'Network Error';
  }

  return 'Oops! Something Went Wrong';
};

/**
 * Determines if the error is retryable
 */
export const isRetryableError = (error) => {
  if (error instanceof APIError) {
    return [408, 429, 500, 502, 503, 504].includes(error.statusCode);
  }

  if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
    return true;
  }

  return false;
};

/**
 * Logs error for debugging (can be extended to send to logging service)
 */
export const logError = (error, context = {}) => {
  if (import.meta.env.DEV) {
    console.group('🔴 Error Details');
    console.error('Error:', error);
    console.error('Message:', error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Context:', context);
    console.error('Stack:', error.stack);
    console.groupEnd();
  }

  // In production, you could send this to a logging service like Sentry
  // Example: Sentry.captureException(error, { extra: context });
};
