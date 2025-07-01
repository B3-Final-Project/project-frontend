import axios from "axios";
import { User } from "oidc-client-ts";

// Create axios instance for authenticated requests
const authenticatedAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to extract token from sessionStorage - more robust version
const getTokenFromSession = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    // Scan all sessionStorage keys for any oidc.user entry
    const keys = Object.keys(sessionStorage);
    for (const key of keys) {
      if (key.startsWith("oidc.user:")) {
        const userJson = sessionStorage.getItem(key);
        if (userJson) {
          const user: User = JSON.parse(userJson);
          if (user?.access_token) {
            return user.access_token;
          }
        }
      }
    }
  } catch (error) {
    console.warn("Failed to parse OIDC user data:", error);
  }

  return null;
};

// Request interceptor to add auth token - this runs on every request
authenticatedAxios.interceptors.request.use(
  (config) => {
    // Get fresh token on every request
    const token = getTokenFromSession();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) =>
    Promise.reject(error instanceof Error ? error : new Error(String(error))),
);

// Response interceptor to handle auth errors
authenticatedAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Authentication failed, user may need to log in again");
    }
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);

export { authenticatedAxios };
