import React, { useState } from "react";
import { motion } from "framer-motion";
import { Waves } from "lucide-react";
import EnergyResetModal from "./EnergyResetModal";

export default function EnergyResetOrb({ user }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setShowModal(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-[#D4AF77] to-[#C49F67] rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 transition-transform duration-300"
        style={{
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
        }}
      >
        <Waves className="w-8 h-8 text-white" />
      </motion.button>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(212, 175, 119, 0.7);
          }
          50% {
            opacity: .9;
            box-shadow: 0 0 0 10px rgba(212, 175, 119, 0);
          }
        }
      `}</style>

      <EnergyResetModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        user={user}
      />
    </>
  );
}