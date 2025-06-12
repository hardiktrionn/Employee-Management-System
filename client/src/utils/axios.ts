import axios, { AxiosInstance } from "axios";

/**
 * Function Name: axiosInstance
 *
 * Description:
 * The function creating a custom Axios instance.
 * you now use this axiosInstance and those settings will always apply. .
 *
 * Example Usage:
 * ```
 *  axiosInstance.get(endpoint);
 * ```
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_HOST,
  withCredentials: true,
});

export default axiosInstance;
