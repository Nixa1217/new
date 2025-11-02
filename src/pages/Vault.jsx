import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, ShieldQuestion, Headphones, GraduationCap, Target, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoalActionGenerator from "../components/vault/GoalActionGenerator";
import SevenLayersDeep from "../components/vault/SevenLayersDeep";
import AlchemistForge from "../components/vault/AlchemistForge";
import FlowCommand from "../components/vault/FlowCommand";

const tools = [
  { id: "goal-action", title: "Goal Action Generator", subtitle: "Generate massive action lists", icon: Target },
  { id: "seven-layers", title: "Seven Layers Deep", subtitle: "Find your core truth", icon: ShieldQuestion },
  { id: "alchemist-forge", title: "The Alchemist's Forge", subtitle: "Transmute limiting beliefs", icon: Flame },
  { id: "flow-command", title: "Flow Command", subtitle: "Overcome procrastination instantly", icon: Zap },
  { id: "meditations", title: "Meditations", subtitle: "Guided state-shifting audio", icon: Headphones },
  { id: "courses", title: "Courses & Lessons", subtitle: "Deep dive training modules", icon: GraduationCap },
];

export default function Vault() {
  const [activeTool, setActiveTool] = useState(null);

  const handleToolClick = (tool) => {
    setActiveTool(tool.id);
  };

  const renderToolContent = () => {
    switch (activeTool) {
      case "goal-action":
        return <GoalActionGenerator />;
      case "seven-layers":
        return <SevenLayersDeep />;
      case "alchemist-forge":
        return <AlchemistForge />;
      case "flow-command":
        return <FlowCommand />;
      case "meditations":
      case "courses":
        return (
          <Card className="p-8 bg-[#FDFBF7] border-[#E8D5C4] text-center">
            <Sparkles className="w-12 h-12 text-[#D4AF77] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#5C4A3A] mb-2">Coming Soon</h3>
            <p className="text-[#5C4A3A]/70 leading-relaxed">
              We're crafting something powerful for you. Stay aligned.
            </p>
          </Card>
        );
      default:
        return (
          <div className="space-y-4">
            {tools.map((tool) => (
              <Card
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="p-6 bg-[#F0EEE6] border border-[#E8D5C4] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#FDFBF7] flex items-center justify-center shadow-sm">
                    <tool.icon className="w-8 h-8 text-[#D4AF77]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#5C4A3A] accent-font flex items-center gap-2">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-[#5C4A3A]/70 mt-1">{tool.subtitle}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE7] p-6">
      <div className="max-w-2xl mx-auto pt-8 space-y-6">
        {!activeTool ? (
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-bold text-[#5C4A3A]">The Vault</h1>
            <p className="text-[#5C4A3A]/70">State-shifting tools & resources</p>
          </div>
        ) : (
          <Button onClick={() => setActiveTool(null)} variant="ghost" className="text-[#5C4A3A]/70 mb-4">
            ← Back to All Tools
          </Button>
        )}
        {renderToolContent()}
      </div>
    </div>
  );
}