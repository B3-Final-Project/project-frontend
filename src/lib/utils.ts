import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL || "http://localhost:8080/api",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

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
