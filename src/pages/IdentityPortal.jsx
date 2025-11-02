import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Sparkles, Volume2, VolumeX, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function IdentityPortal() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user) return null;
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0] || null;
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: (data) => base44.entities.UserProfile.update(profile.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile']);
    },
  });

  const generateMasterAffirmation = async () => {
    if (!profile) return;
    
    setIsGenerating(true);
    
    try {
      const firstName = profile.preferred_name || user?.full_name?.split(' ')[0] || 'friend';
      
      // Determine pronoun based on context or default to "themselves"
      const pronoun = "themselves"; // Can be enhanced with user preference later
      
      const prompt = `You are a Master Affirmation Generator designed to create highly personalized subconscious reprogramming scripts.

Your task is to generate a Master Affirmation Script for ${firstName} using the following template structure and guidelines:

CRITICAL CONSTRAINTS:
1. Write EVERYTHING in third person using "${firstName}" (never use "I" or "you")
2. Generate 20-25 distinct, powerful affirmation statements
3. DO NOT USE NUMBERS OR BULLET POINTS in front of statements - write them as flowing paragraphs
4. Integrate the user's specific Core Identity answers into relevant statements
5. Use present tense, conviction-based language
6. Emphasize emotional conviction (knowing) and internal alignment (being) over external outcomes

USER'S CORE IDENTITY DATA:
- Life Purpose: ${profile.life_purpose || 'Not set'}
- Life Purpose Summary: ${profile.life_purpose_summary || 'Not set'}
- Identity Story: ${profile.identity_story || 'Not set'}
- Identity Summary: ${profile.identity_summary || 'Not set'}
- Yearly Goal: ${profile.yearly_goal || 'Not set'}
- Monthly Goal: ${profile.monthly_goal || 'Not set'}
- Perfect Day: ${profile.perfect_day || 'Not set'}
- Material Desires: ${profile.material_desires || 'Not set'}
- Limitless Vision: ${profile.limitless_vision || 'Not set'}

TEMPLATE STRUCTURE (use this as your base, but integrate user's specific goals and identity):

Section 1: Alignment & Conviction (The Cause)
${firstName} knows that reality creation is simple and manifestation is effortless.
${firstName} is internally fulfilled and no longer emotionally dependent upon seeing reality change.
${firstName} maintains serene confidence and peace, which is ${firstName}'s highest creative frequency.
${firstName} chooses to focus ${pronoun === 'himself' ? 'his' : pronoun === 'herself' ? 'her' : 'their'} attention only on wanted conditions, knowing that attention is alignment.
${firstName} possesses unshakeable conviction in the truth of ${pronoun === 'himself' ? 'his' : pronoun === 'herself' ? 'her' : 'their'} desired reality, transcending all external doubt.

Section 2: Worthiness & Identity (The Being)
${firstName}'s self-worth is the foundation of ${firstName}'s reality; ${firstName} is worthy of all the good things that come to ${firstName}.
${firstName} is the divine authority in ${firstName}'s life and trusts ${pronoun} completely to lead.
${firstName} is a clear vessel for source energy, expressing divine love and wisdom in every action.
${firstName} effortlessly attracts what ${firstName} IS, knowing that consciousness is the product code of reality.
${firstName} is unapologetically authentic, honoring the self above all external validation or opinion.

Section 3: Wealth, Action, & Flow (The Doing/Having)
Money flows to ${firstName} effortlessly and consistently in increasing amounts.
${firstName} is a Master Manifestor whose actions are guided by inner teaching and intuition.
${firstName} operates entirely from a state of effortless action (Woo Way), finding joy and fulfillment in all tasks.
${firstName} uses obstacles as fuel for evolution, transmuting every perceived negative into growth.
${firstName} is receiving life-affirming energies and synchronicities daily that confirm ${firstName}'s alignment.
${firstName}'s body and mind work together in coherence, creating a powerful electromagnetic frequency of success.

Section 4: Health, Relationships, and Integration
${firstName} prioritizes health and fitness, cultivating an ever-improving healthy and energetic body.
${firstName} enjoys increasingly fulfilling, loving relationships, acting as a source of peace and appreciation for others.
${firstName} forgives the past and blesses the future, choosing to live fully in the now.
${firstName}'s ability to focus and control awareness is improving more and more each day, leading to mastery.

INTEGRATION INSTRUCTIONS:
- For Sections 3 and 4, weave in 3-5 statements specific to the user's Yearly Goal, Monthly Goal, and Identity Summary
- If they mentioned specific outcomes (e.g., "launching software", "earning $100K"), integrate these naturally
- Maintain the third-person, present-tense, conviction-based tone throughout
- Each statement should be roughly equivalent in length to the template phrases
- Write as flowing text with line breaks between statements - NO NUMBERS, NO BULLETS

OUTPUT FORMAT:
Generate ONLY the 20-25 affirmation statements as flowing text with line breaks between each statement. 
Do NOT include any introduction, explanation, section headers, numbers, or bullet points.
Do NOT include the Core Identity Blueprint section (that will be appended automatically).

Start your response with the first affirmation statement and end with the last one. No additional text.`;

      const generatedAffirmations = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
      });

      // Assemble the final Master Affirmation with Core Identity Blueprint appended
      const finalAffirmation = `${generatedAffirmations.trim()}

This is ${firstName}'s Core Identity Blueprint:

Life Purpose: ${profile.life_purpose || 'Not yet defined'}

Identity Embodiment: ${profile.identity_story || 'Not yet defined'}

Limitless Vision: ${profile.limitless_vision || 'Not yet defined'}

Perfect Day Design: ${profile.perfect_day || 'Not yet defined'}

Material Anchors: ${profile.material_desires || 'Not yet defined'}

Yearly Goal: ${profile.yearly_goal || 'Not yet defined'}

Monthly Goal: ${profile.monthly_goal || 'Not yet defined'}`;

      await updateProfile.mutateAsync({
        master_affirmation: finalAffirmation,
        master_affirmation_generated_date: new Date().toISOString()
      });

    } catch (error) {
      console.error("Failed to generate master affirmation:", error);
      alert("Failed to generate affirmation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayAudio = () => {
    if (!profile?.master_affirmation) return;
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(profile.master_affirmation);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const firstName = profile?.preferred_name || user?.full_name?.split(' ')[0] || 'friend';
  const needsGeneration = !profile?.master_affirmation || !profile?.master_affirmation_generated_date;

  return (
    <div className="min-h-screen bg-[#F5EFE7] p-6">
      <div className="max-w-3xl mx-auto pt-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Eye className="w-10 h-10 text-[#D4AF77]" />
            <h1 className="text-4xl font-bold text-[#5C4A3A]">Identity Portal</h1>
          </div>
          <p className="text-[#5C4A3A]/70">Your daily alignment anchor</p>
        </div>

        {!profile ? (
          <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] text-center">
            <p className="text-[#5C4A3A]/70">
              Complete your Core Identity first to unlock your Identity Portal
            </p>
          </Card>
        ) : needsGeneration ? (
          <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] text-center space-y-6">
            <Sparkles className="w-12 h-12 text-[#D4AF77] mx-auto" />
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-[#5C4A3A] accent-font">
                Generate Your Master Affirmation
              </h3>
              <p className="text-[#5C4A3A]/70 leading-relaxed max-w-xl mx-auto">
                Transform your Core Identity into a powerful subconscious reprogramming script. Read it daily to anchor your frequency.
              </p>
            </div>
            <Button
              onClick={generateMasterAffirmation}
              disabled={isGenerating}
              className="bg-[#D4AF77] hover:bg-[#C49F67] text-white px-8 py-6 text-lg rounded-xl"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Master Affirmation
                </>
              )}
            </Button>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-8 bg-gradient-to-br from-[#D4AF77]/20 to-[#E8D5C4]/40 border-2 border-[#D4AF77]/40 shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#5C4A3A] accent-font">
                  Your Master Affirmation
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={handlePlayAudio}
                    variant="outline"
                    size="icon"
                    className="border-[#D4AF77] text-[#D4AF77] hover:bg-[#D4AF77]/10"
                  >
                    {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <Button
                    onClick={generateMasterAffirmation}
                    disabled={isGenerating}
                    variant="outline"
                    size="icon"
                    className="border-[#D4AF77] text-[#D4AF77] hover:bg-[#D4AF77]/10"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <div className="text-[#5C4A3A] leading-relaxed whitespace-pre-wrap font-medium">
                  {profile.master_affirmation}
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-[#F0EEE6] border-[#E8D5C4] rounded-2xl">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#5C4A3A]">How to Use Your Portal</h3>
                <ul className="space-y-2 text-[#5C4A3A]/70 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF77] mt-0.5">•</span>
                    <span>Read this affirmation aloud every morning and evening (5-10 minutes)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF77] mt-0.5">•</span>
                    <span>Feel each statement as already true - embody the frequency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF77] mt-0.5">•</span>
                    <span>Use the audio feature for passive listening throughout the day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF77] mt-0.5">•</span>
                    <span>Regenerate monthly or when your identity evolves</span>
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}