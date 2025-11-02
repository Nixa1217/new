import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, HelpCircle, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, startOfDay, isToday } from "date-fns";

const WRITING_PROMPTS = [
  "What's one thing that went right today that you almost didn't notice?",
  "Who made your life easier today without you thanking them?",
  "What pattern showed up again today?",
  "When did you feel most like your future self today?",
  "What's one small thing you did today that your past self would be proud of?",
  "What proof did you see today that your vision is forming?",
  "What did you avoid today?",
  "What are you pretending not to know right now?",
  "If today repeated 365 times, where would you be in a year?",
  "What would the highest version of you have done differently today?",
  "What's one thing you need to let go of from today?",
  "What did today teach you about who you're becoming?"
];

export default function DailyJournal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [view, setView] = useState("history");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [expandedEntry, setExpandedEntry] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => await base44.auth.me(),
    staleTime: Infinity
  });

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0] || null;
    },
    enabled: !!user
  });

  const todayDate = format(new Date(), "yyyy-MM-dd");

  const { data: todayEntry, refetch: refetchToday } = useQuery({
    queryKey: ['todayJournalEntry', user?.email, todayDate],
    queryFn: async () => {
      const entries = await base44.entities.JournalEntry.filter({ 
        created_by: user?.email,
        date: todayDate
      });
      return entries[0] || null;
    },
    enabled: !!user
  });

  const { data: pastEntries = [] } = useQuery({
    queryKey: ['journalHistory', user?.email],
    queryFn: async () => {
      const entries = await base44.entities.JournalEntry.filter({ created_by: user?.email }, '-date');
      return entries.filter(entry => entry.date !== todayDate);
    },
    enabled: !!user
  });

  const createOrUpdateEntry = useMutation({
    mutationFn: async (data) => {
      if (todayEntry) {
        return base44.entities.JournalEntry.update(todayEntry.id, data);
      }
      return base44.entities.JournalEntry.create({
        ...data,
        date: todayDate,
        is_locked: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todayJournalEntry']);
      queryClient.invalidateQueries(['journalHistory']);
    }
  });

  useEffect(() => {
    if (todayEntry && view === "today") {
      setTitle(todayEntry.title || "");
      setContent(todayEntry.content || "");
    }
  }, [todayEntry, view]);

  useEffect(() => {
    if (view !== "today") return;

    const autoSave = setInterval(() => {
      if (content.trim()) {
        createOrUpdateEntry.mutate({ title, content });
      }
    }, 5000);

    return () => clearInterval(autoSave);
  }, [view, title, content]);

  const handleOpenToday = () => {
    setView("today");
    if (todayEntry) {
      setTitle(todayEntry.title || "");
      setContent(todayEntry.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  };

  const handleGetPrompt = () => {
    const randomPrompt = WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)];
    setCurrentPrompt(randomPrompt);
  };

  const handleBackFromToday = () => {
    if (content.trim()) {
      createOrUpdateEntry.mutate({ title, content });
    }
    setView("history");
  };

  const toggleExpand = (id) => {
    setExpandedEntry(expandedEntry === id ? null : id);
  };

  const firstName = profile?.preferred_name || 'friend';

  if (view === "today") {
    return (
      <div className="min-h-screen bg-[#F5EFE7] p-6">
        <div className="max-w-3xl mx-auto pt-8 space-y-6">
          <Button onClick={handleBackFromToday} variant="ghost" className="text-[#5C4A3A]/60">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to History
          </Button>

          <Card className="p-6 bg-[#F0EEE6] border-[#E8D5C4]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#5C4A3A]/70 uppercase tracking-wider">
                {format(new Date(), "MMMM d, yyyy")}
              </p>
            </div>
            
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title (optional)"
              className="bg-[#FDFBF7] border-[#E8D5C4] mb-4"
            />

            {currentPrompt && (
              <Card className="p-4 bg-[#D4AF77]/10 border-[#D4AF77]/40 mb-4">
                <p className="text-sm text-[#5C4A3A] italic">{currentPrompt}</p>
              </Card>
            )}

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write freely..."
              className="bg-[#FDFBF7] border-[#E8D5C4] min-h-[400px] resize-none"
            />

            <Button
              onClick={handleGetPrompt}
              variant="outline"
              className="w-full mt-4 border-[#D4AF77] text-[#D4AF77] hover:bg-[#D4AF77]/10"
            >
              <Lightbulb className="w-5 h-5 mr-2" /> Writing Prompt
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE7] p-6">
      <div className="max-w-3xl mx-auto pt-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button onClick={() => navigate(createPageUrl("Compass"))} variant="ghost" className="text-[#5C4A3A]/60">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-[#5C4A3A] accent-font">Daily Journal</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#D4AF77]">
                  <HelpCircle className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#F0EEE6] max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#5C4A3A]">How to Use Daily Journal</DialogTitle>
                  <DialogDescription className="text-[#5C4A3A]/70 space-y-4 text-left">
                    <p>This is your private space to reflect, process emotions, capture insights, and integrate your day.</p>
                    
                    <p>Write freely. No structure. No judgment.</p>
                    
                    <p className="font-semibold text-[#5C4A3A]">You can write about:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Wins and lessons from today</li>
                      <li>Emotions you're processing</li>
                      <li>Insights that emerged</li>
                      <li>Gratitude</li>
                      <li>Questions on your mind</li>
                      <li>Whatever needs to come out</li>
                    </ul>
                    
                    <p>If you need inspiration, tap the "Writing Prompt" button for a random idea.</p>
                    
                    <p className="font-semibold text-[#5C4A3A]">Rules:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>One journal entry per day</li>
                      <li>The entry auto-saves while you write</li>
                      <li>Entry moves to history automatically at end of day</li>
                      <li>Once in history, entries are read-only</li>
                      <li>Entries are private and never shared</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Button
          onClick={handleOpenToday}
          className="w-full bg-[#D4AF77] hover:bg-[#C49F67] text-white py-6 text-lg"
        >
          {todayEntry ? "Continue Today's Entry" : "+ Today's Entry"}
        </Button>

        {pastEntries.length === 0 ? (
          <Card className="p-12 bg-[#F0EEE6] border-[#E8D5C4] text-center">
            <p className="text-[#5C4A3A]/70">No past entries yet. Start your first journal entry.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pastEntries.map((entry) => (
              <Card key={entry.id} className="p-4 bg-[#F0EEE6] border-[#E8D5C4]">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(entry.id)}
                >
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-[#5C4A3A] accent-font">
                      📓 {format(new Date(entry.date), "MMMM d, yyyy")}
                    </p>
                    {entry.title && (
                      <p className="text-sm text-[#5C4A3A] font-medium mt-1">"{entry.title}"</p>
                    )}
                    <p className="text-sm text-[#5C4A3A]/60 mt-1">
                      {entry.content.substring(0, 50)}...
                    </p>
                  </div>
                  {expandedEntry === entry.id ? (
                    <ChevronUp className="w-5 h-5 text-[#5C4A3A]/60" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#5C4A3A]/60" />
                  )}
                </div>

                <AnimatePresence>
                  {expandedEntry === entry.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-[#E8D5C4]"
                    >
                      <div className="bg-[#FDFBF7] p-4 rounded-xl">
                        <p className="text-[#5C4A3A] whitespace-pre-wrap">{entry.content}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}