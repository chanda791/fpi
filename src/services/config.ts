const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const API_BASE_URL = rawApiUrl.replace(/\/$/, "");
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

export function getAssetUrl(url?: string | null) {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://localhost:5000")) {
    return url.replace("http://localhost:5000", API_ORIGIN);
  }

  if (url.startsWith("/")) {
    return `${API_ORIGIN}${url}`;
  }

  return url;
}

export function installApiFetchInterceptor() {
  const originalFetch = window.fetch.bind(window);

  const handleExpiredSession = () => {
    localStorage.removeItem("fpi_admin_token");
    localStorage.removeItem("fpi_admin_user");
    sessionStorage.removeItem("fpi_admin_token");
    sessionStorage.removeItem("fpi_admin_user");

    if (!window.location.pathname.startsWith("/admin/login")) {
      window.location.href = "/admin/login?expired=1";
    }
  };

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    let nextInput = input;

    if (typeof input === "string") {
      nextInput = input.replace("http://localhost:5000/api", API_BASE_URL);
      nextInput = nextInput.replace("http://localhost:5000", API_ORIGIN);
    }

    const targetUrl = typeof nextInput === "string" ? nextInput : nextInput.toString();
    const method = (init?.method || "GET").toUpperCase();
    const isApiRequest =
      targetUrl.startsWith(API_BASE_URL) ||
      targetUrl.startsWith("/api") ||
      targetUrl.includes("/api/");
    const isMutation = !["GET", "HEAD", "OPTIONS"].includes(method);

    let response: Response;

    if (isApiRequest && isMutation) {
      const token = localStorage.getItem("fpi_admin_token") || sessionStorage.getItem("fpi_admin_token");

      if (token) {
        const headers = new Headers(init?.headers);
        headers.set("Authorization", `Bearer ${token}`);

        response = await originalFetch(nextInput, {
          ...init,
          headers,
        });
      } else {
        response = await originalFetch(nextInput, init);
      }
    } else {
      response = await originalFetch(nextInput, init);
    }

    if (isApiRequest && response.status === 401) {
      handleExpiredSession();
    }

    return response;
  };
}
