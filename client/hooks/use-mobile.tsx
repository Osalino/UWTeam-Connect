// Hook to detect whether the screen is a mobile size (under 768px)
import * as React from "react";

const MOBILE_BREAKPOINT = 768; // Tailwind's "md" breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    // Listen for screen width changes using a media query
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT); // Set initial value
    return () => mql.removeEventListener("change", onChange); // Cleanup on unmount
  }, []);

  return !!isMobile; // Convert undefined to false on first render
}
