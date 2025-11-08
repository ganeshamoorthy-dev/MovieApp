import axios from 'axios';
import { APIError, logError } from '../utils/errorHandler';

class Interceptor {
  static API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMWE2NmIwNTFkMGI0OWIwZjZjNjhiNDczOWFlNDkzNyIsIm5iZiI6MTczNzAxNjc5Ny45MDYsInN1YiI6IjY3ODhjNWRkMDY4MDlhYjIzNmFkMWM4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2PVt2SbpA7l3qPLU20YS4aOxJiRNBNFxq4BsyfqQvvs'; // Replace with your actual API key

  static getAxiosInstance() {
    const instance = axios.create({
      headers: {
        Authorization: `Bearer ${this.API_KEY}`
      },
      timeout: 10000 // 10 second timeout
    });
    Interceptor.initializeInterceptor(instance);
    return instance;
  }

  static initializeInterceptor(instance){

    //Request interceptors
    instance.interceptors.request.use(
      (req) => {
        console.log("Request send to " + req.url);
        return req;
      },
      (err) => {
        console.error("Request Error:", err);
        return Promise.reject(err);
      }
    );

    //Response interceptors
    instance.interceptors.response.use(
      (res) => {
        console.log("Response Received From " + res.config.url);
        return res;
      },
      (err) => {
        // Handle different error scenarios
        let apiError;

        if (err.response) {
          // Server responded with error status
          const { status, data, config } = err.response;
          const message = data?.status_message || data?.message || 'API request failed';
          
          apiError = new APIError(
            message,
            status,
            config.url,
            err
          );

          logError(apiError, {
            endpoint: config.url,
            method: config.method,
            params: config.params,
            responseData: data
          });

        } else if (err.request) {
          // Request made but no response received
          apiError = new APIError(
            'No response from server. Please check your internet connection.',
            0,
            err.config?.url || 'Unknown',
            err
          );

          logError(apiError, {
            endpoint: err.config?.url,
            errorCode: err.code,
            message: 'No response received'
          });

        } else {
          // Error setting up the request
          apiError = new APIError(
            err.message || 'Failed to setup API request',
            0,
            'Unknown',
            err
          );

          logError(apiError, {
            message: 'Request setup failed'
          });
        }

        return Promise.reject(apiError);
      }
    );
  }
}

export default Interceptor;
