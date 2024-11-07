import axios from 'axios';
import SessionManager from './SessionManager';

// Replace in the future if not using localhost URL for deployment/development
const BASE_URL = 'http://localhost:4000';

// Construct the baseURL 
const INTERCEPTOR_API = `${BASE_URL.replace(/\/+$/, '')}/api`;

const instance = axios.create({
    baseURL: INTERCEPTOR_API, // baseURL will be "http://localhost:4000/api"
});

instance.interceptors.request.use(
    (config) => {
        const session = SessionManager.getInstance();
        const token = session.getToken(); // retreive the token from SessionManager

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // handle request error
        return Promise.reject(error)
    }
);

export default instance;

// Example of how to use this Interceptor:
/*

import axiosInstance from '../utils/axiosInterceptor'; // Adjust the path as needed

// Example API call using the interceptor
axiosInstance.get('/protected-endpoint')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

*/