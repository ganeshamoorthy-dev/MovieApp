import { useNavigate } from 'react-router';
import { useCallback } from 'react';

/**
 * Custom hook for handling errors in components
 * Provides utilities to handle and navigate to error page
 */
export const useErrorHandler = () => {
  const navigate = useNavigate();

  const handleError = useCallback((error) => {
    // Navigate to error page with error details
    navigate('/error', { 
      state: { error },
      replace: false 
    });
  }, [navigate]);

  const handleApiCall = useCallback(async (apiCall, onSuccess, onError, onFinally) => {
    try {
      const response = await apiCall();
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        handleError(error);
      }
      throw error;
    } finally {
      if (onFinally) {
        onFinally();
      }
    }
  }, [handleError]);

  return { handleError, handleApiCall };
};
