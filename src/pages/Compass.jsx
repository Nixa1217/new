
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Moon, Eye, Calendar, Target, Edit, Sun, BookOpen, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SubscriptionGuard from "../components/SubscriptionGuard";
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Compass() {
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        window.location.href = "/";
        return null;
      }
    },
    staleTime: Infinity,
  });

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0] || null;
    },
    enabled: !!user,
  });

  const { data: latestDaily, refetch: refetchDaily } = useQuery({
    queryKey: ['latestDaily', user?.email],
    queryFn: async () => {
      const reflections = await base44.entities.DailyReflection.filter({ created_by: user?.email }, '-date', 1);
      return reflections[0] || null;
    },
    enabled: !!user,
  });

  const { data: latestWeekly, refetch: refetchWeekly } = useQuery({
    queryKey: ['latestWeekly', user?.email],
    queryFn: async () => {
      const reflections = await base44.entities.WeeklyReflection.filter({ created_by: user?.email }, '-week_start_date', 1);
      return reflections[0] || null;
    },
    enabled: !!user,
  });

  const { data: latestMorning } = useQuery({
    queryKey: ['latestMorning', user?.email],
    queryFn: async () => {
      const reflections = await base44.entities.MorningReflection.filter({ created_by: user?.email }, '-date', 1);
      return reflections[0] || null;
    },
    enabled: !!user
  });

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F5EFE7] flex items-center justify-center">
        <div className="text-[#D4AF77] text-lg">Loading...</div>
      </div>
    );
  }

  const generateSubliminals = () => {
    const statements = [];
    
    if (profile?.identity_summary) {
      statements.push(profile.identity_summary);
    }
    
    if (profile?.life_purpose_summary) {
      statements.push(profile.life_purpose_summary);
    }
    
    return statements.filter(s => s && s.length > 3);
  };

  const subliminals = generateSubliminals();

  const rituals = [
    {
      title: "Morning Embodiment",
      subtitle: "Set your frequency for the day",
      icon: Sun,
      color: "from-[#F0EEE6] to-[#E8D5C4]",
      link: "MorningEmbodiment",
      lastCompleted: latestMorning?.date
    },
    {
      title: "Evening Alignment",
      subtitle: "Nightly state audit & tomorrow's embodiment",
      icon: Moon,
      color: "from-[#E8D5C4]/40 to-[#D4AF77]/20",
      link: "EveningAlignment",
      lastCompleted: latestDaily?.date
    },
    {
      title: "Core Identity",
      subtitle: "Frequency design & timeline blueprint",
      icon: Eye,
      color: "from-[#F0EEE6] to-[#E8D5C4]",
      link: "CoreIdentity",
      lastCompleted: profile?.updated_date
    },
    {
      title: "Weekly Recalibration",
      subtitle: "Realignment & momentum reset",
      icon: Calendar,
      color: "from-[#E8D5C4]/40 to-[#D4AF77]/20",
      link: "WeeklyRecalibration",
      lastCompleted: latestWeekly?.week_start_date
    },
    {
      title: "Daily Journal",
      subtitle: "Reflect, process, integrate",
      icon: BookOpen,
      color: "from-[#F0EEE6] to-[#E8D5C4]",
      link: "DailyJournal",
      lastCompleted: null
    },
  ];

  const firstName = profile?.preferred_name || 'friend';

  return (
    <SubscriptionGuard user={user}>
      <div className="min-h-screen bg-[#F5EFE7] p-6 relative">
        <div className="max-w-2xl mx-auto space-y-8 pt-8 pb-32">
          {/* Help Icon in top-left */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 text-[#5C4A3A]/60 hover:text-[#5C4A3A]"
              >
                <HelpCircle className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#FDFBF7] border-[#E8D5C4] max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#5C4A3A]">WELCOME TO ALIGN</DialogTitle>
                <DialogDescription className="text-[#5C4A3A]/80 space-y-6 pt-4 text-left">
                  <p>
                    This page is your <strong>compass</strong> - your central navigation and guidance for using the app effectively. Everything inside Align is designed to help you <strong>think, act, and live as your future self</strong> until your reality matches your identity.
                  </p>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[#5C4A3A]">TECHNICAL NOTES</h3>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                      <li><strong>Change your name</strong> in the Settings page - this updates how the app speaks to you</li>
                      <li>
                        <strong>Add to Home Screen:</strong>
                        <ul className="list-disc list-inside pl-6 mt-1 space-y-1">
                          <li><strong>Android:</strong> tap browser ⋮ → Add to Home Screen</li>
                          <li><strong>iOS (Safari):</strong> tap the share icon → Add to Home Screen</li>
                        </ul>
                        <p className="pl-6 text-sm mt-1">This makes the app open like a native app with one tap.</p>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[#5C4A3A]">FOR FIRST-TIME USERS</h3>
                    <p className="text-[#5C4A3A]">
                      To get the most out of Align, follow this setup sequence:
                    </p>
                    <ol className="list-decimal list-inside pl-2 space-y-2">
                      <li>
                        <strong>Complete Core Identity</strong> - This is your foundation. It defines who you are becoming, your purpose, and your vision. Everything else in the app builds on this.
                      </li>
                      <li>
                        <strong>Complete Weekly Recalibration</strong> - This sets your alignment for the week and establishes your physical inputs and target outcomes.
                      </li>
                      <li>
                        <strong>Begin Daily Rituals</strong> - Once your Core Identity and Weekly focus are set, start your Morning Embodiment and Evening Alignment practices.
                      </li>
                    </ol>
                    <p className="text-sm text-[#5C4A3A]/70 mt-2 pl-2">
                      💡 <em>Think of it this way: Core Identity = WHO you are, Weekly Recalibration = WHERE you're going this week, Daily Rituals = HOW you stay aligned.</em>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[#5C4A3A]">HOW TO USE THIS APP DAILY</h3>
                    
                    <div>
                      <p className="font-semibold text-[#5C4A3A]">Morning (3-5 minutes)</p>
                      <ol className="list-decimal list-inside pl-2 space-y-1">
                        <li>Read your <strong>Identity Portal</strong></li>
                        <li>Complete the <strong>Morning Embodiment</strong></li>
                        <li>Begin your day acting as your future self</li>
                      </ol>
                    </div>

                    <div>
                      <p className="font-semibold text-[#5C4A3A]">During the Day (as needed)</p>
                      <ul className="list-disc list-inside pl-2 space-y-1">
                        <li>Use <strong>State Shift</strong> (floating orb) anytime you feel off-track</li>
                        <li>Write in your <strong>Journal</strong> if emotions or insights come up</li>
                        <li>Revisit the <strong>Portal</strong> or <strong>Vision Board</strong> for clarity</li>
                        <li>Use <strong>Vault tools</strong> when stuck: Flow Command (procrastination), Goal Action Generator (planning), 7 Layers Deep (clarity), Alchemist's Forge (limiting beliefs)</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-[#5C4A3A]">Evening (3-5 minutes)</p>
                      <ol className="list-decimal list-inside pl-2 space-y-1">
                        <li>Complete the <strong>Evening Alignment</strong></li>
                        <li>Close the day with awareness and correction</li>
                      </ol>
                    </div>

                    <div>
                      <p className="font-semibold text-[#5C4A3A]">Weekly</p>
                      <ul className="list-disc list-inside pl-2">
                        <li>Complete the <strong>Weekly Recalibration</strong> to zoom out and realign</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-[#5C4A3A]">Monthly or when evolving</p>
                      <ul className="list-disc list-inside pl-2">
                        <li>Update your <strong>Vision Board</strong> and <strong>Core Identity</strong></li>
                        <li>Regenerate your <strong>Identity Portal</strong> Master Affirmation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[#5C4A3A]">FEATURE GUIDE (what each section is for)</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-[#5C4A3A]">Core Identity - your frequency blueprint</p>
                        <p className="text-sm pl-2">The foundation of everything. Defines who you are becoming, your life purpose, your limitless vision, perfect day, and material anchors. Complete this FIRST.</p>
                      </div>

                      <div>
                        <p className="font-semibold text-[#5C4A3A]">Identity Portal - your daily alignment anchor</p>
                        <p className="text-sm pl-2">AI-generated Master Affirmation script based on your Core Identity. Read it daily morning and night. It programs your subconscious and keeps you on track.</p>
                      </div>

                      <div>
                        <p className="font-semibold text-[#5C4A3A]">Vision Board - emotional clarity & desire embodiment</p>
                        <p className="text-sm pl-2">Pictures, plans, people, lifestyle - all in one place. Feel it as now, not "one day." Embody the primary emotion of your desired reality.</p>
                      </div>

                      <div>
                        <p className="font-semibold text-[#5C4A3A]">Morning Embodiment - set your frequency before external influence</p>
                        <p className="text-sm pl-2">Set an elevated emotional state BEFORE the external environment influences you. The goal is to channel a new frequency out of faith, not fear. Based on the 545 Method (Stillness, Surrender, Frequency Dial, Action Alignment, Transmutation).</p>
                      </div>

                      <div>
                        <p className="text-sm pl-2">Reflect on today, transmute resistance, and set tomorrow's frequency. Close loops so you don't repeat the same mistakes.</p>
                      </div>

                      <div>
                        <p className="font-semibold text-[#5C4A3A]">Weekly Recalibration - zoom-out perspective</p>
                        <p className="text-sm pl-2">Audit your attention, identify what to surrender, define physical inputs, and set your target outcome for the week. Complete this SECOND (after Core Identity).</p>
                      </div>

                      <div>
                        <p className="font-semibold text-[#5C4A3A]">Journal - daily emotional and mental expression</p>
                        <p className="text-sm pl-2">Write openly throughout the day. Autosaves. At midnight it locks and moves to History for reflection.</p>
                      </div>

                      <div>
                        <p className="font-semibold text-[#5C4A3A]">State Shift - instant emotional reset (floating orb)</p>
                        <p className="text-sm pl-2">7-step impulse mastery process. Use when anxious, overwhelmed, distracted, or misaligned. Transmute low-frequency emotions instantly.</p>
                      </div>

                      <div>
                        <p className="font-semibold text-[#5C4A3A]">Vault - long-form growth tools</p>
                        <div className="text-sm pl-2 space-y-1">
                          <p><strong>Goal Action Generator:</strong> input a goal and generate up to 100 possible actions</p>
                          <p><strong>7 Layers Deep:</strong> ask "why" seven times to find your real desire or root problem</p>
                          <p><strong>Alchemist's Forge:</strong> transmute limiting beliefs by identifying root emotions and rewriting with opposite frequency</p>
                          <p><strong>Flow Command:</strong> overcome procrastination instantly by establishing alignment lock before action</p>
                          <p><strong>Meditations & Courses:</strong> coming soon</p>
                        </div>
                      </div>

                      <div>
                        <p className="font-semibold text-[#5C4A3A]">Frequencies AI - your consciousness coach</p>
                        <p className="text-sm pl-2">Trained on Neville Goddard, Dr. Joe Dispenza, Vadim Zeland, Joseph Murphy, and more. Ask questions, get strategy, mindset support, or emotional regulation help. Available for paid subscribers (150 chats/month).</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 text-center">
                    <p className="text-lg font-semibold text-[#D4AF77]">✨ REMEMBER</p>
                    <p className="text-[#5C4A3A] mt-2">
                      Frequency is the Causal Realm. Reality is the Effect.<br />
                      Identity first. Action second. Reality third.<br />
                      If you stay aligned daily, results become inevitable.
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <h1 className="text-5xl font-bold text-[#5C4A3A] tracking-wide">
              AS WITHIN, SO WITHOUT
            </h1>
            <p className="text-[#5C4A3A]/60 text-sm max-w-md mx-auto leading-relaxed">
              The Mind is the Cause. Reality is the Effect.
            </p>
          </motion.div>

          {subliminals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-[#D4AF77]/20 to-[#E8D5C4]/40 border-2 border-[#D4AF77]/40 shadow-lg rounded-2xl">
                <h3 className="text-sm font-semibold text-[#5C4A3A]/70 uppercase tracking-wider mb-4 text-center">Your Current Frequency</h3>
                <div className="space-y-3">
                  {subliminals.map((statement, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="text-xl font-medium text-[#5C4A3A] text-center leading-relaxed accent-font"
                    >
                      {statement}
                    </motion.p>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          <div className="space-y-4">
            {rituals.map((ritual, index) => (
              <motion.div
                key={ritual.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Link to={createPageUrl(ritual.link)}>
                  <Card className={`p-6 bg-gradient-to-br ${ritual.color} border border-[#E8D5C4] shadow-md hover:shadow-xl transition-all duration-400 hover:scale-[1.02] cursor-pointer rounded-2xl`}>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#FDFBF7] flex items-center justify-center shadow-sm">
                        <ritual.icon className="w-8 h-8 text-[#D4AF77]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#5C4A3A] accent-font">
                          {ritual.title}
                        </h3>
                        <p className="text-sm text-[#5C4A3A]/70 mt-1">
                          {ritual.subtitle}
                        </p>
                        {ritual.lastCompleted && (
                          <p className="text-xs text-[#D4AF77] mt-1">
                            Last: {format(new Date(ritual.lastCompleted), 'MMM d')}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Card className="p-6 bg-[#F0EEE6] border-2 border-[#D4AF77]/30 shadow-lg rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-[#D4AF77]" />
                  <h2 className="text-2xl font-bold text-[#5C4A3A] accent-font">
                    Your Core Identity
                  </h2>
                </div>
                {profile && (
                  <Link to={createPageUrl("CoreIdentity")}>
                    <Button variant="ghost" size="icon" className="text-[#D4AF77] hover:bg-[#D4AF77]/10">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
              
              {profile ? (
                <div className="space-y-4">
                  {latestDaily && (
                    <div className="bg-[#FDFBF7] rounded-xl border border-[#E8D5C4] p-4">
                      <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-2 font-semibold">Today's Alignment</p>
                      <div className="space-y-2">
                        {latestDaily.tomorrow_frequency_line && (
                          <div>
                            <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">Frequency Line</p>
                            <p className="text-[#5C4A3A] text-lg font-medium">{latestDaily.tomorrow_frequency_line}</p>
                          </div>
                        )}
                        {latestDaily.tomorrow_actions?.filter(a => a).length > 0 && (
                          <div>
                            <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">Today's Actions</p>
                            {latestDaily.tomorrow_actions.filter(a => a).map((action, index) => (
                              <p key={index} className="text-[#5C4A3A] text-sm">• {action}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {latestWeekly && (
                    <div className="bg-[#FDFBF7] rounded-xl border border-[#E8D5C4] p-4">
                      <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-2 font-semibold">This Week's Focus</p>
                      <div className="space-y-2">
                        {latestWeekly.physical_inputs?.filter(i => i).length > 0 && (
                          <div>
                            <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">Physical Inputs</p>
                            {latestWeekly.physical_inputs.filter(i => i).map((input, index) => (
                              <p key={index} className="text-[#5C4A3A] text-sm">• {input}</p>
                            ))}
                          </div>
                        )}
                        {latestWeekly.target_outcome && (
                          <div>
                            <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">Target Outcome</p>
                            <p className="text-[#5C4A3A] text-sm">{latestWeekly.target_outcome}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-[#FDFBF7] rounded-xl border border-[#E8D5C4] p-4">
                    <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-2 font-semibold">What You're Building</p>
                    <div className="space-y-3">
                      {profile.yearly_goal && (
                        <div>
                          <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">This Year</p>
                          <p className="text-[#5C4A3A] text-lg font-medium">{profile.yearly_goal}</p>
                        </div>
                      )}
                      {profile.monthly_goal && (
                        <div>
                          <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">This Month</p>
                          <p className="text-[#5C4A3A] text-lg font-medium">{profile.monthly_goal}</p>
                        </div>
                      )}
                      {profile.material_desires && (
                        <div>
                          <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">Material Anchors</p>
                          <p className="text-[#5C4A3A] leading-relaxed text-sm">{profile.material_desires}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#FDFBF7] rounded-xl border border-[#E8D5C4] p-4">
                    <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-2 font-semibold">Who You Are</p>
                    <div className="space-y-3">
                      {profile.identity_story && (
                        <div>
                          <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">Identity</p>
                          <p className="text-[#5C4A3A] leading-relaxed">{profile.identity_story}</p>
                        </div>
                      )}
                      {profile.life_purpose && (
                        <div>
                          <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">Life Purpose</p>
                          <p className="text-[#5C4A3A] leading-relaxed">{profile.life_purpose}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#FDFBF7] rounded-xl border border-[#E8D5C4] p-4">
                    <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-2 font-semibold">Your Vision</p>
                    <div className="space-y-3">
                      {profile.limitless_vision && (
                        <div>
                          <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">Limitless Vision</p>
                          <p className="text-[#5C4A3A] leading-relaxed">{profile.limitless_vision}</p>
                        </div>
                      )}
                      {profile.perfect_day && (
                        <div>
                          <p className="text-xs text-[#5C4A3A]/60 uppercase tracking-wider mb-1">Perfect Day</p>
                          <p className="text-[#5C4A3A] leading-relaxed">{profile.perfect_day}</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-[#5C4A3A]/60 mb-4">
                    You haven't set your Frequency Anchor yet
                  </p>
                  <Link to={createPageUrl("CoreIdentity")}>
                    <Button className="bg-[#D4AF77] hover:bg-[#C49F67] text-white rounded-xl">
                      Create Your Core Identity
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </SubscriptionGuard>
  );
}

const checkSubscriptionAccess = (user) => {
  if (!user) return { hasAccess: true, daysLeft: null, expirationDate: null };

  const now = new Date();
  const subscriptionType = user.subscription_type || "free";

  if (subscriptionType === "yearly") {
    const subscriptionStart = user.subscription_start_date ? new Date(user.subscription_start_date) : now;
    const expirationDate = new Date(subscriptionStart);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    const hasAccess = now < expirationDate;
    const daysLeft = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));
    return { hasAccess, daysLeft, expirationDate };
  }

  const firstLogin = user.first_login_date ? new Date(user.first_login_date) : now;
  const subscriptionStart = user.subscription_start_date ? new Date(user.subscription_start_date) : firstLogin;

  let expirationDate;

  switch (subscriptionType) {
    case "free":
      expirationDate = new Date(firstLogin);
      expirationDate.setDate(expirationDate.getDate() + 1);
      break;
    case "weekly":
      expirationDate = new Date(subscriptionStart);
      expirationDate.setDate(expirationDate.getDate() + 7);
      break;
    case "monthly":
      expirationDate = new Date(subscriptionStart);
      expirationDate.setMonth(expirationDate.getMonth() + 1);
      break;
    default:
      expirationDate = new Date(firstLogin);
      expirationDate.setDate(expirationDate.getDate() + 1);
  }

  const hasAccess = now < expirationDate;
  const daysLeft = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));

  return { hasAccess, daysLeft, expirationDate };
};
