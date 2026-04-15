// import { TokenService } from "@/src/utils/TokenService";
import axios, { type AxiosInstance, AxiosError, isAxiosError } from "axios";
// import { refreshToken } from "../services/auth/refreshToken";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/token";
import storage from "@/utils/storage";

const baseURL = process.env.EXPO_PUBLIC_API_URL;
const THREE_MINUTES = 3 * 60 * 1000;

export const httpClient: AxiosInstance = axios.create({
  baseURL,
  timeout: THREE_MINUTES
});

httpClient.interceptors.request.use(async (config) => {
  const token = await storage.get(ACCESS_TOKEN_KEY);

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// // refresh access token after expire
// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });

//   failedQueue = [];
// };

// const logAxiosError = (error: unknown) => {
//   if (!isAxiosError(error)) {
//     console.log("ERROR_MESSAGE:", "Unknown error");
//     return;
//   }

//   const statusCode = error.response?.status;
//   const errorCode = error.code;
//   const apiUrl = error.config?.url;
//   const method = error.config?.method?.toUpperCase();
//   const errorMessage = error.message;

//   console.log("ERROR_CODE:", errorCode);
//   console.log(
//     "ERROR_API:",
//     `${method ?? "UNKNOWN"} ${apiUrl ?? "UNKNOWN_URL"}`
//   );
//   console.log("ERROR_STATUS:", statusCode);
//   console.log("ERROR_MESSAGE:", errorMessage);
//   console.log("ERROR_RESPONSE_DATA:", error.response?.data);
// };

// httpClient.interceptors.response.use(
//   (response) => response,

//   async (error: AxiosError & { config: any }) => {
//     logAxiosError(error);
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then((token) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return httpClient(originalRequest);
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const { access, refresh } = await refreshToken();

//         await storage.set(ACCESS_TOKEN_KEY, access);
//         await storage.set(REFRESH_TOKEN_KEY, refresh);

//         httpClient.defaults.headers.common.Authorization = `Bearer ${access}`;
//         processQueue(null, access);

//         return httpClient(originalRequest);
//       } catch (err) {
//         const error = err as unknown as AxiosError;
//         processQueue(error, null);

//         // If refresh token fails with 401, logout and navigate to login
//         if (error?.response?.status === 401) {
//           await TokenService.logout();
//         }

//         return Promise.reject(error);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );
