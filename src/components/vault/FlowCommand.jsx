import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check, HelpCircle, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function FlowCommand() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    task: "",
    alignment_score: 3,
    energy_flow: "",
    identity_execution: "",
    distraction_to_eliminate: "",
    flow_duration: ""
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
    queryKey: ['flowCommandSessions', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.FlowCommandSession.filter({ created_by: user.email }, '-created_date', 10);
    },
    enabled: !!user,
  });

  const createSession = useMutation({
    mutationFn: (data) => base44.entities.FlowCommandSession.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['flowCommandSessions']);
      setStep(9);
    },
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleComplete = () => {
    createSession.mutate(formData);
  };

  const handleReset = () => {
    setStep(0);
    setFormData({
      task: "",
      alignment_score: 3,
      energy_flow: "",
      identity_execution: "",
      distraction_to_eliminate: "",
      flow_duration: ""
    });
  };

  const firstName = profile?.preferred_name || 'friend';

  const renderStep = () => {
    if (step === 0) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#5C4A3A] accent-font">Flow Command</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#D4AF77] hover:bg-[#D4AF77]/10">
                  <HelpCircle className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4] max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-[#5C4A3A]">Flow Command: Effortless Action (Woo Way)</DialogTitle>
                  <DialogDescription className="text-[#5C4A3A]/80 space-y-4 pt-4 text-left">
                    <div>
                      <h4 className="font-semibold text-[#5C4A3A] mb-2">When & Why to Use</h4>
                      <p>
                        Use this tool specifically when you feel procrastination, stagnation, or chaos (Psychic Entropy) preventing you from starting a high-leverage task.
                      </p>
                      <p className="mt-2">
                        The process is designed to be quick, pulling you from the reactive 3D world back to the present moment, which is the quantum field of infinite potential.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#5C4A3A] mb-2">Science/Metaphysics</h4>
                      <p>
                        <strong>Flow State</strong> is the effortless merging of action and alignment. Procrastination is a signal that the action you need to take is in direct contradiction to your current low-frequency state of consciousness (stagnation of energy).
                      </p>
                      <p className="mt-2">
                        By engaging the Flow Command tool, you are forced to:
                      </p>
                      <ol className="list-decimal list-inside pl-4 mt-2 space-y-1">
                        <li><strong>Restore presence</strong> (Stillness)</li>
                        <li><strong>Observe the old pattern</strong> without reaction (Detachment)</li>
                        <li><strong>Consciously override</strong> the low frequency with the Alignment Lock (the desired Identity/Frequency)</li>
                      </ol>
                      <p className="mt-2">
                        This aligns your mental (thoughts), emotional (feeling), and physical (action) planes, allowing the task to unfold with effortlessness (Woo Way). You are choosing <strong>creation (Expansion)</strong> over <strong>consumption (Contraction)</strong>.
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            <p className="text-[#5C4A3A]/70">
              Pull yourself out of procrastination and into Flow State by establishing alignment and frequency coherence before action.
            </p>
            <Button
              onClick={handleNext}
              className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
            >
              Enter Flow State
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
              Phase 1: Present Moment
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              Stillness Check (Pure Vessel Prerequisite)
            </h3>
          </div>
          <div className="space-y-6">
            <p className="text-[#5C4A3A]/70">
              Stop the momentum of chaos. A pure vessel is required to receive insights.
            </p>
            <div className="bg-gradient-to-br from-[#D4AF77]/20 to-[#E8D5C4]/40 rounded-xl p-8 border-2 border-[#D4AF77]/40 text-center space-y-4">
              <Zap className="w-12 h-12 text-[#D4AF77] mx-auto" />
              <h4 className="text-2xl font-bold text-[#5C4A3A] accent-font">
                Momentary Freeze
              </h4>
              <p className="text-[#5C4A3A] leading-relaxed">
                Close your eyes and observe your breath for 10 seconds.
              </p>
              <p className="text-[#5C4A3A]/80 text-lg">
                Let go of all judgment and restore your power to the present moment.
              </p>
            </div>
            <Button
              onClick={handleNext}
              className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      );
    }

    if (step === 2) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="mb-6">
            <p className="text-sm text-[#D4AF77] font-semibold uppercase tracking-wider mb-2">
              Phase 1: Task Identification
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              The Action Input
            </h3>
          </div>
          <div className="space-y-4">
            <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
              What single, non-negotiable task must {firstName} execute right now to move toward their Yearly Focus?
            </label>
            <Textarea
              value={formData.task}
              onChange={(e) => updateFormData("task", e.target.value)}
              placeholder="The one task I must do now is..."
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
                disabled={!formData.task.trim()}
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
              Phase 2: Frequency Audit
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              Contradiction Analysis
            </h3>
          </div>
          <div className="space-y-6">
            <div className="bg-[#D4AF77]/10 rounded-xl p-4 border border-[#D4AF77]/30">
              <p className="text-sm font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-2">
                Your Task
              </p>
              <p className="text-[#5C4A3A]">{formData.task}</p>
            </div>

            <div>
              <p className="text-sm text-[#5C4A3A]/70 mb-3">
                Current Frequency Check: On a scale of 1 (Heavy Resistance) to 5 (Calm Readiness), how aligned does {firstName} feel toward starting this task?
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
                <span>Heavy Resistance</span>
                <span className="text-3xl font-semibold text-[#D4AF77]">{formData.alignment_score}</span>
                <span>Calm Readiness</span>
              </div>
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
              Phase 2: Flow Trigger Audit
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              Expansion vs. Contraction
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-[#5C4A3A]/70">
              Is {firstName}'s current state one of Expansion (enthusiasm, creative giving) or Contraction (fatigue, seeking consumption/taking)?
            </p>

            <div className="grid grid-cols-1 gap-4">
              <Card
                onClick={() => updateFormData("energy_flow", "expansion")}
                className={`p-6 cursor-pointer transition-all border-2 ${
                  formData.energy_flow === "expansion"
                    ? "border-[#D4AF77] bg-[#D4AF77]/10"
                    : "border-[#E8D5C4] bg-white hover:border-[#D4AF77]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      formData.energy_flow === "expansion"
                        ? "border-[#D4AF77] bg-[#D4AF77]"
                        : "border-[#E8D5C4]"
                    }`}
                  >
                    {formData.energy_flow === "expansion" && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-[#5C4A3A]">Expansion</p>
                    <p className="text-sm text-[#5C4A3A]/70">Enthusiasm, creative giving, energy flowing outward</p>
                  </div>
                </div>
              </Card>

              <Card
                onClick={() => updateFormData("energy_flow", "contraction")}
                className={`p-6 cursor-pointer transition-all border-2 ${
                  formData.energy_flow === "contraction"
                    ? "border-[#D4AF77] bg-[#D4AF77]/10"
                    : "border-[#E8D5C4] bg-white hover:border-[#D4AF77]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      formData.energy_flow === "contraction"
                        ? "border-[#D4AF77] bg-[#D4AF77]"
                        : "border-[#E8D5C4]"
                    }`}
                  >
                    {formData.energy_flow === "contraction" && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-[#5C4A3A]">Contraction</p>
                    <p className="text-sm text-[#5C4A3A]/70">Fatigue, seeking consumption/taking, energy depleted</p>
                  </div>
                </div>
              </Card>
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
                disabled={!formData.energy_flow}
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

    if (step === 5) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="mb-6">
            <p className="text-sm text-[#D4AF77] font-semibold uppercase tracking-wider mb-2">
              Phase 3: Alignment Lock
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              Identity Activation (The Being State)
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-[#5C4A3A]/70">
              Anchor your current state to your ideal self, aligning the action (Doing) with the desired frequency (Being).
            </p>

            <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
              How does {firstName}'s Core Identity (the future self) execute this action? State this truth in the third person, present tense.
            </label>
            <p className="text-xs text-[#5C4A3A]/60 mb-2 italic">
              e.g., "{firstName} starts immediately with sharp focus and calm clarity"
            </p>
            <Textarea
              value={formData.identity_execution}
              onChange={(e) => updateFormData("identity_execution", e.target.value)}
              placeholder={`${firstName} executes this by...`}
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
                disabled={!formData.identity_execution.trim()}
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

    if (step === 6) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="mb-6">
            <p className="text-sm text-[#D4AF77] font-semibold uppercase tracking-wider mb-2">
              Phase 3: Eliminate Psychic Entropy
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              Focus Command
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-[#5C4A3A]/70">
              Actively shut down cognitive noise. The mind is wired for survival/anxiety.
            </p>

            <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
              What single, non-essential distraction (phone, email, noise) must {firstName} eliminate in the next 5 minutes to maintain laser-focused indifference to chaos?
            </label>
            <Input
              value={formData.distraction_to_eliminate}
              onChange={(e) => updateFormData("distraction_to_eliminate", e.target.value)}
              placeholder="I will eliminate..."
              className="bg-[#F0EEE6] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
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
                disabled={!formData.distraction_to_eliminate.trim()}
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

    if (step === 7) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="mb-6">
            <p className="text-sm text-[#D4AF77] font-semibold uppercase tracking-wider mb-2">
              Phase 4: Flow Commitment
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              Commitment to Action
            </h3>
          </div>
          <div className="space-y-4">
            <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
              Commit to working on this task for X minutes (e.g., 25 minutes). State the feeling of completion right now.
            </label>
            <p className="text-xs text-[#5C4A3A]/60 mb-2 italic">
              e.g., "25 minutes - satisfaction, self-trust, peace"
            </p>
            <Textarea
              value={formData.flow_duration}
              onChange={(e) => updateFormData("flow_duration", e.target.value)}
              placeholder="Duration and feeling..."
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
                disabled={!formData.flow_duration.trim()}
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

    if (step === 8) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="mb-6">
            <p className="text-sm text-[#D4AF77] font-semibold uppercase tracking-wider mb-2">
              Phase 4: Final Identity Lock-In
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              Flow Lock-In
            </h3>
          </div>
          <div className="space-y-6">
            <p className="text-[#5C4A3A]/70">
              Read your Core Identity Statement to anchor your frequency.
            </p>
            <div className="space-y-4 p-6 bg-gradient-to-br from-[#D4AF77]/20 to-[#E8D5C4]/40 rounded-xl border-2 border-[#D4AF77]/40">
              {profile ? (
                <>
                  {profile.identity_summary && (
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-[#5C4A3A] leading-relaxed accent-font">
                        I am {profile.identity_summary}
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
                  You haven't set your Core Identity yet. Complete it first to unlock your personalized Flow Lock.
                </p>
              )}
            </div>
            <p className="text-sm text-[#5C4A3A]/60 text-center italic">
              Speak these words aloud or read them silently with full conviction.
            </p>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 py-6 text-lg rounded-xl border-[#E8D5C4] text-[#5C4A3A] hover:bg-[#F0EEE6]"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={createSession.isPending}
                className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              >
                Enter Flow
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
          <Zap className="w-20 h-20 text-[#D4AF77] mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-[#5C4A3A] accent-font mb-4">
            Flow State Activated
          </h3>
          <div className="bg-gradient-to-br from-[#D4AF77]/20 to-[#E8D5C4]/40 rounded-xl p-6 border-2 border-[#D4AF77]/40 mb-6">
            <p className="text-xl font-bold text-[#5C4A3A] leading-relaxed accent-font mb-3">
              {formData.identity_execution}
            </p>
            <p className="text-[#5C4A3A]/70">
              Duration: {formData.flow_duration}
            </p>
          </div>
          <p className="text-[#5C4A3A]/70 text-lg mb-6 leading-relaxed italic">
            You have chosen creation over consumption. The task unfolds with effortlessness.
          </p>
          <Button
            onClick={handleReset}
            className="bg-[#D4AF77] hover:bg-[#C49F67] text-white px-8 py-6 text-lg rounded-xl"
          >
            Start Another Flow
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
          <h4 className="text-lg font-semibold text-[#5C4A3A] mb-4">Previous Flow Sessions</h4>
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <div key={session.id} className="bg-[#FDFBF7] rounded-xl p-4 border border-[#E8D5C4]">
                <p className="text-sm text-[#D4AF77] font-semibold mb-2">
                  Session {sessions.length - index}
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">Task</p>
                    <p className="text-sm text-[#5C4A3A]">{session.task}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#E8D5C4]">
                    <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">Identity Execution</p>
                    <p className="text-sm text-[#5C4A3A] font-semibold">{session.identity_execution}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="text-[#5C4A3A]/60">
                      Alignment: <span className="font-semibold text-[#D4AF77]">{session.alignment_score}/5</span>
                    </span>
                    <span className="text-[#5C4A3A]/60">
                      Energy: <span className="font-semibold text-[#D4AF77] capitalize">{session.energy_flow}</span>
                    </span>
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