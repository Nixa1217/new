import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function QuizStep({ children, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="p-8 bg-[#F0EEE6]/80 backdrop-blur-sm border border-[#E8D5C4] shadow-lg rounded-2xl">
        {(title || subtitle) && (
          <div className="mb-6 space-y-2">
            {title && (
              <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[#5C4A3A]/60">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </Card>
    </motion.div>
  );
}