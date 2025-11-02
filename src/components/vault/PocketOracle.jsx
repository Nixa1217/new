import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

const prompts = {
  present: [
    "Where are you right now?",
    "What are you doing in this moment?",
    "Are you smiling?",
    "Take 3 deep breaths. How do you feel?",
  ],
  future: [
    "What would your future self do right now?",
    "Is this action aligned with your Core Identity?",
    "What frequency are you operating from?",
  ],
  evidence: [
    "Name one thing proving you're already shifting.",
    "What's one win from today, even a small one?",
    "What evidence shows your vision is forming?",
  ],
  empowerment: [
      "You are exactly where you need to be.",
      "Trust the timing of your life.",
      "You are safe in your power."
  ]
};

export default function PocketOracle() {
  const [prompt, setPrompt] = useState(null);
  const [showJournal, setShowJournal] = useState(false);

  const getNewPrompt = () => {
    const allPrompts = [...prompts.present, ...prompts.future, ...prompts.evidence, ...prompts.empowerment];
    const newPrompt = allPrompts[Math.floor(Math.random() * allPrompts.length)];
    setPrompt(newPrompt);
    setShowJournal(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-[#FDFBF7] border-[#E8D5C4] text-center">
        <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font mb-2">Pocket Oracle</h2>
        <p className="text-sm text-[#5C4A3A]/70 mb-6">Instant recalibration for when you're on the go.</p>

        <div className="min-h-[150px] flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={prompt}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {prompt ? (
                <p className="text-2xl text-[#5C4A3A] font-medium leading-relaxed">
                  {prompt}
                </p>
              ) : (
                <p className="text-lg text-[#5C4A3A]/60">Tap below to receive guidance.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <Button onClick={getNewPrompt} className="bg-[#D4AF77] hover:bg-[#C49F67] px-8 py-4 rounded-xl">
          Activate Oracle
        </Button>
      </Card>
      
      {prompt && (
        <Card className="p-4 bg-[#F0EEE6] border-[#E8D5C4]">
            {!showJournal ? (
                 <Button onClick={() => setShowJournal(true)} variant="ghost" className="w-full text-[#5C4A3A]/80">
                    Journal on this
                </Button>
            ) : (
                <div className="space-y-3">
                    <Textarea placeholder="Your thoughts..." className="bg-white min-h-[100px]" />
                    <div className="flex justify-end">
                        <Button onClick={() => setShowJournal(false)} variant="ghost">Close</Button>
                    </div>
                </div>
            )}
        </Card>
      )}
    </div>
  );
}