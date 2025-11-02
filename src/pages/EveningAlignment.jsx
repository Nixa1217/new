
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check, Moon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import QuizStep from "../components/QuizStep";

export default function EveningAlignment() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    proof_of_shift: ["", "", ""],
    heaviness: "",
    core_emotion: "",
    tomorrow_frequency_line: "",
    tomorrow_actions: ["", "", ""],
    final_gratitude: "",
  });

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0] || null;
    },
    enabled: !!user,
  });

  // Delete existing reflection when quiz is opened
  useEffect(() => {
    const deleteExistingReflection = async () => {
      if (user) {
        const reflections = await base44.entities.DailyReflection.filter({ created_by: user.email });
        if (reflections.length > 0) {
          // Delete all existing daily reflections for this user
          for (const reflection of reflections) {
            await base44.entities.DailyReflection.delete(reflection.id);
          }
          queryClient.invalidateQueries(['dailyReflections']);
          queryClient.invalidateQueries(['latestDaily']);
        }
      }
    };
    deleteExistingReflection();
  }, [user]);

  const createReflection = useMutation({
    mutationFn: (data) => base44.entities.DailyReflection.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['dailyReflections']);
      queryClient.invalidateQueries(['latestDaily']);
      navigate(createPageUrl("Compass"));
    },
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateProofOfShift = (index, value) => {
    const newProofs = [...formData.proof_of_shift];
    newProofs[index] = value;
    updateFormData("proof_of_shift", newProofs);
  };

  const updateTomorrowAction = (index, value) => {
    const newActions = [...formData.tomorrow_actions];
    newActions[index] = value;
    updateFormData("tomorrow_actions", newActions);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    createReflection.mutate(formData);
  };

  const firstName = profile?.preferred_name || 'friend';

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <QuizStep>
            <div className="space-y-6 text-center">
              <Moon className="w-16 h-16 text-[#D4AF77] mx-auto" />
              <h2 className="text-4xl font-semibold text-[#5C4A3A] accent-font">
                Hey {firstName}
              </h2>
              <p className="text-[#5C4A3A]/70 text-lg leading-relaxed">
                Let's gently close today's chapter and set your frequency for tomorrow.
              </p>
            </div>
          </QuizStep>
        );

      case 1:
        return (
          <QuizStep title="Subconscious Priming (Relaxation Gate)">
            <div className="space-y-6">
              <p className="text-[#5C4A3A]/70">
                Pause for 30-60 seconds and perform 4-count breathing (4 seconds in, 5 seconds out). Do nothing else. Allow your mind to clear and let the day's activity fall away.
              </p>
              <div className="bg-[#D4AF77]/10 rounded-xl p-6 text-center space-y-3">
                <p className="text-2xl text-[#5C4A3A] font-semibold accent-font">
                  Be still and know.
                </p>
                <p className="text-sm text-[#5C4A3A]/60">
                  Breathe in for 4 seconds... Hold... Breathe out for 5 seconds... Repeat until calm.
                </p>
              </div>
            </div>
          </QuizStep>
        );

      case 2:
        return (
          <QuizStep title="Gratitude & Wholeness (The BEING State)">
            <div className="space-y-5">
              <p className="text-[#5C4A3A]/70 mb-4">
                List three moments today that made you feel peaceful, abundant, or powerful. What small wins or pieces of evidence prove that your desired reality is already forming?
              </p>
              <div>
                <Input
                  value={formData.proof_of_shift[0]}
                  onChange={(e) => updateProofOfShift(0, e.target.value)}
                  placeholder="Proof #1"
                  className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
                />
              </div>
              <div>
                <Input
                  value={formData.proof_of_shift[1]}
                  onChange={(e) => updateProofOfShift(1, e.target.value)}
                  placeholder="Proof #2"
                  className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
                />
              </div>
              <div>
                <Input
                  value={formData.proof_of_shift[2]}
                  onChange={(e) => updateProofOfShift(2, e.target.value)}
                  placeholder="Proof #3"
                  className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
                />
              </div>
            </div>
          </QuizStep>
        );

      case 3:
        return (
          <QuizStep title="Transmutation & Release (Revision/Surrender)">
            <div className="space-y-4">
              <p className="text-[#5C4A3A]/70">
                What felt heavy, chaotic, or out of alignment today?
              </p>
              <Textarea
                value={formData.heaviness}
                onChange={(e) => updateFormData("heaviness", e.target.value)}
                placeholder="Describe what felt heavy or chaotic..."
                className="min-h-[100px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
              />
              <p className="text-[#5C4A3A]/70">
                What is the core emotion (e.g., fear, shame, worry) beneath that heaviness?
              </p>
              <Input
                value={formData.core_emotion}
                onChange={(e) => updateFormData("core_emotion", e.target.value)}
                placeholder="The core emotion is..."
                className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
              />
              <p className="text-sm text-[#5C4A3A]/60 italic mt-4">
                Choose to let go of this resistance now, knowing that what you resist persists.
              </p>
            </div>
          </QuizStep>
        );

      case 4:
        return (
          <QuizStep title="Tomorrow's Frequency Setting (The DOING Action)">
            <div className="space-y-4">
              <p className="text-[#5C4A3A]/70">
                Based on your Core Identity, define one simple sentence or emotional line you will saturate your mind with tomorrow.
              </p>
              <p className="text-sm text-[#5C4A3A]/60 mb-4">
                Examples: "Making money is easy" • "I am serene and confident" • "Everything works in my favor"
              </p>
              <Input
                value={formData.tomorrow_frequency_line}
                onChange={(e) => updateFormData("tomorrow_frequency_line", e.target.value)}
                placeholder="Tomorrow I saturate my mind with..."
                className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
              />
              <p className="text-xs text-[#5C4A3A]/50 mt-2 italic">
                This must be the feeling/thought you carry throughout the day.
              </p>
            </div>
          </QuizStep>
        );

      case 5:
        return (
          <QuizStep title="Tomorrow's Non-Negotiable Actions">
            <div className="space-y-5">
              <p className="text-[#5C4A3A]/70 mb-4">
                List 3 non-negotiable actions you will take tomorrow that align with your desired reality.
              </p>
              <div>
                <Input
                  value={formData.tomorrow_actions[0]}
                  onChange={(e) => updateTomorrowAction(0, e.target.value)}
                  placeholder="Action #1"
                  className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
                />
              </div>
              <div>
                <Input
                  value={formData.tomorrow_actions[1]}
                  onChange={(e) => updateTomorrowAction(1, e.target.value)}
                  placeholder="Action #2"
                  className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
                />
              </div>
              <div>
                <Input
                  value={formData.tomorrow_actions[2]}
                  onChange={(e) => updateTomorrowAction(2, e.target.value)}
                  placeholder="Action #3"
                  className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
                />
              </div>
            </div>
          </QuizStep>
        );

      case 6:
        return (
          <QuizStep title="Subconscious Anchoring (Finalization)">
            <div className="space-y-4">
              <p className="text-[#5C4A3A]/70">
                State your deepest gratitude for something that has not yet materialized, feeling that it is already true (living in the end).
              </p>
              <Textarea
                value={formData.final_gratitude}
                onChange={(e) => updateFormData("final_gratitude", e.target.value)}
                placeholder="I am deeply grateful for..."
                className="min-h-[120px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
              />
              <div className="bg-[#D4AF77]/10 rounded-xl p-6 mt-6">
                <p className="text-[#5C4A3A] text-center leading-relaxed italic font-medium">
                  "I sleep in peace, for what I have chosen today is now fact. I am the creator."
                </p>
              </div>
            </div>
          </QuizStep>
        );

      case 7:
        return (
          <QuizStep title="Subconscious Reprogramming (I AM Embodiment)">
            <p className="text-[#5C4A3A]/70 mb-4">
              Read your personalized Core Identity statement now. This is your final conditioning act — speak it, feel it, BE it.
            </p>
            <div className="space-y-4 p-6 bg-[#D4AF77]/10 rounded-xl border border-[#E8D5C4]">
              {profile ? (
                <>
                  {profile.identity_summary && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#5C4A3A]/70 uppercase tracking-wider">Your Core Identity</p>
                      <p className="text-2xl font-bold text-[#5C4A3A] leading-relaxed accent-font">
                        {profile.identity_summary}
                      </p>
                    </div>
                  )}
                  {profile.life_purpose_summary && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#5C4A3A]/70 uppercase tracking-wider">Life Purpose</p>
                      <p className="text-xl font-semibold text-[#5C4A3A] leading-relaxed">
                        {profile.life_purpose_summary}
                      </p>
                    </div>
                  )}
                  <div className="pt-3 border-t border-[#E8D5C4]">
                    <p className="text-lg font-bold text-[#D4AF77] leading-relaxed italic">
                      I am the creator of my reality.
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-[#5C4A3A]/60 italic text-center py-6">
                  You haven't set your Core Identity yet. Complete it first to unlock your personalized affirmations.
                </p>
              )}
            </div>
            <p className="text-sm text-[#5C4A3A]/60 mt-4 text-center italic">
              Speak these words aloud or read them silently with full conviction.
            </p>
          </QuizStep>
        );

      case 8:
        return (
          <QuizStep>
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF77] to-[#C49F67] rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-[#5C4A3A] accent-font">
                Another day closer to full embodiment, {firstName}
              </h2>
              <p className="text-[#5C4A3A]/70 text-lg">
                Rest. Allow. Receive.
              </p>
            </div>
          </QuizStep>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE7] p-6">
      <div className="max-w-2xl mx-auto pt-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate(createPageUrl("Compass"))}
            variant="ghost"
            className="text-[#5C4A3A]/60 hover:text-[#5C4A3A] hover:bg-[#F0EEE6]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="text-sm text-[#5C4A3A]/50">
            Step {step + 1} of 9
          </div>
        </div>

        {/* Quiz Steps */}
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-4">
          {step > 0 && step < 8 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 py-6 text-lg rounded-xl border-[#E8D5C4] text-[#5C4A3A] hover:bg-[#F0EEE6]"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          )}
          {step < 8 && (
            <Button
              onClick={step === 7 ? handleSubmit : handleNext}
              className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              disabled={createReflection.isPending}
            >
              {step === 7 ? "Complete" : "Continue"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
          {step === 8 && (
            <Button
              onClick={() => navigate(createPageUrl("Compass"))}
              className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
            >
              Return to Compass
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
