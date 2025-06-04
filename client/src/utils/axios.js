import axios from "axios";

// Create an instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
  withCredentials: true, // important for sending cookies (auth tokens)
});

// Optional: Interceptor for errors or token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
