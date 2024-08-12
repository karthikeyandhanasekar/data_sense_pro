/**
 * Creates an instance of Axios with default settings and security headers.
 *
 * @module axiosInstance
 */
import axios from "axios";
/**
 * Creates an instance of Axios with default settings and security headers.
 *
 * @param {string} [baseURL] - The base URL for the API requests.
 * @returns {AxiosInstance} - The created Axios instance.
 */
const instance = axios.create({
  /**
   * The base URL for the API requests.
   *
   * @type {string}
   */
  baseURL: process.env.REACT_APP_API_URL,
  /**
   * The default headers for the API requests.
   *
   * @type {object}
   */
  headers: {
    /**
     * The Content-Type header.
     *
     * @type {string}
     */
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    // Add other headers as needed
  },
});

/**
 * Adds a request interceptor to the Axios instance.
 *
 * The interceptor adds security headers to the request config.
 *
 * @param {object} config - The request config.
 * @returns {object} - The modified request config.
 */
instance.interceptors.request.use(
  (config) => {
    /**
     * Adds security headers to the request config.
     *
     * @param {object} config - The request config.
     */
    // config.headers["Content-Security-Policy"] = "default-src 'elf'"; // Content Security Policy header
    // config.headers["X-Content-Type-Options"] = "nosniff"; // X-Content-Type-Options header
    // config.headers["X-Frame-Options"] = "SAMEORIGIN"; // X-Frame-Options header
    // config.headers["X-XSS-Protection"] = "1; mode=block"; // X-XSS-Protection header
    // config.headers["Strict-Transport-Security"] =
    //   "max-age=31536000; includeSubDomains"; // Strict-Transport-Security header
    // config.headers["Referrer-Policy"] = "same-origin"; // Referrer-Policy header
    // config.headers["Feature-Policy"] =
    //   "geolocation 'elf'; microphone 'none'; camera 'none'"; // Feature-Policy header
    // config.headers["Cache-Control"] = "no-store"; // Cache-Control header

    // Return the modified request config
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

/**
 * Exports the created Axios instance.
 *
 * @example
 * import axiosInstance from './axiosInstance';
 *
 * axiosInstance.get('/users')
 *  .then(response => {
 *     console.log(response.data);
 *   })
 *  .catch(error => {
 *     console.error(error);
 *   });
 */
export default instance;
