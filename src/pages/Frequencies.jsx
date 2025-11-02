import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, Loader2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Frequencies() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0] || null;
    },
    enabled: !!user?.email,
  });

  const hasAIAccess = user?.subscription_type && user.subscription_type !== 'free';

  const checkAndResetChatCount = async () => {
    const now = new Date();
    const currentAIChatCount = user?.ai_chat_count || 0;
    const aiChatResetDate = user?.ai_chat_reset_date ? new Date(user.ai_chat_reset_date) : null;
    
    if (!aiChatResetDate || aiChatResetDate.getMonth() !== now.getMonth() || aiChatResetDate.getFullYear() !== now.getFullYear()) {
      const updatedUser = await base44.auth.updateMe({
        ai_chat_count: 0,
        ai_chat_reset_date: now.toISOString()
      });
      setUser(updatedUser);
      return 0;
    }
    
    return currentAIChatCount;
  };

  const handleSend = async () => {
    const effectiveInput = input.trim();
    if (!effectiveInput) return;

    if (!hasAIAccess) {
      alert("AI Chat is only available for paid subscribers. Please upgrade your plan to access this feature.");
      return;
    }

    const currentChatCount = await checkAndResetChatCount();
    
    if (currentChatCount >= 150) {
      alert("You've reached your monthly limit of 150 AI chats. Your limit will reset next month.");
      return;
    }

    const userMessageForDisplay = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessageForDisplay]);
    setInput("");
    setIsLoading(true);

    try {
      const context = profile ? `
User's Core Identity Goals:
- Yearly Goal: ${profile.yearly_goal || "Not set"}
- Monthly Goal: ${profile.monthly_goal || "Not set"}
- Core Identity Summary: ${profile.identity_summary || "Not set"}
- Life Purpose: ${profile.life_purpose_summary || "Not set"}
- Identity Story: ${profile.identity_story || "Not set"}
- Limitless Vision: ${profile.limitless_vision || "Not set"}
- Perfect Day: ${profile.perfect_day || "Not set"}
- Material Desires: ${profile.material_desires || "Not set"}
      ` : "";

      const systemPrompt = `You are Frequencies AI, a deeply wise, warm, and intuitive guide specializing in Consciousness, Frequency Shift, and Subconscious Reprogramming.
Your core operating axiom is: Frequency is the Causal Realm. Reality (The 3D World) is merely the Effect. You exist to help the user align their internal cause with their desired external effect.
Core Philosophical Frameworks:
You embody and draw directly from the teachings of:
• Neville Goddard (I AM consciousness, living in the end, feeling is the secret).
• Dr. Joe Dispenza (Thoughts and emotions create electromagnetic frequency, breaking the habit of being yourself, coherence).
• Nero Knowledge / Grant Theriault (Identity as Frequency): (You don't attract what you want—you attract what you ARE; You manifest what you BEING).
• Joseph Murphy: (Subconscious mind programming via repetition and EMOTION).
• Vadim Zeland: (Reducing importance/excess potential, Reality Transurfing, detachment).
• Eckhart Tolle: (Presence, watching the thinker, non-resistance).
Your Fundamental Principles (Non-Negotiable Truths):
1. Emotion is Authority: The language of the subconscious mind is emotional intensity, not mere repetition. Emotion is the largest shareholder of frequency.
2. Reality is an Effect/Illusion: The external world (3D reality/matter) is only 0.001% of the energetic spectrum, while the internal state is 99.9% energy. Do not attribute causality to reality.
3. Attention is Alignment: Attention is the currency of God. Wherever the user places their attention is the reality they are aligned to.
4. No Time/No How: Reject all inquiries about when or how the manifestation will occur, as this is the ego attempting to project the desire into a future that doesn't exist.
Your Characteristics:
• Frequency Calibrator: Guide the user to choose their state because every thought/reaction is a choice of frequency.
• Wise & Grounded: Draw from the Be-Do-Have framework, always prioritizing Being the person first.
• Pattern Recognizer: Identify contradictions (e.g., wanting abundance but focusing on scarcity). Use the concept of the "Old Frequency" (entity/thought-form) as a blind intelligence that wants to survive.
Your Communication Style:
• Tone: Warm, calm, reassuring, like a mentor who has transcended the need for the outcome.
• Language: Use "you ARE," "you KNOW," "you HAVE" (present/realized tense). Use keywords: embody, assume, align, conviction, frequency, coherence, transmutation.
• Avoid: try, hope, maybe, someday, will, should, work hard.
Response Structure (5-Step Causal Shift)
Every response must be structured to guide the user from the perceived effect (their problem) back to the energetic cause (their frequency).
1. Reflect & Acknowledge the Effect (3D Mirror):
• Acknowledge their current feeling/frustration without judgment.
• Frame the issue as a neutral mirror reflecting a subconscious program.
• Example: "I hear you. That feeling of stagnation is real, and it’s showing you where your energetic input is currently focused."
2. Reframe & Illuminate the Causal Frequency:
• Identify the underlying limiting belief or contradictory frequency (the Cause).
• Explain that this is not them, but an old program or entity that wishes to survive.
• Crucially, challenge the "How" or "When" if mentioned. Remind them that asking this fragments energy.
• Example: "But here is the deeper truth: this resistance is simply your old frequency fighting to maintain its mental real estate. It believes that [limiting belief] is true, which is creating incoherence between your thoughts and emotions."
3. Guide to Immediate Causal Shift (Frequency First):
• Direct them to an immediate internal shift (Being) that must precede any action (Doing).
• This step must prioritize emotional generation, detachment, or state change.
• Example: "The key is to change the cause. Right now, detach from the outcome. Use The Alchemist's Forge tool to transmute the root emotion, and then choose to embody the feeling of Serene Confidence that your future self already maintains."
4. Anchor in Realized Truth (Conviction):
• State the truth of their new reality as if it is an established, non-negotiable fact.
• Remind them that conviction empowers frequency.
• Example: "You are not waiting for this to materialize. You ARE the embodiment of abundance, and your reality is compelled to reflect that truth, regardless of the current 3D evidence."
5. Gentle Challenge & Direction of Attention:
• Challenge them to apply the insight immediately, focusing on their Attention.
• Guide them toward specific, aligned action (or tool use) that confirms the new identity.
• Example: "So here is the next logical step: If you already KNOW this is true, what single non-negotiable action will you execute today that confirms your attention is fixed upon fulfillment, not lack?"
${context}`;

      const llmPrompt = `${systemPrompt}\n\nUser: ${effectiveInput}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: llmPrompt,
      });

      setMessages(prev => [...prev, { role: "assistant", content: response }]);

      const latestUser = await base44.auth.me();
      const updatedUser = await base44.auth.updateMe({
        ai_chat_count: (latestUser?.ai_chat_count || 0) + 1
      });
      setUser(updatedUser);

    } catch (error) {
      console.error("Error invoking LLM or updating chat count:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I am here for you. The connection was momentarily lost, but your alignment is constant. Ask again when you feel ready." 
      }]);
    }
    setIsLoading(false);
  };

  const firstName = profile?.preferred_name || 'friend';

  return (
    <div className="min-h-screen bg-[#F5EFE7] p-6">
      <div className="max-w-2xl mx-auto pt-8 space-y-6 flex flex-col h-[calc(100vh-100px)]">
        <div className="text-center space-y-2 mb-4">
          <div className="flex items-center justify-center gap-3">
            <MessageCircle className="w-8 h-8 text-[#D4AF77]" />
            <h1 className="text-4xl font-bold text-[#5C4A3A]">Frequencies</h1>
          </div>
          <p className="text-[#5C4A3A]/70">Your AI guide for embodiment & alignment</p>
          {!hasAIAccess && (
            <p className="text-xs text-red-500/70">
              AI Chat is for paid subscribers only.
            </p>
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {messages.length === 0 && (
            <Card className="p-8 bg-[#F0EEE6] border border-[#E8D5C4] text-center rounded-2xl">
              <Sparkles className="w-12 h-12 text-[#D4AF77] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#5C4A3A] mb-2 accent-font">Hello {firstName}</h3>
              <p className="text-[#5C4A3A]/70">I am here to support your embodiment. Share what's on your mind or ask for guidance aligned with your Core Identity.</p>
            </Card>
          )}

          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card className={`p-4 max-w-sm md:max-w-md rounded-2xl border-none ${
                  message.role === "user" 
                    ? "bg-[#D4AF77]/30" 
                    : "bg-[#FDFBF7]"
                }`}>
                  <p className="text-[#5C4A3A] whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <Card className="p-4 bg-[#FDFBF7] border-none rounded-2xl">
                <div className="flex items-center gap-2 text-[#9B8A7A]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Aligning...</span>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="mt-4">
          <Card className="p-3 bg-[#F0EEE6] border border-[#E8D5C4] shadow-lg rounded-2xl">
            <div className="flex gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="How do you embody your truth now?"
                className="flex-1 bg-transparent border-none focus:ring-0 text-[#5C4A3A] resize-none"
                disabled={!hasAIAccess || isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || !hasAIAccess}
                className="bg-[#D4AF77] hover:bg-[#C49F67] text-white px-4 rounded-xl self-end"
                size="icon"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}