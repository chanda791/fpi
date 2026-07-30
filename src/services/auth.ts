import { api } from "./api";

const TOKEN_KEY = "fpi_admin_token";
const USER_KEY = "fpi_admin_user";

export interface AuthUser {
  email: string;
  fullName: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  const rawUser =
    localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

  return rawUser ? JSON.parse(rawUser) : null;
}

function decodeTokenExpiry(token: string): number | null {
  try {
    const [, body] = token.split(".");
    if (!body) return null;

    const normalized = body.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );

    const payload = JSON.parse(json) as { exp?: number };
    return payload.exp ?? null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  const exp = decodeTokenExpiry(token);

  // A token with no readable expiry is treated as invalid rather than
  // assumed valid -- fails closed instead of open.
  if (!exp) {
    return false;
  }

  return exp > Math.floor(Date.now() / 1000);
}

export async function login(email: string, password: string, remember = true) {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  const storage = remember ? localStorage : sessionStorage;

  storage.setItem(TOKEN_KEY, response.token);
  storage.setItem(USER_KEY, JSON.stringify(response.user));

  return response.user;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function forgotPassword(email: string) {
  return api.post<{ message: string }>("/auth/forgot-password", { email });
}

export function resetPassword(token: string, password: string) {
  return api.post<{ message: string }>("/auth/reset-password", {
    token,
    password,
  });
}

export function changePassword(currentPassword: string, newPassword: string) {
  return api.put<{ message: string }>("/auth/change-password", {
    currentPassword,
    newPassword,
  });
}
