"use client";

import * as React from "react";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
      className="h-full w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
