import { useState, useEffect } from "react";

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isShortViewport: boolean;
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === "undefined") {
      return { isMobile: false, isTablet: false, isDesktop: true, isShortViewport: false };
    }
    const width = window.innerWidth;
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      isShortViewport: window.innerHeight < 680,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        isShortViewport: window.innerHeight < 680,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return state;
}
