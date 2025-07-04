import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { authenticatedAxios } from "@/lib/auth-axios";
import { RESTServerRoute } from "@/lib/routes/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createFetcher = <T = unknown, B = undefined>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
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

    const response = await authenticatedAxios<{ data: T }>(config);
    return response.data.data;
  };
};

export const createPaginatedFetcher = <T = unknown>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
) => {
  return async (queryParams?: Record<string, string | number>): Promise<T> => {
    const config = {
      method,
      url: path,
      params: queryParams,
    };

    const response = await authenticatedAxios<{data: T}>(config);
    return response.data.data;
  };
};

export const sendImage = async (
  profileId: number,
  formData: FormData,
  index?: number,
) => {
  if (index) {
    // PUT request for updating existing image
    const path = RESTServerRoute.REST_PROFILE_IMAGE.replace(
      ":profileId",
      profileId.toString(),
    ).replace(":index", index.toString());
    return authenticatedAxios.put(path, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    // POST request for adding new image
    const path = RESTServerRoute.REST_PROFILE_IMAGES.replace(
      ":profileId",
      profileId.toString(),
    );
    return authenticatedAxios.post(path, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
};

export const removeImage = async ({
  profileId,
  index,
}: {
  profileId: number;
  index: number;
}) => {
  const path = RESTServerRoute.REST_PROFILE_IMAGE.replace(
    ":profileId",
    profileId.toString(),
  ).replace(":index", index.toString());
  return authenticatedAxios.delete(path);
};

export const capitalizeFirstLetter = (name: string): string => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
};
