import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { RESTServerRoute } from "@/lib/routes/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = config.headers.common && config.headers.common["Authorization"];
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to an expired token (status 401) and retry flag is not set
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axiosInstance.post(RESTServerRoute.REST_REFRESH);
        const newToken = refreshResponse.data.AccessToken;

        setAccessTokenHeaders(newToken);

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const setAccessTokenHeaders = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log('header is set!')
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export const createFetcher = <T = unknown, B = undefined>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
) => {
  return async (body?: B, params?: Record<string, string>): Promise<T> => {
    // Ensure params are provided when needed
    if (path.includes(":") && (!params || Object.keys(params).length === 0)) {
      throw new Error(`Missing required params for path: ${path}`);
    }

    // Replace path placeholders (e.g., preferences/:id -> preferences/123)
    const resolvedPath = path.replace(/:(\w+)/g, (_, key) => {
      if (!params?.[key]) {
        throw new Error(`Missing required param: ${key}`);
      }
      return params[key];
    });

    const config = {
      method,
      url: resolvedPath,
      ...(body && method !== "GET" ? { data: body } : {}), // Ensure body is only sent with non-GET requests
    };

    const response = await axiosInstance<T>(config);
    return response.data;
  };
};
