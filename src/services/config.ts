const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const API_BASE_URL = rawApiUrl.replace(/\/$/, "");
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

export function getAssetUrl(url?: string | null) {
  if (!url) {
    return "";
  }

  let resolved = url;

  if (url.startsWith("http://localhost:5000")) {
    resolved = url.replace("http://localhost:5000", API_ORIGIN);
  } else if (url.startsWith("/")) {
    resolved = `${API_ORIGIN}${url}`;
  }

  // Auto-optimize Cloudinary images: f_auto picks the smallest format the
  // requesting browser supports (WebP/AVIF instead of the original
  // JPEG/PNG), q_auto applies perceptual-quality-aware compression. This is
  // the single biggest lever for mobile load time -- it applies to every
  // image on the site through this one function, no per-page changes
  // needed. Only touches `image` resources, never raw PDFs/docs or audio.
  if (
    resolved.includes("res.cloudinary.com/") &&
    resolved.includes("/image/upload/") &&
    !resolved.includes("/image/upload/f_auto")
  ) {
    resolved = resolved.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
  }

  return resolved;
}

/**
 * Cloudinary's "raw" delivery (used for PDFs/docs) always sends
 * Content-Disposition: attachment and ignores on-the-fly transformations
 * like `fl_attachment` (appending it 404s), so we can't control the
 * filename or force an inline render by editing the Cloudinary URL. The
 * backend's /media/proxy route streams the file through our own server
 * instead, with headers we set ourselves.
 */
function buildProxyUrl(resolved: string, mode: "attachment" | "inline", filename?: string) {
  if (!resolved.includes("res.cloudinary.com/")) {
    return resolved;
  }

  const params = new URLSearchParams({ url: resolved, mode });
  if (filename) {
    params.set("filename", filename);
  }

  return `${API_BASE_URL}/media/proxy?${params.toString()}`;
}

/**
 * Forces a real, completed browser download with a proper filename,
 * instead of relying on the HTML `download` attribute -- which Chrome
 * does not honor reliably for cross-origin URLs and leaves behind an
 * "Unconfirmed ####.crdownload" file.
 */
export function getDownloadUrl(url?: string | null, filename?: string) {
  const resolved = getAssetUrl(url);
  if (!resolved) {
    return "";
  }

  return buildProxyUrl(resolved, "attachment", filename);
}

/**
 * Same file, but asks the browser to render it in place (e.g. inside an
 * <iframe> preview) instead of downloading it.
 */
export function getPreviewUrl(url?: string | null) {
  const resolved = getAssetUrl(url);
  if (!resolved) {
    return "";
  }

  return buildProxyUrl(resolved, "inline");
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
