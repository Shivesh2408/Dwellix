"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PageLoader() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Premium loading experience: hide loader after DOM assets and font load settles
    const handleLoad = () => setLoading(false);
    
    if (document.readyState === "complete") {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Spinning load track */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="h-10 w-10 border-3 border-slate-100 border-t-primary rounded-full"
            />
            {/* Typographic brand indicator */}
            <div className="flex items-center gap-1.5 font-heading font-extrabold text-sm text-foreground tracking-tight">
              <span className="w-5 h-5 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-[10px] shadow-sm">
                D
              </span>
              <span>Dwellix</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
