import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Deferred one frame so this always runs after any same-tick DOM/layout
    // work from route change (e.g. the mobile nav releasing its scroll
    // lock) -- calling scrollTo while something else still has scroll
    // locked gets silently ignored on most mobile browsers.
    const frame = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
};

export default ScrollToTop;