import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check, Target, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function GoalActionGenerator() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [coreIdentity, setCoreIdentity] = useState("");
  const [emotionalState, setEmotionalState] = useState("");
  const [actions, setActions] = useState(Array(100).fill(""));
  const [user, setUser] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: sessions } = useQuery({
    queryKey: ['goalActionSessions', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.GoalActionSession.filter({ created_by: user.email }, '-created_date', 10);
    },
    enabled: !!user,
  });

  const createSession = useMutation({
    mutationFn: (data) => base44.entities.GoalActionSession.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['goalActionSessions']);
      setStep(4);
    },
  });

  const handleActionChange = (index, value) => {
    const newActions = [...actions];
    newActions[index] = value;
    setActions(newActions);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const filteredActions = actions.filter(action => action.trim() !== "");
    createSession.mutate({
      goal: goal,
      actions: filteredActions,
    });
  };

  const handleReset = () => {
    setStep(0);
    setGoal("");
    setCoreIdentity("");
    setEmotionalState("");
    setActions(Array(100).fill(""));
  };

  const toggleSession = (sessionId) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  const filledActionsCount = actions.filter(a => a.trim()).length;

  const renderStep = () => {
    if (step === 0) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#5C4A3A] accent-font">Goal Action Generator</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#D4AF77] hover:bg-[#D4AF77]/10">
                  <HelpCircle className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4] max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-[#5C4A3A]">Goal Action Generator: Activating Your Focus Filter</DialogTitle>
                  <DialogDescription className="text-[#5C4A3A]/80 space-y-4 pt-4 text-left">
                    <div>
                      <h4 className="font-semibold text-[#5C4A3A] mb-2">When & Why to Use</h4>
                      <p>
                        Use this when you have a clear goal but suffer from analysis paralysis or feel stuck on "the how". This tool forces your attention away from complexity and provides concrete, measurable "Right Actions".
                      </p>
                      <p className="mt-2">
                        Action is the facilitator or midwife of frequency into reality; it is not the cause itself. This exercise ensures your action is rooted in the "right frequency" first, preventing wasted effort.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#5C4A3A] mb-2">Science/Metaphysics</h4>
                      <p>
                        This tool physiologically engages the <strong>Reticular Activating System (RAS)</strong>, a focus filtering mechanism in the brain. By generating 100 actions and focusing on the outcome, you are programming your brain to look for and amplify opportunities, synchronicities, and mental nudges that align with the goal, effectively filtering out distractions.
                      </p>
                      <p className="mt-2">
                        You must focus on the wanted condition, not the unwanted one. Execution of these aligned actions (the doing) is necessary because thinking without acting leads to analysis paralysis.
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            <p className="text-[#5C4A3A]/70">
              Generate up to 100 possible actions to achieve your goal. First, we'll align your frequency.
            </p>
            <div>
              <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
                What is your Target Goal?
              </label>
              <Textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Build a $100K/year coaching business, Write and publish a book, Move to a new country..."
                className="min-h-[100px] bg-[#F0EEE6] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
              />
            </div>
            <Button
              onClick={handleNext}
              disabled={!goal.trim()}
              className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
            >
              Continue
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
              Phase 1: Frequency Alignment
            </p>
            <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
              Align Your Identity First
            </h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
                If I already possessed this goal, what would my Core Identity be doing and feeling right now?
              </label>
              <Textarea
                value={coreIdentity}
                onChange={(e) => setCoreIdentity(e.target.value)}
                placeholder="Describe the version of you who has already achieved this goal..."
                className="min-h-[120px] bg-[#F0EEE6] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#5C4A3A] block mb-2">
                What is the single highest-frequency emotional state (e.g., Peace, Conviction, Abundance) I must embody to achieve this goal?
              </label>
              <Input
                value={emotionalState}
                onChange={(e) => setEmotionalState(e.target.value)}
                placeholder="e.g., Unwavering confidence, Deep peace, Abundant certainty..."
                className="bg-[#F0EEE6] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
              />
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
                disabled={!coreIdentity.trim() || !emotionalState.trim()}
                className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              >
                Continue to Actions
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#D4AF77] font-semibold uppercase tracking-wider mb-2">
                  Phase 2: Action Generation
                </p>
                <h3 className="text-xl font-bold text-[#5C4A3A] leading-relaxed">
                  100 Actions: List every possible action
                </h3>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#D4AF77]">{filledActionsCount}</p>
                <p className="text-sm text-[#5C4A3A]/60">of 100</p>
              </div>
            </div>
            <div className="mt-4 bg-[#D4AF77]/10 rounded-xl p-4">
              <p className="text-sm text-[#5C4A3A]">
                <strong>Goal:</strong> {goal}
              </p>
              <p className="text-sm text-[#5C4A3A] mt-2">
                <strong>Frequency:</strong> {emotionalState}
              </p>
            </div>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {actions.map((action, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[#D4AF77] w-8">{index + 1}.</span>
                <Input
                  value={action}
                  onChange={(e) => handleActionChange(index, e.target.value)}
                  placeholder={`Action ${index + 1}`}
                  className="bg-[#F0EEE6] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
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
              disabled={filledActionsCount === 0}
              className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
            >
              Review & Save
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      );
    }

    if (step === 3) {
      const filledActions = actions.filter(a => a.trim());
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <Target className="w-16 h-16 text-[#D4AF77] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#5C4A3A] accent-font mb-2">
                Review Your Action Plan
              </h3>
              <p className="text-[#5C4A3A]/70">
                You've generated {filledActions.length} possible actions
              </p>
            </div>

            <div className="bg-[#D4AF77]/10 rounded-xl p-6 border border-[#D4AF77]/30">
              <p className="text-sm font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-2">
                Target Goal
              </p>
              <p className="text-[#5C4A3A] font-medium text-lg mb-4">{goal}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#D4AF77]/30">
                <div>
                  <p className="text-xs font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-1">
                    Core Identity
                  </p>
                  <p className="text-sm text-[#5C4A3A]">{coreIdentity}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-1">
                    Emotional State
                  </p>
                  <p className="text-sm text-[#5C4A3A] font-semibold">{emotionalState}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#F0EEE6] rounded-xl p-4 max-h-[300px] overflow-y-auto">
              <p className="text-sm font-semibold text-[#5C4A3A] mb-3">Your Actions:</p>
              <div className="space-y-2">
                {filledActions.map((action, index) => (
                  <p key={index} className="text-sm text-[#5C4A3A] flex items-start gap-2">
                    <span className="text-[#D4AF77] font-semibold min-w-[24px]">{index + 1}.</span>
                    <span>{action}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 py-6 text-lg rounded-xl border-[#E8D5C4] text-[#5C4A3A] hover:bg-[#F0EEE6]"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Edit Actions
              </Button>
              <Button
                onClick={handleComplete}
                disabled={createSession.isPending}
                className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              >
                Save Session
                <Check className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (step === 4) {
      return (
        <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] rounded-2xl text-center">
          <Check className="w-20 h-20 text-[#D4AF77] mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-[#5C4A3A] accent-font mb-4">
            Your RAS is Now Activated
          </h3>
          <p className="text-[#5C4A3A]/70 text-lg mb-6 leading-relaxed">
            Your brain is now filtering for opportunities aligned with your goal. The work isn't to force results—it's to stay in frequency and take aligned action.
          </p>
          <Button
            onClick={handleReset}
            className="bg-[#D4AF77] hover:bg-[#C49F67] text-white px-8 py-6 text-lg rounded-xl"
          >
            Create New Goal
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
          <h4 className="text-lg font-semibold text-[#5C4A3A] mb-4">Previous Goals</h4>
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <div key={session.id} className="bg-[#FDFBF7] rounded-xl border border-[#E8D5C4] overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-[#F0EEE6] transition-colors"
                  onClick={() => toggleSession(session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-[#D4AF77] font-semibold mb-2">
                        Session {sessions.length - index}
                      </p>
                      <p className="text-[#5C4A3A] font-medium mb-2">{session.goal}</p>
                      <p className="text-sm text-[#5C4A3A]/60">
                        {session.actions.length} actions generated
                      </p>
                    </div>
                    {expandedSession === session.id ? (
                      <ChevronUp className="w-5 h-5 text-[#D4AF77]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#D4AF77]" />
                    )}
                  </div>
                </div>
                
                {expandedSession === session.id && (
                  <div className="px-4 pb-4 border-t border-[#E8D5C4] pt-4">
                    <p className="text-xs font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-3">
                      Actions Generated
                    </p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {session.actions.map((action, actionIndex) => (
                        <p key={actionIndex} className="text-sm text-[#5C4A3A] flex items-start gap-2">
                          <span className="text-[#D4AF77] font-semibold min-w-[24px]">{actionIndex + 1}.</span>
                          <span>{action}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}