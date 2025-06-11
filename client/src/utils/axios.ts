import axios, { AxiosInstance } from "axios";

// create a axios AxiosInstance 
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
  withCredentials: true,
});

export default axiosInstance;
