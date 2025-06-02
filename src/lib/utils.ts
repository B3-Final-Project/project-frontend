import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { authenticatedAxios } from "@/lib/auth-axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createFetcher = <T = unknown, B = undefined>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET"
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

    const response = await authenticatedAxios<T>(config);
    return response.data;
  };
};
