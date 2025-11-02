
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { format, startOfWeek } from "date-fns";
import QuizStep from "../components/QuizStep";

export default function WeeklyRecalibration() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    week_start_date: format(startOfWeek(new Date()), "yyyy-MM-dd"),
    alignment_score: 3,
    attention_audit: "",
    internal_shift: "",
    scarcity_check: "",
    old_identity_surrender: "",
    service_audit: "",
    physical_inputs: ["", "", "", "", ""],
    target_outcome: ""
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
    enabled: !!user
  });

  // Delete existing reflection when quiz is opened
  useEffect(() => {
    const deleteExistingReflection = async () => {
      if (user) {
        const reflections = await base44.entities.WeeklyReflection.filter({ created_by: user.email });
        if (reflections.length > 0) {
          for (const reflection of reflections) {
            await base44.entities.WeeklyReflection.delete(reflection.id);
          }
          queryClient.invalidateQueries(['weeklyReflections']);
          queryClient.invalidateQueries(['latestWeekly']);
        }
      }
    };
    deleteExistingReflection();
  }, [user]);

  const createReflection = useMutation({
    mutationFn: (data) => base44.entities.WeeklyReflection.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['weeklyReflections']);
      queryClient.invalidateQueries(['latestWeekly']);
      navigate(createPageUrl("Compass"));
    }
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePhysicalInput = (index, value) => {
    const newInputs = [...formData.physical_inputs];
    newInputs[index] = value;
    updateFormData("physical_inputs", newInputs);
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => { if (step > 0) setStep(step - 1); };
  const handleSubmit = () => createReflection.mutate(formData);

  const firstName = profile?.preferred_name || 'friend';

  const renderContent = () => {
    const maxSteps = 10;
    const isLastStep = step === maxSteps;
    const isSaveStep = step === maxSteps - 1;

    let currentStepComponent;

    switch (step) {
      case 0:
        currentStepComponent = (
          <QuizStep>
            <div className="space-y-6 text-center">
              <h2 className="text-4xl font-semibold text-[#5C4A3A] accent-font">Hey {firstName}</h2>
              <p className="text-[#5C4A3A]/70 text-lg">Breathe until you feel calm and centered. You're entering a new week with awareness.</p>
            </div>
          </QuizStep>
        );
        break;

      case 1:
        currentStepComponent = (
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
        break;

      case 2:
        currentStepComponent = (
          <QuizStep title="Your Core Identity">
            <div className="space-y-4">
              <p className="text-[#5C4A3A]/70 mb-4">
                Before we begin the audit, reconnect with who you are becoming.
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
                    {profile.identity_story && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-[#5C4A3A]/70 uppercase tracking-wider">Full Identity</p>
                        <p className="text-[#5C4A3A] leading-relaxed">
                          {profile.identity_story}
                        </p>
                      </div>
                    )}
                    {profile.life_purpose_summary && (
                      <div className="space-y-2 pt-3 border-t border-[#E8D5C4]">
                        <p className="text-sm font-medium text-[#5C4A3A]/70 uppercase tracking-wider">Life Purpose</p>
                        <p className="text-xl font-semibold text-[#5C4A3A] leading-relaxed">
                          {profile.life_purpose_summary}
                        </p>
                      </div>
                    )}
                    {profile.yearly_goal && (
                      <div className="space-y-2 pt-3 border-t border-[#E8D5C4]">
                        <p className="text-sm font-medium text-[#5C4A3A]/70 uppercase tracking-wider">This Year's Goal</p>
                        <p className="text-[#5C4A3A] leading-relaxed">
                          {profile.yearly_goal}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-[#5C4A3A]/60 italic text-center py-6">
                    You haven't set your Core Identity yet. Complete it first to unlock your personalized weekly recalibration.
                  </p>
                )}
              </div>
            </div>
          </QuizStep>
        );
        break;

      case 3:
        currentStepComponent = (
          <QuizStep title="Week Audit (Attention & Frequency Check)">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-[#5C4A3A]/70 mb-3">
                  Weekly Alignment Score: On a scale of 1 (Misaligned/Stuck) to 5 (Effortless Flow/Alignment), how well did you maintain your Core Identity this past week?
                </p>
                <Slider 
                  value={[formData.alignment_score]} 
                  onValueChange={(v) => updateFormData("alignment_score", v[0])} 
                  min={1} 
                  max={5} 
                  step={1} 
                  className="py-4" 
                />
                <div className="flex justify-between text-sm text-[#5C4A3A]/60 mt-2">
                  <span>Misaligned/Stuck</span>
                  <span className="text-3xl font-semibold text-[#D4AF77]">{formData.alignment_score}</span>
                  <span>Effortless Flow</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
                  Attention Audit: Where did I spend (unwanted condition) versus invest (wanted condition) my attention this week?
                </label>
                <Textarea 
                  value={formData.attention_audit} 
                  onChange={(e) => updateFormData("attention_audit", e.target.value)} 
                  placeholder="Reference a specific moment or pattern..."
                  className="min-h-[100px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
                  Internal Shift: Describe one internal shift (a change in frequency, feeling, or state of being) that produced the greatest tangible or non-tangible result this week.
                </label>
                <Textarea 
                  value={formData.internal_shift} 
                  onChange={(e) => updateFormData("internal_shift", e.target.value)} 
                  placeholder="What shifted internally and what resulted from it?"
                  className="min-h-[100px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl" 
                />
              </div>
            </div>
          </QuizStep>
        );
        break;

      case 4:
        currentStepComponent = (
          <QuizStep title="Sacrifice & Transmutation (Letting Go of Resistance)">
            <div className="space-y-6">
              <p className="text-[#5C4A3A]/70">
                Identify the lower nature you must surrender and refuse to engage with, breaking the karmic loop of reaction.
              </p>

              <div>
                <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
                  Scarcity Check: What specific worry, fear, or limiting belief consumed the most energy this week?
                </label>
                <p className="text-xs text-[#5C4A3A]/60 mb-2 italic">
                  This is the lower frequency that needs to be transmutated
                </p>
                <Textarea 
                  value={formData.scarcity_check} 
                  onChange={(e) => updateFormData("scarcity_check", e.target.value)} 
                  placeholder="Name the specific worry, fear, or limiting belief..."
                  className="min-h-[100px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
                  Old Identity Surrender: What old identity or habit (The 'Old You') will I consciously surrender and absolutely refuse to react to in the coming week?
                </label>
                <Textarea 
                  value={formData.old_identity_surrender} 
                  onChange={(e) => updateFormData("old_identity_surrender", e.target.value)} 
                  placeholder="I will no longer be the person who..."
                  className="min-h-[100px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl" 
                />
              </div>
            </div>
          </QuizStep>
        );
        break;

      case 5:
        currentStepComponent = (
          <QuizStep title="Service and Wholeness (Be-Do-Have Assessment)">
            <div className="space-y-4">
              <p className="text-[#5C4A3A]/70">
                Evaluate if your pursuit of goals was rooted in scarcity or genuine service, reinforcing the spiritual pillar of giving.
              </p>

              <div>
                <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
                  Service Audit: Did I operate primarily from wanting/taking, or giving/service this week?
                </label>
                <p className="text-xs text-[#5C4A3A]/60 mb-2 italic">
                  Describe one act of selfless giving or service I performed (This reinforces abundance)
                </p>
                <Textarea 
                  value={formData.service_audit} 
                  onChange={(e) => updateFormData("service_audit", e.target.value)} 
                  placeholder="Describe an act of genuine giving or service..."
                  className="min-h-[120px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl" 
                />
              </div>
            </div>
          </QuizStep>
        );
        break;

      case 6:
        currentStepComponent = (
          <QuizStep title="Next Week Blueprint: Physical Inputs (The 'Doing')">
            <div className="space-y-4">
              <p className="text-[#5C4A3A]/70 mb-4">
                Define the precise physical actions (inputs) for the upcoming week that align with your new desired frequency. This is the action required to materialize change.
              </p>
              <p className="text-sm font-medium text-[#5C4A3A] mb-3">
                Physical Inputs (Non-Negotiables): List 3-5 Non-Negotiable physical actions, tasks, or habits that I must complete in the next 7 days to reinforce my elevated frequency.
              </p>
              <div className="space-y-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Input 
                    key={i}
                    value={formData.physical_inputs[i]} 
                    onChange={(e) => updatePhysicalInput(i, e.target.value)} 
                    placeholder={i < 3 ? `Action #${i + 1} (Required)` : `Action #${i + 1} (Optional)`}
                    className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl" 
                  />
                ))}
              </div>
              <p className="text-xs text-[#5C4A3A]/60 italic mt-3">
                Examples: "Complete 4 gym sessions," "Post 5 pieces of content," "Check emails only once daily"
              </p>
            </div>
          </QuizStep>
        );
        break;

      case 7:
        currentStepComponent = (
          <QuizStep title="Target Outcome (The Materialization)">
            <div className="space-y-4">
              <p className="text-[#5C4A3A]/70 mb-4">
                Project and define the measurable, tangible outcome you expect from this aligned action, solidifying the mental target.
              </p>

              <div>
                <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
                  What is the single most important, measurable physical goal/outcome that must materialize next week, and how will it feel when achieved?
                </label>
                <Textarea 
                  value={formData.target_outcome} 
                  onChange={(e) => updateFormData("target_outcome", e.target.value)} 
                  placeholder="The outcome and how it will feel..."
                  className="min-h-[120px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl" 
                />
              </div>
            </div>
          </QuizStep>
        );
        break;

      case 8:
        currentStepComponent = (
          <QuizStep title="Core Identity Lock-In (Final Reinforcement)">
            <div className="space-y-6">
              <p className="text-[#5C4A3A]/70">
                Read your full Identity Statement now to cement this week's alignment.
              </p>
              <div className="space-y-4 p-6 bg-gradient-to-br from-[#D4AF77]/20 to-[#E8D5C4]/40 rounded-xl border-2 border-[#D4AF77]/40">
                {profile ? (
                  <>
                    {profile.identity_summary && (
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-[#5C4A3A] leading-relaxed accent-font">
                          {profile.identity_summary}
                        </p>
                      </div>
                    )}
                    {profile.identity_story && (
                      <div className="space-y-2 pt-3 border-t border-[#D4AF77]/30">
                        <p className="text-[#5C4A3A] leading-relaxed">
                          {profile.identity_story}
                        </p>
                      </div>
                    )}
                    {profile.life_purpose_summary && (
                      <div className="space-y-2 pt-3 border-t border-[#D4AF77]/30">
                        <p className="text-lg font-semibold text-[#5C4A3A] leading-relaxed">
                          {profile.life_purpose_summary}
                        </p>
                      </div>
                    )}
                    <div className="pt-3 border-t border-[#D4AF77]/30">
                      <p className="text-xl font-bold text-[#D4AF77] leading-relaxed italic">
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
              <p className="text-sm text-[#5C4A3A]/60 text-center italic">
                Speak these words aloud or read them silently with full conviction.
              </p>
            </div>
          </QuizStep>
        );
        break;

      case 9:
        currentStepComponent = (
          <QuizStep>
            <div className="space-y-6 text-center">
              <Check className="w-16 h-16 text-[#D4AF77] mx-auto" />
              <h2 className="text-3xl font-semibold text-[#5C4A3A] accent-font">Beautiful work, {firstName}</h2>
              <p className="text-[#5C4A3A]/70 text-lg">Your next week is aligned. Your future is already unfolding.</p>
            </div>
          </QuizStep>
        );
        break;
    }

    return (
      <div className="min-h-screen bg-[#F5EFE7] p-6">
        <div className="max-w-2xl mx-auto pt-8 space-y-6">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={() => step > 0 ? handleBack() : navigate(createPageUrl("Compass"))} variant="ghost" className="text-[#5C4A3A]/60 hover:text-[#5C4A3A] hover:bg-[#F0EEE6]">
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Button>
            {step >= 0 && step < maxSteps && <div className="text-sm text-[#5C4A3A]/50">Step {step + 1} of {maxSteps}</div>}
          </div>
          <AnimatePresence mode="wait">{currentStepComponent}</AnimatePresence>
          
          {step === 0 && (
            <div className="flex gap-4 mt-6">
              <Button onClick={handleNext} className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl">
                Begin<ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {step > 0 && !isLastStep && (
            <div className="flex gap-4 mt-6">
              <Button onClick={isSaveStep ? handleSubmit : handleNext} className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl" disabled={createReflection.isPending}>
                {isSaveStep ? "Complete" : "Continue"}<ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
          {isLastStep && (
            <Button onClick={() => navigate(createPageUrl("Compass"))} className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl mt-6">
              Return to Compass
            </Button>
          )}
        </div>
      </div>
    );
  };

  return renderContent();
}
