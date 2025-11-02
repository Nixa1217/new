import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Sun, Sparkles, CheckCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import QuizStep from "../components/QuizStep";

export default function MorningEmbodiment() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    surrender_check: "",
    frequency_dial: "",
    non_negotiable_action: "",
    transmutation_anchor: "",
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

  const { data: yesterdayReflection } = useQuery({
    queryKey: ['yesterdayDaily', user?.email],
    queryFn: async () => {
      const reflections = await base44.entities.DailyReflection.filter({ created_by: user?.email }, '-date', 1);
      return reflections[0] || null;
    },
    enabled: !!user,
  });

  const createMorningReflection = useMutation({
    mutationFn: (data) => base44.entities.MorningReflection.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['morningReflections']);
      navigate(createPageUrl("Compass"));
    },
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 9) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    createMorningReflection.mutate(formData);
  };

  const firstName = profile?.preferred_name || 'friend';

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <QuizStep>
            <div className="space-y-6 text-center">
              <Sun className="w-16 h-16 text-[#D4AF77] mx-auto" />
              <h2 className="text-4xl font-semibold text-[#5C4A3A] accent-font">
                Good morning, {firstName}
              </h2>
              <p className="text-[#5C4A3A]/70 text-lg leading-relaxed">
                Let's set your frequency before the external world influences you. Your next 5-10 minutes will program the entire day.
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
          <QuizStep title="Yesterday's Commitments">
            {yesterdayReflection?.tomorrow_actions?.filter(a => a).length > 0 ? (
              <div className="space-y-4">
                <p className="text-[#5C4A3A]/70">
                  Last night, you committed to these actions for today:
                </p>
                <div className="bg-[#D4AF77]/10 rounded-xl p-6 space-y-3">
                  {yesterdayReflection.tomorrow_actions.filter(a => a).map((action, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF77] mt-0.5 flex-shrink-0" />
                      <p className="text-[#5C4A3A] text-lg">{action}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[#5C4A3A]/60 italic text-center">
                  Keep these in mind as you set today's frequency.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#5C4A3A]/60">
                  No actions were set yesterday. Let's focus on today.
                </p>
              </div>
            )}
          </QuizStep>
        );

      case 3:
        return (
          <QuizStep title="Present Moment Restoration (Surrender)">
            <p className="text-[#5C4A3A]/70 mb-4">
              Consciously surrender past judgments and future anxieties. All your power is in the NOW.
            </p>
            <Textarea
              value={formData.surrender_check}
              onChange={(e) => updateFormData("surrender_check", e.target.value)}
              placeholder="What judgments (past) or anxieties (future) am I choosing to let go of right now to restore all my power to the present moment?"
              className="min-h-[140px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 4:
        return (
          <QuizStep title="Identity & Frequency Setting (BEING)">
            <p className="text-[#5C4A3A]/70 mb-4">
              Choose your desired energetic frequency. Root yourself in the feeling that your desired reality is ALREADY true.
            </p>
            <Textarea
              value={formData.frequency_dial}
              onChange={(e) => updateFormData("frequency_dial", e.target.value)}
              placeholder="How do I choose to feel today (e.g., Love, Gratitude, Abundance, Peace) and what specific feeling signifies that my desired reality is already true or already received?"
              className="min-h-[140px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
            <p className="text-xs text-[#5C4A3A]/50 mt-2 italic">
              Focus on elevated states. Be the person, don't become the person.
            </p>
          </QuizStep>
        );

      case 5:
        return (
          <QuizStep title="Action Alignment (DOING)">
            <p className="text-[#5C4A3A]/70 mb-4">
              Define your non-negotiable aligned action. This translates your frequency into 3D reality. Remember: "We don't rise to our expectations, we fall to our preparation."
            </p>
            <Textarea
              value={formData.non_negotiable_action}
              onChange={(e) => updateFormData("non_negotiable_action", e.target.value)}
              placeholder="What is my primary focus, and what non-negotiable action (input) will I take today that is fully aligned with my chosen frequency?"
              className="min-h-[140px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 6:
        return (
          <QuizStep title="Transmutation & Proof (EVIDENCE)">
            <p className="text-[#5C4A3A]/70 mb-4">
              Find proof of your identity shift OR reframe a negative event into a positive lesson. Build your undeniable stack of evidence.
            </p>
            <Textarea
              value={formData.transmutation_anchor}
              onChange={(e) => updateFormData("transmutation_anchor", e.target.value)}
              placeholder="Name one small win or piece of evidence from the last 24 hours that proves my identity is shifting, OR state one perceived negative experience that served my growth."
              className="min-h-[140px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
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
                        I am {profile.identity_summary}
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
              <Sparkles className="w-16 h-16 text-[#D4AF77] mx-auto" />
              <h2 className="text-3xl font-semibold text-[#5C4A3A] accent-font">
                Frequency locked in ✨
              </h2>
              <p className="text-[#5C4A3A]/70 text-lg">
                You are now operating from faith, not fear. Your day begins with intention, not reaction.
              </p>
            </div>
          </QuizStep>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE7] p-6">
      <div className="max-w-2xl mx-auto pt-8 space-y-6">
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

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {step < 8 && (
          <div className="flex gap-4">
            {step > 0 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 py-6 text-lg rounded-xl border-[#E8D5C4] text-[#5C4A3A] hover:bg-[#F0EEE6]"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}
            <Button
              onClick={step === 7 ? handleSubmit : handleNext}
              className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              disabled={createMorningReflection.isPending}
            >
              {step === 7 ? "Complete" : "Continue"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
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
  );
}