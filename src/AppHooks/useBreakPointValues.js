import { useEffect, useState } from "react";

const DEFAULT_BREAKPOINTS = {
  base: 0,
  sm: 480,
  md: 768,
  lg: 992,
  xl: 1280,
  "2xl": 1536,
};

const useBreakpointValue = (values, breakpoints = DEFAULT_BREAKPOINTS) => {
  const getValue = () => {
    if (typeof window === "undefined") return values.base;

    const width = window.innerWidth;

    // Sort breakpoints by min width
    const entries = Object.entries(breakpoints).sort((a, b) => a[1] - b[1]);

    let current = values.base;

    for (const [key, minWidth] of entries) {
      if (width >= minWidth && key in values) {
        current = values[key];
      }
    }

    return current;
  };

  const [value, setValue] = useState(getValue);

  useEffect(() => {
    const onResize = () => setValue(getValue());

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return value;
};

export default useBreakpointValue;
