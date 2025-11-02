
import React, { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, Eye, Calendar, Check, Brain, Zap, Heart, MessageCircle, TrendingUp, Book } from "lucide-react";
import { motion } from "framer-motion";

const WHOP_CHECKOUT_URLS = {
  weekly: "https://whop.com/checkout/plan_P747aCMPTM5ca?d2c=true",
  monthly: "https://whop.com/checkout/plan_D3EkmYUfCa4zZ?d2c=true",
  yearly: "https://whop.com/checkout/plan_4WK4zUpA2pHJj?d2c=true"
};

const checkSubscriptionAccess = (user) => {
  if (!user) return { hasAccess: false, isFirstTime: true };

  const now = new Date();
  const subscriptionType = user.subscription_type || "free";

  // Yearly always has access
  if (subscriptionType === "yearly") {
    const subscriptionStart = user.subscription_start_date ? new Date(user.subscription_start_date) : now;
    const expirationDate = new Date(subscriptionStart);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    const hasAccess = now < expirationDate;
    const daysLeft = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));
    return { hasAccess, daysLeft, expirationDate };
  }

  // Check first login date
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

export default function SubscriptionGuard({ children, user }) {
  useEffect(() => {
    const initializeUser = async () => {
      if (user && !user.first_login_date) {
        await base44.auth.updateMe({
          first_login_date: new Date().toISOString(),
          subscription_type: user.subscription_type || "free"
        });
      }
    };

    initializeUser();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5EFE7] flex items-center justify-center">
        <div className="text-[#D4AF77] text-lg">Loading...</div>
      </div>
    );
  }

  const { hasAccess, daysLeft } = checkSubscriptionAccess(user);

  const handleUpgradeClick = (plan) => {
    const checkoutUrl = `${WHOP_CHECKOUT_URLS[plan]}&email=${encodeURIComponent(user.email)}`;
    window.open(checkoutUrl, '_blank');
  };

  const scrollToOffers = () => {
    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // If no access, show ONLY the paywall - nothing else
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#F5EFE7] overflow-y-auto">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        `}</style>

        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <Sparkles className="w-10 h-10 text-[#D4AF77]" />
              <h1 className="text-3xl font-bold text-[#5C4A3A]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Align
              </h1>
            </div>
          </motion.div>

          {/* 1. Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-3 mb-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#5C4A3A] leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Your 24 Hours of Free Access Has Ended
            </h2>
            <p className="text-[#5C4A3A] text-lg md:text-xl leading-relaxed max-w-xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              You've started building the identity. You've felt the shift. You've seen what's possible.
            </p>
            <p className="text-[#5C4A3A] text-xl font-semibold pt-2" style={{ fontFamily: 'Lora, serif' }}>
              Now comes the choice:
            </p>
            <p className="text-[#5C4A3A]/80 text-base">
              Go back to who you were — or become who you're meant to be.
            </p>
          </motion.div>

          {/* 2. Pricing Section */}
          <motion.div
            id="pricing-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h3 className="text-2xl font-bold text-[#5C4A3A] mb-6 text-center" style={{ fontFamily: 'Lora, serif' }}>
              Choose Your Plan:
            </h3>
            <div className="space-y-4">
              {/* Yearly - Best Value */}
              <Card
                onClick={() => handleUpgradeClick('yearly')}
                className="p-6 bg-gradient-to-br from-[#D4AF77] to-[#C49F67] text-white border-2 border-[#D4AF77] hover:shadow-2xl transition-all cursor-pointer rounded-2xl relative transform hover:scale-[1.02]"
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2">
                  <span className="bg-[#5C4A3A] text-white text-[10px] md:text-xs font-bold px-2 md:px-4 py-1 md:py-1.5 rounded-full shadow-lg whitespace-nowrap">
                    ⭐ BEST VALUE - SAVE 55%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lora, serif' }}>Yearly</h3>
                    <p className="text-sm text-white/90 mb-2">Commit to the transformation</p>
                    <p className="text-xs text-white/80">One payment, full year access</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold">€39.99</p>
                    <p className="text-sm text-white/90">/year</p>
                    <p className="text-xs text-white/80 mt-1">€3.33/month</p>
                  </div>
                </div>
              </Card>

              {/* Monthly */}
              <Card
                onClick={() => handleUpgradeClick('monthly')}
                className="p-6 bg-[#FDFBF7] border-2 border-[#E8D5C4] hover:border-[#D4AF77] hover:shadow-lg transition-all cursor-pointer rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-[#5C4A3A] mb-1" style={{ fontFamily: 'Lora, serif' }}>Monthly</h3>
                    <p className="text-sm text-[#5C4A3A]/70">Full access, cancel anytime</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-[#5C4A3A]">€14.99</p>
                    <p className="text-sm text-[#5C4A3A]/70">/month</p>
                  </div>
                </div>
              </Card>

              {/* Weekly */}
              <Card
                onClick={() => handleUpgradeClick('weekly')}
                className="p-6 bg-[#FDFBF7] border-2 border-[#E8D5C4] hover:border-[#D4AF77] hover:shadow-lg transition-all cursor-pointer rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-[#5C4A3A] mb-1" style={{ fontFamily: 'Lora, serif' }}>Weekly</h3>
                    <p className="text-sm text-[#5C4A3A]/70">Flexibility to adjust as you go</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-[#5C4A3A]">€6.99</p>
                    <p className="text-sm text-[#5C4A3A]/70">/week</p>
                  </div>
                </div>
              </Card>
            </div>
            <p className="text-xs text-[#5C4A3A]/50 text-center mt-6">
              All plans include full access to all features and rituals
            </p>
          </motion.div>

          {/* 3. Future Pacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 bg-gradient-to-br from-[#D4AF77]/10 to-[#E8D5C4]/20 p-6 rounded-2xl border border-[#D4AF77]/30"
          >
            <h3 className="text-xl font-bold text-[#5C4A3A] mb-4 text-center" style={{ fontFamily: 'Lora, serif' }}>
              Imagine 90 Days From Now...
            </h3>
            <div className="space-y-3 text-[#5C4A3A]" style={{ fontFamily: 'Inter, sans-serif' }}>
              <p className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#D4AF77] mt-0.5 flex-shrink-0" />
                You wake up and your first thought isn't doubt — it's certainty
              </p>
              <p className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#D4AF77] mt-0.5 flex-shrink-0" />
                Your bank account reflects your new identity (not your old story)
              </p>
              <p className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#D4AF77] mt-0.5 flex-shrink-0" />
                People ask "What changed?" because your energy is magnetic
              </p>
              <p className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#D4AF77] mt-0.5 flex-shrink-0" />
                You don't "try" to manifest anymore — you just are
              </p>
              <p className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#D4AF77] mt-0.5 flex-shrink-0" />
                Looking back at today feels like looking at a stranger's life
              </p>
            </div>
          </motion.div>

          {/* 4. Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10 space-y-4"
          >
            <h3 className="text-2xl font-bold text-[#5C4A3A] mb-6 text-center" style={{ fontFamily: 'Lora, serif' }}>
              What Happens When You Align:
            </h3>
            {[
              { name: "Sarah, 29", quote: "I manifested $40K in 6 weeks. I didn't believe it would work this fast." },
              { name: "Mike, 34", quote: "My entire identity shifted. I went from anxious and stuck to calm and unstoppable." },
              { name: "Jessica, 26", quote: "I finally understand why manifestation wasn't working. Align fixed it in 3 weeks." }
            ].map((testimonial, index) => (
              <Card key={index} className="p-5 bg-[#FDFBF7] border border-[#E8D5C4] rounded-xl">
                <p className="text-[#5C4A3A] italic mb-2" style={{ fontFamily: 'Lora, serif' }}>
                  "{testimonial.quote}"
                </p>
                <p className="text-[#5C4A3A]/70 text-sm font-semibold">— {testimonial.name}</p>
              </Card>
            ))}
          </motion.div>

          {/* 5. What You Keep */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-10"
          >
            <h3 className="text-2xl font-bold text-[#5C4A3A] mb-6 text-center" style={{ fontFamily: 'Lora, serif' }}>
              What You Keep With Full Access:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Brain, text: "Core Identity Builder", sub: "The foundation of who you're becoming" },
                { icon: Zap, text: "Morning & Evening Embodiment", sub: "Daily rituals that lock in the new you" },
                { icon: Calendar, text: "Weekly Recalibration", sub: "Stay aligned as you evolve" },
                { icon: Heart, text: "Embodiment Mirror", sub: "Pure emotion work that shifts your frequency" },
                { icon: Eye, text: "Vision Portal", sub: "AI-generated affirmations in your exact vision" },
                { icon: Target, text: "The Vault", sub: "Meditations, shadow work, deep tools" },
                { icon: MessageCircle, text: "Frequencies AI", sub: "Trained on Neville, Dispenza, Zeland" },
                { icon: TrendingUp, text: "Momentum Tracker", sub: "See your progress build unstoppable streaks" },
                { icon: Book, text: "Daily Journal", sub: "Process, reflect, integrate" },
                { icon: Target, text: "Goal Action Generator", sub: "Turn vision into 100+ actionable steps" }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3 text-[#5C4A3A] bg-[#FDFBF7] p-4 rounded-xl border border-[#E8D5C4]">
                  <feature.icon className="w-5 h-5 text-[#D4AF77] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>{feature.text}</p>
                    <p className="text-sm text-[#5C4A3A]/70 mt-1">{feature.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 6. Button to scroll back to offers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-10"
          >
            <button
              onClick={scrollToOffers}
              className="bg-[#D4AF77] hover:bg-[#C49F67] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              Choose Your Plan
            </button>
          </motion.div>

          {/* 7. Final CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center space-y-4"
          >
            <p className="text-[#5C4A3A] text-lg font-semibold" style={{ fontFamily: 'Lora, serif' }}>
              The person you're becoming is waiting.
            </p>
            <p className="text-[#5C4A3A]/70">
              Don't make them wait any longer.
            </p>
            <div className="flex items-center justify-center gap-2 text-[#5C4A3A]/60 text-sm pt-4">
              <Check className="w-4 h-4 text-[#D4AF77]" />
              <span>No Commitment — Cancel Anytime</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // If they have access, just return children - NO banner here
  return children;
}

export { checkSubscriptionAccess };
