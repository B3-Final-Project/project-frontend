import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { User } from "oidc-client-ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to extract token from sessionStorage
const getTokenFromSession = (): string | null => {
  const oidcStorageKey = `oidc.user:${process.env.NEXT_PUBLIC_COGNITO_USER_POOL}:${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}`;
  const userJson = sessionStorage.getItem(oidcStorageKey);

  if (userJson) {
    const user: User = JSON.parse(userJson);
    return user?.access_token || null;
  }

  return null;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenFromSession();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(new Error(error))
);

// This function is now redundant but can be kept for manual overrides if necessary.
export const setAccessTokenHeaders = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export const createFetcher = <T = unknown, B = undefined>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
) => {
  return async (body?: B, params?: Record<string, string>): Promise<T> => {
    if (path.includes(":") && (!params || Object.keys(params).length === 0)) {
      throw new Error(`Missing required params for path: ${path}`);
    }

    const resolvedPath = path.replace(/:(\w+)/g, (_, key) => {
      if (!params?.[key]) {
        throw new Error(`Missing required param: ${key}`);
      }
      return params[key];
    });

    const config = {
      method,
      url: resolvedPath,
      ...(body && method !== "GET" ? { data: body } : {}),
    };

    const response = await axiosInstance<T>(config);
    return response.data;
  };
};
