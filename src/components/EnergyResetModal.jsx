import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function EnergyResetModal({ isOpen, onClose, user }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    currentFeeling: "",
    impulse: "",
    oppositeFrequency: "",
    affirmation: "",
    evidence: ["", "", ""]
  });

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0] || null;
    },
    enabled: !!user?.email,
  });

  const handleClose = () => {
    setStep(0);
    setFormData({
      currentFeeling: "",
      impulse: "",
      oppositeFrequency: "",
      affirmation: "",
      evidence: ["", "", ""]
    });
    onClose();
  };

  const updateEvidence = (index, value) => {
    const newEvidence = [...formData.evidence];
    newEvidence[index] = value;
    setFormData((prev) => ({ ...prev, evidence: newEvidence }));
  };

  const firstName = profile?.preferred_name || user?.full_name?.split(' ')[0] || 'friend';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="max-w-2xl w-full bg-[#F5EFE7] rounded-3xl shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-[#5C4A3A]/60 hover:text-[#5C4A3A] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-8">
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-center"
              >
                <Sparkles className="w-12 h-12 text-[#D4AF77] mx-auto" />
                <h2 className="text-3xl font-semibold text-[#5C4A3A] accent-font">
                  State Shift
                </h2>
                <p className="text-[#5C4A3A]/70 text-lg leading-relaxed">
                  This practice helps you quickly identify and transmute emotional blocks, so you can return to your aligned state.
                </p>
                <div className="bg-[#D4AF77]/10 rounded-xl p-6 space-y-3">
                  <p className="text-[#5C4A3A] font-medium">Before we begin:</p>
                  <p className="text-[#5C4A3A]/80">Take a few deep breaths. Feel your body relax. Let yourself be present.</p>
                </div>
                <Button
                  onClick={() => setStep(1)}
                  className="bg-[#D4AF77] hover:bg-[#C49F67] text-white px-8 py-6 text-lg rounded-xl"
                >
                  Begin <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4 bg-gradient-to-br from-[#D4AF77]/20 to-[#E8D5C4]/40 rounded-2xl p-8 border-2 border-[#D4AF77]/30">
                  <h2 className="text-3xl font-bold text-[#5C4A3A] accent-font">
                    Instant Calm
                  </h2>
                  <div className="space-y-6 mt-6">
                    <p className="text-2xl text-[#5C4A3A] font-medium">
                      Breathe in...
                    </p>
                    <p className="text-xl text-[#5C4A3A]/70">
                      Hold 4 seconds...
                    </p>
                    <p className="text-2xl text-[#5C4A3A] font-medium">
                      Exhale slowly...
                    </p>
                  </div>
                  <p className="text-sm text-[#5C4A3A]/60 mt-8 italic">
                    Complete 3 breath cycles
                  </p>
                </div>
                <Button
                  onClick={() => setStep(2)}
                  className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white rounded-xl py-6"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font">
                  State Recognition
                </h2>
                <p className="text-[#5C4A3A]/70">
                  Name the Energy: What low-frequency emotion or physical sensation is active right now? Be detailed and honest.
                </p>
                <p className="text-sm text-[#5C4A3A]/60 italic">
                  e.g., tightness in chest, guilt, frantic energy
                </p>
                <Textarea
                  value={formData.currentFeeling}
                  onChange={(e) => setFormData((prev) => ({ ...prev, currentFeeling: e.target.value }))}
                  placeholder="I feel..."
                  className="min-h-[120px] bg-white border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
                />
                <Button
                  onClick={() => setStep(3)}
                  disabled={!formData.currentFeeling.trim()}
                  className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white rounded-xl py-6"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font">
                  Detachment & Observation
                </h2>
                <p className="text-[#5C4A3A]/70 mb-4">
                  I observe this feeling and choose not to identify with it. What impulse does this energy usually lead me to?
                </p>
                <p className="text-sm text-[#5C4A3A]/60 italic mb-4">
                  e.g., eat sugar, doom scroll, worry, avoid action, seek validation
                </p>
                <Textarea
                  value={formData.impulse}
                  onChange={(e) => setFormData((prev) => ({ ...prev, impulse: e.target.value }))}
                  placeholder="This energy usually leads me to..."
                  className="min-h-[100px] bg-white border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
                />
                <div className="bg-[#E8D5C4]/30 rounded-xl p-4 mt-4">
                  <p className="text-[#5C4A3A] font-medium text-center">
                    I choose to let it pass away now.
                  </p>
                </div>
                <Button
                  onClick={() => setStep(4)}
                  disabled={!formData.impulse.trim()}
                  className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white rounded-xl py-6"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font">
                  Transmutation (Polarity Shift)
                </h2>
                <p className="text-[#5C4A3A]/70">
                  What is the emotional opposite of this state? This is the state I choose to embody now.
                </p>
                <p className="text-sm text-[#5C4A3A]/60 italic mb-4">
                  e.g., Fear → Courage, Chaos → Peace, Lack → Abundance
                </p>
                <Input
                  value={formData.oppositeFrequency}
                  onChange={(e) => setFormData((prev) => ({ ...prev, oppositeFrequency: e.target.value }))}
                  placeholder="The opposite frequency is..."
                  className="bg-white border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
                />
                <Button
                  onClick={() => setStep(5)}
                  disabled={!formData.oppositeFrequency.trim()}
                  className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white rounded-xl py-6"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font">
                  Design the Opposite Reality
                </h2>
                <p className="text-[#5C4A3A]/70">
                  Write the new truth as if it's already true. Use third person, present tense.
                </p>
                <p className="text-sm text-[#5C4A3A]/60 italic mb-4">
                  Example: "{firstName} is deeply confident and effortlessly aligned with abundance"
                </p>
                <Textarea
                  value={formData.affirmation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, affirmation: e.target.value }))}
                  placeholder={`${firstName} is...`}
                  className="min-h-[120px] bg-white border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
                />
                <Button
                  onClick={() => setStep(6)}
                  disabled={!formData.affirmation.trim()}
                  className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white rounded-xl py-6"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font">
                  Anchor with Proof
                </h2>
                <p className="text-[#5C4A3A]/70 mb-4">
                  List 1-3 recent pieces of evidence this new truth is already forming.
                </p>
                <p className="text-sm text-[#5C4A3A]/60 italic mb-4">
                  e.g., I stuck to my habit, I received unexpected money, I stayed calm during stress
                </p>
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <Input
                      key={i}
                      value={formData.evidence[i]}
                      onChange={(e) => updateEvidence(i, e.target.value)}
                      placeholder={i === 0 ? "Evidence #1 (Required)" : `Evidence #${i + 1} (Optional)`}
                      className="bg-white border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
                    />
                  ))}
                </div>
                <Button
                  onClick={() => setStep(7)}
                  disabled={!formData.evidence[0].trim()}
                  className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white rounded-xl py-6"
                >
                  Complete Reset <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 7 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                <Sparkles className="w-12 h-12 text-[#D4AF77] mx-auto" />
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font">
                    Energy reset complete ✨
                  </h2>
                  <div className="bg-[#D4AF77]/10 rounded-xl p-6">
                    <p className="text-[#5C4A3A] leading-relaxed italic">
                      "Through awareness, {firstName} transmutes limitation into power. I am the one in control."
                    </p>
                  </div>
                  <p className="text-[#5C4A3A]/70">
                    You are safe, guided, and back in flow.
                  </p>
                </div>
                <Button
                  onClick={handleClose}
                  className="bg-[#D4AF77] hover:bg-[#C49F67] text-white px-12 py-6 text-lg rounded-xl"
                >
                  Return
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}