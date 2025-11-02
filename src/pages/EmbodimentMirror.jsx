import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Heart, Play } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import QuizStep from "../components/QuizStep";

export default function EmbodimentMirror() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [isImmersing, setIsImmersing] = useState(false);
  const [formData, setFormData] = useState({
    ideal_feeling: "",
    primary_emotion: "",
    desires_feeling: "",
    sensory_description: "",
    congratulator_name: "",
    congratulator_message: "",
  });

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: existingMirror } = useQuery({
    queryKey: ['embodimentMirror', user?.email],
    queryFn: async () => {
      const mirrors = await base44.entities.EmbodimentMirror.filter({ created_by: user.email });
      return mirrors[0] || null;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (existingMirror) {
      setFormData(existingMirror);
    }
  }, [existingMirror]);

  const saveOrUpdateMirror = useMutation({
    mutationFn: (data) => {
      if (existingMirror) {
        return base44.entities.EmbodimentMirror.update(existingMirror.id, data);
      }
      return base44.entities.EmbodimentMirror.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['embodimentMirror']);
      setStep(step + 1);
    },
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    saveOrUpdateMirror.mutate(formData);
  };

  const handleFeelItNow = () => {
    setIsImmersing(true);
    setTimeout(() => {
      setIsImmersing(false);
    }, 60000); // 60 seconds
  };

  const firstName = user?.full_name?.split(' ')[0] || 'friend';

  const renderStep = () => {
    switch (step) {
      case 0:
  return (
    <QuizStep>
      <div className="space-y-8 text-center">
        <Heart className="w-16 h-16 text-[#D4AF77] mx-auto" />
        <h2 className="text-4xl font-semibold text-[#5C4A3A] accent-font">
          Embodiment Mirror
        </h2>
        <p className="text-[#5C4A3A]/70 text-lg leading-relaxed max-w-md mx-auto">
          How does your ideal self FEEL? Let's anchor into pure sensation.
        </p>

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleNext}
            className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl max-w-xs"
          >
            Begin
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </QuizStep>
  );


      case 1:
        return (
          <QuizStep title="How does your ideal self FEEL in their body right now?">
            <p className="text-sm text-[#5C4A3A]/70 mb-4">Not visual. Pure sensation.</p>
            <Textarea
              value={formData.ideal_feeling}
              onChange={(e) => updateFormData("ideal_feeling", e.target.value)}
              placeholder="Safe, expansive, powerful, magnetic, light..."
              className="min-h-[120px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 2:
        return (
          <QuizStep title="What emotion do you carry throughout your day?">
            <p className="text-sm text-[#5C4A3A]/70 mb-4">Your primary frequency anchor</p>
            <Input
              value={formData.primary_emotion}
              onChange={(e) => updateFormData("primary_emotion", e.target.value)}
              placeholder="Peaceful confidence | Grounded abundance | Joyful clarity"
              className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 3:
        return (
          <QuizStep title="Describe the feeling of your desires already being real">
            <p className="text-sm text-[#5C4A3A]/70 mb-4">What's the sensation in your chest? How do you breathe? What's your posture?</p>
            <Textarea
              value={formData.desires_feeling}
              onChange={(e) => updateFormData("desires_feeling", e.target.value)}
              placeholder="The feeling is..."
              className="min-h-[150px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 4:
        return (
          <QuizStep title="What does success taste, smell, and sound like?">
            <p className="text-sm text-[#5C4A3A]/70 mb-4">Sensory anchors (not visual)</p>
            <Textarea
              value={formData.sensory_description}
              onChange={(e) => updateFormData("sensory_description", e.target.value)}
              placeholder="Success tastes like freedom. It smells like possibility. It sounds like my own voice, calm and sure."
              className="min-h-[150px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 5:
        return (
          <QuizStep title="Who congratulates you on your success?">
            <p className="text-sm text-[#5C4A3A]/70 mb-4">For Inner Conversation</p>
            <div className="space-y-4">
              <Input
                value={formData.congratulator_name}
                onChange={(e) => updateFormData("congratulator_name", e.target.value)}
                placeholder="Name the person"
                className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
              />
              <Textarea
                value={formData.congratulator_message}
                onChange={(e) => updateFormData("congratulator_message", e.target.value)}
                placeholder="What do they say? What do you HEAR in their voice?"
                className="min-h-[100px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
              />
            </div>
          </QuizStep>
        );

      case 6:
        return (
          <QuizStep>
            <div className="space-y-8">
              {formData.primary_emotion && (
                <div className="text-center">
                  <p className="text-sm text-[#5C4A3A]/60 uppercase tracking-wider mb-2">Your Primary Frequency</p>
                  <h3 className="text-4xl font-bold text-[#D4AF77] accent-font mb-8">
                    {formData.primary_emotion}
                  </h3>
                </div>
              )}

              {formData.sensory_description && (
                <div className="bg-[#F0EEE6] rounded-xl p-6">
                  <p className="text-[#5C4A3A] leading-relaxed italic text-lg">
                    {formData.sensory_description}
                  </p>
                </div>
              )}

              <div className="text-center">
                <Button
                  onClick={handleFeelItNow}
                  disabled={isImmersing}
                  className="bg-[#D4AF77] hover:bg-[#C49F67] text-white px-10 py-6 text-lg rounded-xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {isImmersing ? "Immersing..." : "Feel It Now"}
                </Button>
                <p className="text-sm text-[#5C4A3A]/60 mt-3">60-second immersion</p>
              </div>

              {isImmersing && (
                <div className="bg-[#D4AF77]/20 rounded-xl p-8 text-center space-y-4">
                  <p className="text-2xl text-[#5C4A3A] leading-relaxed accent-font">
                    Close your eyes
                  </p>
                  <p className="text-xl text-[#5C4A3A]/80">
                    Feel {formData.primary_emotion} in your body now
                  </p>
                  {formData.congratulator_name && formData.congratulator_message && (
                    <div className="pt-4">
                      <p className="text-lg text-[#5C4A3A] font-medium mb-2">
                        {formData.congratulator_name} says:
                      </p>
                      <p className="text-lg text-[#5C4A3A] italic">
                        "{formData.congratulator_message}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center pt-4">
                <Button
                  onClick={() => navigate(createPageUrl("Compass"))}
                  variant="outline"
                  className="border-[#E8D5C4] text-[#5C4A3A]"
                >
                  Return to Compass
                </Button>
              </div>
            </div>
          </QuizStep>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE7] p-6">
      <div className="max-w-2xl mx-auto pt-8 space-y-6">
        

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {step > 0 && step < 6 && (
          <div className="flex gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 py-6 text-lg rounded-xl border-[#E8D5C4] text-[#5C4A3A] hover:bg-[#F0EEE6]"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              onClick={step === 5 ? handleSubmit : handleNext}
              className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              disabled={saveOrUpdateMirror.isPending}
            >
              {step === 5 ? "Save & View" : "Continue"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}