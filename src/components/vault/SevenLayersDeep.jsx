import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SevenLayersDeep() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [initialQuestion, setInitialQuestion] = useState("");
  const [layers, setLayers] = useState(Array(7).fill(""));
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: sessions } = useQuery({
    queryKey: ['sevenLayersSessions', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.SevenLayersSession.filter({ created_by: user.email }, '-created_date', 10);
    },
    enabled: !!user,
  });

  const createSession = useMutation({
    mutationFn: (data) => base44.entities.SevenLayersSession.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sevenLayersSessions']);
      setStep(9);
    },
  });

  const handleLayerChange = (index, value) => {
    const newLayers = [...layers];
    newLayers[index] = value;
    setLayers(newLayers);
  };

  const handleNext = () => {
    if (step < 8) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    createSession.mutate({
      initial_question: initialQuestion,
      layers: layers,
    });
  };

  const handleReset = () => {
    setStep(0);
    setInitialQuestion("");
    setLayers(Array(7).fill(""));
  };

  const getLayerQuestion = (layerIndex) => {
    const questions = [
      `Why does "${initialQuestion}" matter to me right now?`,
      `What is the specific emotion I associate with possessing (or lacking) "${initialQuestion}"?`,
      `If I resolve "${initialQuestion}", what core fear or lack would cease to exist?`,
      layers[2] ? `Who or what did I observe/experience in the past that taught me "${layers[2]}"?` : `Who or what did I observe/experience in the past that taught me this fear or lack?`,
      layers[2] ? `If "${layers[2]}" were a life rule, how does it limit my identity?` : `If this fear or lack were a life rule, how does it limit my identity?`,
      `What is the opposite emotion I desire to feel instead of this current state?`,
      `What single statement defines the ultimate core belief or void that is creating and sustaining my current unwanted reality?`,
    ];
    return questions[layerIndex];
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#5C4A3A] accent-font">Seven Layers Deep</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#D4AF77] hover:bg-[#D4AF77]/10">
                  <HelpCircle className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4] max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-[#5C4A3A]">Seven Layers Deep: Finding the Emotional Root</DialogTitle>
                  <DialogDescription className="text-[#5C4A3A]/80 space-y-4 pt-4 text-left">
                    <div>
                      <h4 className="font-semibold text-[#5C4A3A] mb-2">When & Why to Use</h4>
                      <p>
                        Use this tool when a desire feels complex, overwhelming, or when you keep self-sabotaging the attainment of a goal. Surface desires (like "I want $10,000") lack the emotional fuel necessary for manifestation; this process digs down to find the true core why (e.g., security, appreciation, freedom) or the root emotional trauma (e.g., feeling rejected, worthless).
                      </p>
                      <p className="mt-2">
                        Resolving the surface issue without finding the root is ineffective because the unconscious mind will simply create a new problem to feed the original emotional void.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#5C4A3A] mb-2">Science/Metaphysics</h4>
                      <p>
                        The subconscious mind is programmed not primarily by repetition, but by <strong>emotional intensity</strong> (an energetic charge). Traumatic or intense emotional experiences (even small, repeated ones) imprint beliefs instantly.
                      </p>
                      <p className="mt-2">
                        By exposing the root emotional association in Layer 7, we identify the specific energetic charge that needs to be displaced by an equal or more powerful positive emotional charge—the only way to rewrite a core memory.
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            <p className="text-[#5C4A3A]/70">
              This process will guide you through seven layers of questioning to uncover the emotional root beneath your surface desire or problem.
            </p>
            <div>
              <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
                What Condition or Desire is currently ruling your attention?
              </label>
              <Textarea
                value={initialQuestion}
                onChange={(e) => setInitialQuestion(e.target.value)}
                placeholder="e.g., I want to earn $10,000/month, I want to find my soulmate, I feel stuck in my career..."
                className="min-h-[100px] bg-[#F0EEE6] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
              />
            </div>
            <Button
              onClick={handleNext}
              disabled={!initialQuestion.trim()}
              className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
            >
              Begin Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      );
    }

    if (step >= 1 && step <= 7) {
      const layerIndex = step - 1;
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="mb-6">
            <p className="text-sm text-[#D4AF77] font-semibold uppercase tracking-wider mb-2">
              Layer {step} of 7
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              {getLayerQuestion(layerIndex)}
            </h3>
          </div>
          <div className="space-y-4">
            <Textarea
              value={layers[layerIndex]}
              onChange={(e) => handleLayerChange(layerIndex, e.target.value)}
              placeholder="Take your time. Write what comes up, even if it feels uncomfortable..."
              className="min-h-[150px] bg-[#F0EEE6] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 py-6 text-lg rounded-xl border-[#E8D5C4] text-[#5C4A3A] hover:bg-[#F0EEE6]"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button
                onClick={step === 7 ? handleComplete : handleNext}
                disabled={!layers[layerIndex].trim()}
                className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              >
                {step === 7 ? "Complete" : "Continue"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (step === 8) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <Check className="w-16 h-16 text-[#D4AF77] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#5C4A3A] accent-font mb-2">
                Journey Complete
              </h3>
              <p className="text-[#5C4A3A]/70">
                You've uncovered the emotional root. Review your journey below.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#D4AF77]/10 rounded-xl p-4 border border-[#D4AF77]/30">
                <p className="text-sm font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-2">
                  Starting Point
                </p>
                <p className="text-[#5C4A3A] font-medium">{initialQuestion}</p>
              </div>

              {layers.map((layer, index) => (
                <div key={index} className="bg-[#F0EEE6] rounded-xl p-4">
                  <p className="text-xs font-semibold text-[#D4AF77] uppercase tracking-wider mb-2">
                    Layer {index + 1}
                  </p>
                  <p className="text-sm text-[#5C4A3A]/70 mb-2 italic">
                    {getLayerQuestion(index)}
                  </p>
                  <p className="text-[#5C4A3A]">{layer}</p>
                </div>
              ))}

              {layers[6] && (
                <div className="bg-gradient-to-br from-[#D4AF77]/20 to-[#E8D5C4]/40 rounded-xl p-6 border-2 border-[#D4AF77]/40">
                  <p className="text-sm font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-3">
                    🎯 Core Truth (Layer 7)
                  </p>
                  <p className="text-xl font-bold text-[#5C4A3A] leading-relaxed accent-font">
                    {layers[6]}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 py-6 text-lg rounded-xl border-[#E8D5C4] text-[#5C4A3A] hover:bg-[#F0EEE6]"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Review
              </Button>
              <Button
                onClick={handleComplete}
                disabled={createSession.isPending}
                className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              >
                Save & Finish
                <Check className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (step === 9) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl text-center">
          <Check className="w-20 h-20 text-[#D4AF77] mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-[#5C4A3A] accent-font mb-4">
            Emotional Root Revealed
          </h3>
          <p className="text-[#5C4A3A]/70 text-lg mb-6 leading-relaxed">
            You've identified the core belief fueling your reality. This awareness is the first step to transformation.
          </p>
          <Button
            onClick={handleReset}
            className="bg-[#D4AF77] hover:bg-[#C49F67] text-white px-8 py-6 text-lg rounded-xl"
          >
            Start New Session
          </Button>
        </Card>
      );
    }
  };

  return (
    <div className="space-y-6">
      {renderStep()}

      {sessions && sessions.length > 0 && step === 0 && (
        <Card className="p-6 bg-[#F0EEE6] border-[#E8D5C4] rounded-2xl">
          <h4 className="text-lg font-semibold text-[#5C4A3A] mb-4">Previous Sessions</h4>
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <div key={session.id} className="bg-[#FDFBF7] rounded-xl p-4 border border-[#E8D5C4]">
                <p className="text-sm text-[#D4AF77] font-semibold mb-2">
                  Session {sessions.length - index}
                </p>
                <p className="text-[#5C4A3A] font-medium mb-2">{session.initial_question}</p>
                <div className="mt-3 pt-3 border-t border-[#E8D5C4]">
                  <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">Core Truth</p>
                  <p className="text-sm text-[#5C4A3A] italic">{session.layers[6]}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}