import { useState, useCallback } from 'react';

/**
 * Custom hook to manage loading states
 * 
 * @returns {object} { loading, startLoading, stopLoading, withLoading }
 */
export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  /**
   * Wraps an async function with loading state management
   * @param {Function} asyncFn - Async function to execute
   * @returns {Promise} Result of the async function
   */
  const withLoading = useCallback(async (asyncFn) => {
    try {
      startLoading();
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading
  };
};
