import React from 'react';
import { Card } from '@/components/ui/card';
import { BookOpen, Image, Scissors, Sparkles } from 'lucide-react';

export default function VisionBoardGuide() {
  return (
    <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] space-y-8">
      <div className="text-center">
        <BookOpen className="w-12 h-12 text-[#D4AF77] mx-auto mb-4" />
        <h2 className="text-3xl font-semibold text-[#5C4A3A] accent-font mb-2">Vision Board Guide</h2>
        <p className="text-[#5C4A3A]/70">Create a visual representation of your desired reality</p>
      </div>

      <div className="space-y-6">
        <div className="bg-[#F0EEE6] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#D4AF77] flex items-center justify-center flex-shrink-0 text-white font-bold">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#5C4A3A] mb-2">Gather Your Materials</h3>
              <p className="text-[#5C4A3A]/70 leading-relaxed">
                You'll need: a large poster board or corkboard, magazines, scissors, glue stick, markers, and any personal photos or printed images that resonate with your vision.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#F0EEE6] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#D4AF77] flex items-center justify-center flex-shrink-0 text-white font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#5C4A3A] mb-2">Review Your Core Identity</h3>
              <p className="text-[#5C4A3A]/70 leading-relaxed">
                Go back to your Core Identity, yearly goal, monthly milestone, and material desires. These will guide what images and words to choose.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#F0EEE6] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#D4AF77] flex items-center justify-center flex-shrink-0 text-white font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#5C4A3A] mb-2">Select Images That Feel Right</h3>
              <p className="text-[#5C4A3A]/70 leading-relaxed">
                Don't overthink it. Cut out images, words, and phrases that create an emotional response in your body. If it makes you feel expansive, abundant, peaceful, or excited — it belongs on your board.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#F0EEE6] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#D4AF77] flex items-center justify-center flex-shrink-0 text-white font-bold">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#5C4A3A] mb-2">Arrange & Glue</h3>
              <p className="text-[#5C4A3A]/70 leading-relaxed">
                Play with the layout before gluing anything down. Place your most important goal in the center. Organize by category (wealth, relationships, health, lifestyle) or let it flow intuitively.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#F0EEE6] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#D4AF77] flex items-center justify-center flex-shrink-0 text-white font-bold">
              5
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#5C4A3A] mb-2">Display & Immerse Daily</h3>
              <p className="text-[#5C4A3A]/70 leading-relaxed">
                Place your vision board somewhere you'll see it every day — bedroom wall, office, or bathroom mirror. Spend 1-2 minutes each morning feeling into the reality it represents. This is not wishful thinking. This is frequency alignment.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#D4AF77]/10 rounded-xl p-6 border-2 border-[#D4AF77]/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-[#D4AF77] flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-[#5C4A3A] mb-2">Pro Tip</h4>
              <p className="text-[#5C4A3A]/80 leading-relaxed">
                Add a photo of yourself at the center of the board. This anchors the vision to YOU specifically. Write "I AM" statements around the edges to reinforce your identity shift.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}