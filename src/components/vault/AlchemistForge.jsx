import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check, HelpCircle, Flame } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AlchemistForge() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    limiting_belief: "",
    service_audit: "",
    root_emotion: "",
    opposite_frequency: "",
    alchemist_rewrite: ""
  });

  React.useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user) return null;
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0] || null;
    },
    enabled: !!user,
  });

  const { data: sessions } = useQuery({
    queryKey: ['alchemistForgeSessions', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.AlchemistForgeSession.filter({ created_by: user.email }, '-created_date', 10);
    },
    enabled: !!user,
  });

  const createSession = useMutation({
    mutationFn: (data) => base44.entities.AlchemistForgeSession.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['alchemistForgeSessions']);
      setStep(6);
    },
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    createSession.mutate(formData);
  };

  const handleReset = () => {
    setStep(0);
    setFormData({
      limiting_belief: "",
      service_audit: "",
      root_emotion: "",
      opposite_frequency: "",
      alchemist_rewrite: ""
    });
  };

  const firstName = profile?.preferred_name || 'friend';

  const renderStep = () => {
    if (step === 0) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#5C4A3A] accent-font">The Alchemist's Forge</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#D4AF77] hover:bg-[#D4AF77]/10">
                  <HelpCircle className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4] max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-[#5C4A3A]">The Alchemist's Forge: Turning Fear into Fact</DialogTitle>
                  <DialogDescription className="text-[#5C4A3A]/80 space-y-4 pt-4 text-left">
                    <div>
                      <h4 className="font-semibold text-[#5C4A3A] mb-2">When & Why to Use</h4>
                      <p>
                        Use this tool whenever you catch yourself falling into old patterns, experiencing self-doubt, or realizing that a specific belief is dictating your limits (e.g., "I'm not worth X money"). Beliefs are the boundaries of what you can experience in reality.
                      </p>
                      <p className="mt-2">
                        If you feel stuck, it is highly likely that a belief that doesn't serve you is controlling your internal dialogue, causing analysis paralysis, and repelling your desired reality. This is an ideal follow-up tool to use after Seven Layers Deep has helped you pinpoint the deep core belief.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#5C4A3A] mb-2">Science/Metaphysics</h4>
                      <p>
                        Beliefs are <strong>thought forms</strong>—entities created by highly repeated mental and emotionally charged energy. These entities want to maintain their existence in your mind and actively fight against your transformation.
                      </p>
                      <p className="mt-2">
                        To remove them, you cannot simply use logic or repetition; you must engage the subconscious mind, and its most powerful language is <strong>emotion</strong>. This process works by identifying the negative emotional charge (fear, guilt, etc.) and intentionally creating an equal or more powerful emotional charge (confidence, gratitude) to displace the old frequency.
                      </p>
                      <p className="mt-2">
                        Manifestation is an instantaneous process, but hidden beliefs about time and unworthiness create resistance. By rewriting the belief and feeling the conviction (knowing) of the new truth, you activate the placebo effect of the universe to align with your change.
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            <p className="text-[#5C4A3A]/70">
              Transform limiting beliefs by displacing their negative emotional charge with powerful, opposite emotions.
            </p>
            <div>
              <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
                Identify the Limitation: What is the specific belief, phrase, or feeling (Mentally Transmitted Disease) currently holding {firstName} back?
              </label>
              <p className="text-xs text-[#5C4A3A]/60 mb-2 italic">
                e.g., "Money is scarce," "I am unworthy," or "Good things take time"
              </p>
              <Textarea
                value={formData.limiting_belief}
                onChange={(e) => updateFormData("limiting_belief", e.target.value)}
                placeholder="The belief holding me back is..."
                className="min-h-[100px] bg-[#F0EEE6] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
              />
            </div>
            <Button
              onClick={handleNext}
              disabled={!formData.limiting_belief.trim()}
              className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
            >
              Begin Transmutation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      );
    }

    if (step === 1) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="mb-6">
            <p className="text-sm text-[#D4AF77] font-semibold uppercase tracking-wider mb-2">
              Phase 1: Identification
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              Service Audit
            </h3>
          </div>
          <div className="space-y-4">
            <div className="bg-[#D4AF77]/10 rounded-xl p-4 border border-[#D4AF77]/30 mb-4">
              <p className="text-sm font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-2">
                Your Limiting Belief
              </p>
              <p className="text-[#5C4A3A] italic">"{formData.limiting_belief}"</p>
            </div>
            
            <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
              Does this belief actively contribute to or reflect {firstName}'s desired reality? If not, what purpose is it serving?
            </label>
            <p className="text-xs text-[#5C4A3A]/60 mb-2 italic">
              Hint: It is seeking to maintain mental real estate
            </p>
            <Textarea
              value={formData.service_audit}
              onChange={(e) => updateFormData("service_audit", e.target.value)}
              placeholder="This belief serves to..."
              className="min-h-[120px] bg-[#F0EEE6] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
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
                onClick={handleNext}
                disabled={!formData.service_audit.trim()}
                className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (step === 2) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="mb-6">
            <p className="text-sm text-[#D4AF77] font-semibold uppercase tracking-wider mb-2">
              Phase 3: Emotional Root
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              Core Association Trace
            </h3>
          </div>
          <div className="space-y-4">
            <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
              What specific low-frequency emotion (e.g., shame, fear, guilt, disappointment) is tied to this belief? When did {firstName} first experience or observe this feeling in relation to this belief?
            </label>
            <p className="text-xs text-[#5C4A3A]/60 mb-2 italic">
              Emotion is the binding agent of belief
            </p>
            <Textarea
              value={formData.root_emotion}
              onChange={(e) => updateFormData("root_emotion", e.target.value)}
              placeholder="The core emotion is... I first felt this when..."
              className="min-h-[140px] bg-[#F0EEE6] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
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
                onClick={handleNext}
                disabled={!formData.root_emotion.trim()}
                className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (step === 3) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="mb-6">
            <p className="text-sm text-[#D4AF77] font-semibold uppercase tracking-wider mb-2">
              Phase 4: Transmutation - Polarity Shift
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              Opposite Frequency
            </h3>
          </div>
          <div className="space-y-4">
            <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
              What is the emotional opposite of the Root Emotion (e.g., Peace, Abundance, Conviction)? This new feeling must be cultivated to overwrite the old program.
            </label>
            <Textarea
              value={formData.opposite_frequency}
              onChange={(e) => updateFormData("opposite_frequency", e.target.value)}
              placeholder="The opposite emotional frequency is..."
              className="min-h-[100px] bg-[#F0EEE6] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
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
                onClick={handleNext}
                disabled={!formData.opposite_frequency.trim()}
                className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (step === 4) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="mb-6">
            <p className="text-sm text-[#D4AF77] font-semibold uppercase tracking-wider mb-2">
              Phase 4: Transmutation - Emotional Displacement
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              The Alchemist's Rewrite
            </h3>
          </div>
          <div className="space-y-4">
            <div className="bg-[#D4AF77]/10 rounded-xl p-4 border border-[#D4AF77]/30 mb-4">
              <p className="text-sm font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-2">
                Old Belief
              </p>
              <p className="text-[#5C4A3A] italic line-through">"{formData.limiting_belief}"</p>
              <p className="text-sm font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-2 mt-4">
                New Frequency
              </p>
              <p className="text-[#5C4A3A] font-semibold">{formData.opposite_frequency}</p>
            </div>

            <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
              Rewrite the initial limiting belief as a new, undeniable truth, using the Opposite Frequency identified above. Immerse yourself in the KNOWING of this truth now.
            </label>
            <p className="text-xs text-[#5C4A3A]/60 mb-2 italic">
              e.g., "I know that I am effortlessly cherished and accepted"
            </p>
            <Textarea
              value={formData.alchemist_rewrite}
              onChange={(e) => updateFormData("alchemist_rewrite", e.target.value)}
              placeholder="I know that..."
              className="min-h-[140px] bg-[#F0EEE6] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
            <div className="bg-[#E8D5C4]/30 rounded-xl p-4 mt-4">
              <p className="text-sm text-[#5C4A3A] italic">
                Speak this aloud with conviction. Feel it as already true. The mind cannot distinguish between vivid imagination and reality.
              </p>
            </div>
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
                onClick={handleNext}
                disabled={!formData.alchemist_rewrite.trim()}
                className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              >
                Review & Complete
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (step === 5) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <Flame className="w-16 h-16 text-[#D4AF77] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#5C4A3A] accent-font mb-2">
                Review Your Transmutation
              </h3>
              <p className="text-[#5C4A3A]/70">
                The old energy is ready to be displaced
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#F0EEE6] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-2">
                  Old Limiting Belief
                </p>
                <p className="text-[#5C4A3A] italic line-through">"{formData.limiting_belief}"</p>
              </div>

              <div className="bg-[#F0EEE6] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-2">
                  Root Emotion Identified
                </p>
                <p className="text-[#5C4A3A] text-sm">{formData.root_emotion}</p>
              </div>

              <div className="bg-[#F0EEE6] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-2">
                  New Frequency
                </p>
                <p className="text-[#5C4A3A] font-semibold">{formData.opposite_frequency}</p>
              </div>

              <div className="bg-gradient-to-br from-[#D4AF77]/20 to-[#E8D5C4]/40 rounded-xl p-6 border-2 border-[#D4AF77]/40">
                <p className="text-sm font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-3">
                  🔥 Your New Truth
                </p>
                <p className="text-xl font-bold text-[#5C4A3A] leading-relaxed accent-font">
                  {formData.alchemist_rewrite}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 py-6 text-lg rounded-xl border-[#E8D5C4] text-[#5C4A3A] hover:bg-[#F0EEE6]"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleComplete}
                disabled={createSession.isPending}
                className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              >
                Complete Transmutation
                <Check className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (step === 6) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl text-center">
          <Flame className="w-20 h-20 text-[#D4AF77] mx-auto mb-6 animate-pulse" />
          <h3 className="text-3xl font-bold text-[#5C4A3A] accent-font mb-4">
            Transmutation Complete
          </h3>
          <p className="text-[#5C4A3A]/70 text-lg mb-4 leading-relaxed">
            The old energy has been displaced.
          </p>
          <div className="bg-gradient-to-br from-[#D4AF77]/20 to-[#E8D5C4]/40 rounded-xl p-6 border-2 border-[#D4AF77]/40 mb-6">
            <p className="text-xl font-bold text-[#5C4A3A] leading-relaxed accent-font">
              {formData.alchemist_rewrite}
            </p>
          </div>
          <p className="text-[#5C4A3A]/70 text-base mb-6 italic">
            Remember: Conviction is the only true currency for change.
          </p>
          <Button
            onClick={handleReset}
            className="bg-[#D4AF77] hover:bg-[#C49F67] text-white px-8 py-6 text-lg rounded-xl"
          >
            Transmute Another Belief
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
          <h4 className="text-lg font-semibold text-[#5C4A3A] mb-4">Previous Transmutations</h4>
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <div key={session.id} className="bg-[#FDFBF7] rounded-xl p-4 border border-[#E8D5C4]">
                <p className="text-sm text-[#D4AF77] font-semibold mb-2">
                  Session {sessions.length - index}
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">Old Belief</p>
                    <p className="text-sm text-[#5C4A3A] italic line-through">"{session.limiting_belief}"</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#E8D5C4]">
                    <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">New Truth</p>
                    <p className="text-sm text-[#5C4A3A] font-semibold">{session.alchemist_rewrite}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}