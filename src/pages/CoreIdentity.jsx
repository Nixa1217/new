import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import QuizStep from "../components/QuizStep";

export default function CoreIdentity() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    life_purpose: "",
    life_purpose_summary: "",
    identity_story: "",
    identity_summary: "",
    limitless_vision: "",
    yearly_goal: "",
    monthly_goal: "",
    perfect_day: "",
    material_desires: ""
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

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({ ...prev, ...profile }));
    }
  }, [profile]);

  const createOrUpdateProfile = useMutation({
    mutationFn: async (data) => {
      if (profile) {
        return base44.entities.UserProfile.update(profile.id, data);
      }
      return base44.entities.UserProfile.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile']);
      setStep(step + 1);
    }
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 11) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    createOrUpdateProfile.mutate(formData);
  };

  const firstName = profile?.preferred_name || user?.full_name?.split(' ')[0] || 'friend';

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <QuizStep>
            <div className="space-y-6 text-center">
              <h2 className="text-4xl font-semibold text-[#5C4A3A] accent-font">
                Welcome, {firstName}
              </h2>
              <p className="text-[#5C4A3A]/70 text-lg leading-relaxed">
                You are not creating a future. You are remembering who you already are.
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
          <QuizStep title="Life Purpose">
            <p className="text-[#5C4A3A]/70 mb-4">
              What is {firstName}'s highest purpose — the way {firstName} wants to positively impact the world? 
              Think about the change you want to create, the people you want to serve, or the legacy you want to leave. 
              Write in third person.
            </p>
            <Textarea
              value={formData.life_purpose}
              onChange={(e) => updateFormData("life_purpose", e.target.value)}
              placeholder={`${firstName} exists to empower others to discover their authentic path and live with intention. ${firstName} creates spaces where people feel safe to grow, heal, and become who they're meant to be.`}
              className="min-h-[180px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 3:
        return (
          <QuizStep title="Purpose in One Line">
            <p className="text-[#5C4A3A]/70 mb-4">
              Rewrite {firstName}'s purpose in one short, powerful sentence (3–7 words). This is your north star.
            </p>
            <Input
              value={formData.life_purpose_summary}
              onChange={(e) => updateFormData("life_purpose_summary", e.target.value)}
              placeholder="Empowering others to live freely"
              className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 4:
        return (
          <QuizStep title="Identity Embodiment">
            <p className="text-[#5C4A3A]/70 mb-4">
              Describe the evolved version of {firstName} — the identity, energy, values, standards, personality, and emotional state. 
              How does this version of {firstName} show up? What do they believe? How do they feel daily? What do they no longer tolerate?
              Write in third person, present tense — as if it's already real.
            </p>
            <Textarea
              value={formData.identity_story}
              onChange={(e) => updateFormData("identity_story", e.target.value)}
              placeholder={`${firstName} is grounded, magnetic, and deeply present. ${firstName} moves through life with calm confidence, never rushing or forcing. ${firstName} values integrity above all — every decision is aligned with truth. ${firstName} no longer tolerates drama, manipulation, or scarcity mindset. ${firstName} feels peaceful, powerful, and free.`}
              className="min-h-[220px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 5:
        return (
          <QuizStep title="Identity in One Sentence">
            <p className="text-[#5C4A3A]/70 mb-4">
              Write one powerful sentence that describes {firstName}'s identity — like the subtitle of a Forbes article about you.
            </p>
            <Input
              value={formData.identity_summary}
              onChange={(e) => updateFormData("identity_summary", e.target.value)}
              placeholder={`${firstName} is a visionary leader transforming how people live and work`}
              className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 6:
        return (
          <QuizStep title="Limitless Vision">
            <p className="text-[#5C4A3A]/70 mb-4">
              If {firstName} already had full freedom and financial safety — what would {firstName}'s life look like? 
              Describe the lifestyle, freedom, experiences, environment, and expression. Where does {firstName} live? 
              What does {firstName} do daily? How does {firstName} spend time? Write in third person.
            </p>
            <Textarea
              value={formData.limitless_vision}
              onChange={(e) => updateFormData("limitless_vision", e.target.value)}
              placeholder={`${firstName} lives in a sunlit home near the ocean, surrounded by books and art. ${firstName} wakes without an alarm, creates freely, and travels spontaneously. ${firstName} hosts intimate gatherings, mentors visionaries, and spends afternoons walking in nature. Money is never a concern — ${firstName} invests in experiences, growth, and generosity.`}
              className="min-h-[220px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 7:
        return (
          <QuizStep title="One-Year Measurable Goal">
            <p className="text-[#5C4A3A]/70 mb-4">
              Write {firstName}'s one measurable goal for the next 12 months. It must be specific and answerable with YES or NO at the end of the year.
            </p>
            <p className="text-sm text-[#5C4A3A]/60 mb-4 italic">
              Examples: "Earn $100K in revenue" • "Publish a book" • "Move to Italy" • "Build a 10K email list"
            </p>
            <Input
              value={formData.yearly_goal}
              onChange={(e) => updateFormData("yearly_goal", e.target.value)}
              placeholder={`${firstName} earns $100,000 in revenue from coaching and digital products`}
              className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 8:
        return (
          <QuizStep title="One-Month Measurable Goal">
            <p className="text-[#5C4A3A]/70 mb-4">
              Write {firstName}'s one measurable goal for the next 30 days that supports the yearly goal. 
              This should be a clear milestone you can check off.
            </p>
            <p className="text-sm text-[#5C4A3A]/60 mb-4 italic">
              Examples: "Launch first paid offer" • "Complete draft of Chapter 1–5" • "Gain 500 new followers" • "Book first 3 clients"
            </p>
            <Input
              value={formData.monthly_goal}
              onChange={(e) => updateFormData("monthly_goal", e.target.value)}
              placeholder={`${firstName} launches the first coaching offer and books 3 clients`}
              className="bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 9:
        return (
          <QuizStep title="Perfect Day Design">
            <p className="text-[#5C4A3A]/70 mb-4">
              Describe {firstName}'s perfect ordinary day — a day that, if repeated, would naturally move {firstName} closer to the one-year vision. 
              Describe morning routine, daytime flow, and evening wind-down. Be specific about actions, feelings, and environment. 
              Write in third person.
            </p>
            <Textarea
              value={formData.perfect_day}
              onChange={(e) => updateFormData("perfect_day", e.target.value)}
              placeholder={`${firstName} wakes at 7am feeling rested. Morning begins with journaling, movement, and a nourishing breakfast. By 9am, ${firstName} is in deep focus — writing, creating, or coaching. Afternoons are for connection — calls with clients, collaboration, or personal time. Evenings include a walk, dinner with intention, and reflection before bed. ${firstName} feels fulfilled, productive, and aligned.`}
              className="min-h-[240px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 10:
        return (
          <QuizStep title="Lifestyle & Desires">
            <p className="text-[#5C4A3A]/70 mb-4">
              List the lifestyle experiences and material desires {firstName} chooses to manifest in the next 6–12 months. 
              Be specific and detailed. Include environments, possessions, experiences, or changes you want to embody. 
              Write in third person.
            </p>
            <p className="text-sm text-[#5C4A3A]/60 mb-4 italic">
              Examples: "A minimalist home office with natural light and plants" • "A reliable, beautiful car that feels luxurious" • "Monthly spa days and self-care rituals" • "A wardrobe that reflects confident, intentional style"
            </p>
            <Textarea
              value={formData.material_desires}
              onChange={(e) => updateFormData("material_desires", e.target.value)}
              placeholder={`${firstName} lives in a peaceful home with soft lighting, art on the walls, and a cozy reading nook. ${firstName} drives a reliable car that feels effortless. ${firstName} wears clothing that feels aligned — quality over quantity. ${firstName} invests in experiences: weekend retreats, intimate dinners, spontaneous travel.`}
              className="min-h-[200px] bg-[#FDFBF7] border-[#E8D5C4] focus:border-[#D4AF77] rounded-xl"
            />
          </QuizStep>
        );

      case 11:
        return (
          <QuizStep>
            <div className="space-y-6 text-center">
              <Sparkles className="w-16 h-16 text-[#D4AF77] mx-auto" />
              <h2 className="text-3xl font-semibold text-[#5C4A3A] accent-font">
                Beautiful work, {firstName}
              </h2>
              <p className="text-[#5C4A3A]/70 text-lg leading-relaxed">
                To solidify this identity, visit the 👁 Identity Portal and read your Core Identity recording morning and night. Repetition rewires the subconscious. Embodiment anchors the frequency.
              </p>
              <Button
                onClick={() => navigate(createPageUrl("Compass"))}
                className="bg-[#D4AF77] hover:bg-[#C49F67] text-white px-8 py-4 rounded-xl mt-4"
              >
                Return to Compass
              </Button>
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
            Step {step + 1} of 12
          </div>
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {step < 11 && (
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
              onClick={step === 10 ? handleSubmit : handleNext}
              className="flex-1 bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg rounded-xl"
              disabled={createOrUpdateProfile.isPending}
            >
              {step === 10 ? "Save Identity" : "Continue"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}