import { API_BASE_URL } from "./config";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {

  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> || {}),
  };

  const token = localStorage.getItem("fpi_admin_token") || sessionStorage.getItem("fpi_admin_token");

  if (!(options?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  if (response.status === 401) {
    localStorage.removeItem("fpi_admin_token");
    localStorage.removeItem("fpi_admin_user");
    sessionStorage.removeItem("fpi_admin_token");
    sessionStorage.removeItem("fpi_admin_user");

    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/admin/login")
    ) {
      window.location.href = "/admin/login?expired=1";
    }

    throw new Error("Your session has expired. Please sign in again.");
  }

  if (!response.ok) {
    const message = await response.text();

    throw new Error(message || `API Error ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

function buildQuery(params?: Record<string, any>) {

  if (!params) return "";

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      query.append(key, String(value));
    }

  });

  return query.toString()
    ? `?${query.toString()}`
    : "";

}

export const api = {

  get: <T>(
    url: string,
    params?: Record<string, any>
  ) =>
    request<T>(`${url}${buildQuery(params)}`),

  post: <T>(
    url: string,
    data: unknown
  ) =>
    request<T>(url, {
      method: "POST",
      body:
        data instanceof FormData
          ? data
          : JSON.stringify(data),
    }),

  put: <T>(
    url: string,
    data: unknown
  ) =>
    request<T>(url, {
      method: "PUT",
      body:
        data instanceof FormData
          ? data
          : JSON.stringify(data),
    }),

  patch: <T>(
    url: string,
    data: unknown
  ) =>
    request<T>(url, {
      method: "PATCH",
      body:
        data instanceof FormData
          ? data
          : JSON.stringify(data),
    }),

  delete: <T>(url: string) =>
    request<T>(url, {
      method: "DELETE",
    }),

};