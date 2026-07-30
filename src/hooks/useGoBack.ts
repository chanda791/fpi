import { useNavigate } from "react-router-dom";

/**
 * Returns to the previous page when there's real browser history to go back
 * to; otherwise falls back to a known route. Guards against a visitor who
 * landed directly on a detail page (shared link, new tab) being sent
 * "back" to nothing.
 */
export function useGoBack(fallback: string = "/") {
  const navigate = useNavigate();

  return () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };
}
