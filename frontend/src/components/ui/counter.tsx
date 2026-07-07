"use client";

import * as React from "react";
import { useInView, animate } from "framer-motion";

interface CounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

export function Counter({ value, decimals = 0, suffix = "", prefix = "" }: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  React.useEffect(() => {
    if (!isInView) return;

    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 2.0,
      ease: [0.16, 1, 0.3, 1], // Premium easeOutExpo curve
      onUpdate(current) {
        // Format with thousand separator and decimal configurations
        const formatted = current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        node.textContent = prefix + formatted + suffix;
      },
    });

    return () => controls.stop();
  }, [value, decimals, suffix, prefix, isInView]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}
