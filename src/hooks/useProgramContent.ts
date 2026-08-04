import { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/config";

const CACHE_PREFIX = "fpi_program_cms_";

// Caches the last successful response per slug for the browser session so
// repeat visits/navigations render the admin content immediately instead of
// flashing the hardcoded fallback image while the API call is in flight.
export function useProgramContent(slug: string) {
  const [cms, setCms] = useState<any>(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_PREFIX + slug);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE_URL}/program-content/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setCms(data);
        try {
          sessionStorage.setItem(CACHE_PREFIX + slug, JSON.stringify(data));
        } catch {
          // ignore storage errors (e.g. private browsing quota)
        }
      })
      .catch((err) => console.error(err));

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return cms;
}
