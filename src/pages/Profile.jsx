import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, LogOut, Settings, Mail, ExternalLink, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const WHOP_CHECKOUT_URLS = {
  weekly: "https://whop.com/checkout/plan_P747aCMPTM5ca?d2c=true",
  monthly: "https://whop.com/checkout/plan_D3EkmYUfCa4zZ?d2c=true",
  yearly: "https://whop.com/checkout/plan_4WK4zUpA2pHJj?d2c=true"
};

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [preferredName, setPreferredName] = useState("");

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => await base44.auth.me(),
    staleTime: 0,
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user) return null;
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0] || null;
    },
    enabled: !!user
  });

  useEffect(() => {
    if (profile) {
      setPreferredName(profile.preferred_name || "");
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: (updates) => {
      if (!user) throw new Error("User not authenticated.");

      if (profile) {
        return base44.entities.UserProfile.update(profile.id, { ...profile, ...updates });
      } else {
        return base44.entities.UserProfile.create({ ...updates, created_by: user.email });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile', user?.email]);
      alert("Settings updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      alert("Failed to update settings.");
    }
  });

  const handleNameChange = () => {
    if (preferredName.trim()) {
      updateProfileMutation.mutate({ preferred_name: preferredName });
    }
  };

  const handleUpgradeClick = (plan) => {
    const checkoutUrl = `${WHOP_CHECKOUT_URLS[plan]}&email=${encodeURIComponent(user.email)}`;
    window.open(checkoutUrl, '_blank');
  };

  const handleLogout = () => {
    queryClient.clear();
    base44.auth.logout(window.location.origin);
  };

  const handleManageSubscription = () => {
    window.open("https://whop.com/@me/settings/orders/", '_blank');
  };

  if (isLoadingUser || !user) {
    return (
      <div className="min-h-screen bg-[#F5EFE7] flex items-center justify-center">
        <p className="text-2xl font-semibold text-[#5C4A3A]">Loading...</p>
      </div>
    );
  }

  const subscriptionInfo = user ? checkSubscriptionAccess(user) : null;
  const currentPlan = user?.subscription_type || "free";

  return (
    <div className="min-h-screen bg-[#F5EFE7] p-6">
      <div className="max-w-2xl mx-auto pt-8 space-y-8">
        <div className="text-center space-y-2">
          <Settings className="w-12 h-12 text-[#D4AF77] mx-auto" />
          <h1 className="text-4xl font-bold text-[#5C4A3A]">Settings</h1>
          <p className="text-[#5C4A3A]/70">Manage your profile and preferences</p>
        </div>

        <Card className="p-6 bg-[#F0EEE6] border border-[#E8D5C4] shadow-md rounded-2xl">
          <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font mb-6">Profile</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-[#D4AF77] flex-shrink-0" />
              <Input
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                placeholder="What should we call you?"
                className="bg-[#FDFBF7] border-[#E8D5C4]"
              />
              <Button onClick={handleNameChange} size="sm" className="bg-[#D4AF77] hover:bg-[#C49F67]">Save</Button>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-[#D4AF77] flex-shrink-0" />
              <span className="text-[#5C4A3A]">{user?.email}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#F0EEE6] border border-[#E8D5C4] shadow-md rounded-2xl">
          <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font mb-4">Your Subscription</h2>
          
          {subscriptionInfo && (
            <div className="mb-6 p-4 bg-[#D4AF77]/10 rounded-xl">
              <p className="text-[#5C4A3A] font-medium">
                Current Plan: <span className="capitalize font-bold">{currentPlan}</span>
              </p>
              {subscriptionInfo.daysLeft !== null && (
                <p className="text-sm text-[#5C4A3A]/70 mt-1">
                  {subscriptionInfo.daysLeft} days remaining
                </p>
              )}
            </div>
          )}
          
          <p className="text-[#5C4A3A]/70 mb-6">Choose the subscription that works best for you</p>
          
          <div className="space-y-4">
            <Card className={`p-4 bg-[#FDFBF7] border-2 ${currentPlan === 'weekly' ? 'border-[#D4AF77]' : 'border-[#E8D5C4]'} hover:border-[#D4AF77] transition-all rounded-xl cursor-pointer`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#5C4A3A] flex items-center gap-2" style={{ fontFamily: 'Lora, serif' }}>
                    Weekly
                    {currentPlan === 'weekly' && <Check className="w-4 h-4 text-[#D4AF77]" />}
                  </h3>
                  <p className="text-sm text-[#5C4A3A]/60">€6.99 / week • Flexibility to adjust as you go</p>
                </div>
                {currentPlan !== 'weekly' && currentPlan !== 'monthly' && currentPlan !== 'yearly' && (
                  <Button
                    onClick={() => handleUpgradeClick('weekly')}
                    className="bg-[#D4AF77] hover:bg-[#C49F67] text-white"
                  >
                    Select <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                )}
                {currentPlan === 'monthly' && (
                  <Button
                    onClick={() => handleUpgradeClick('weekly')}
                    className="bg-[#D4AF77] hover:bg-[#C49F67] text-white"
                  >
                    Change <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </Card>

            <Card className={`p-4 bg-[#FDFBF7] border-2 ${currentPlan === 'monthly' ? 'border-[#D4AF77]' : 'border-[#E8D5C4]'} hover:border-[#D4AF77] transition-all rounded-xl cursor-pointer relative`}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#D4AF77] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#5C4A3A] flex items-center gap-2" style={{ fontFamily: 'Lora, serif' }}>
                    Monthly
                    {currentPlan === 'monthly' && <Check className="w-4 h-4 text-[#D4AF77]" />}
                  </h3>
                  <p className="text-sm text-[#5C4A3A]/60">€14.99 / month • Best value for regular practice</p>
                </div>
                {currentPlan !== 'monthly' && currentPlan !== 'yearly' && (
                  <Button
                    onClick={() => handleUpgradeClick('monthly')}
                    className="bg-[#D4AF77] hover:bg-[#C49F67] text-white"
                  >
                    Select <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </Card>

            <Card className={`p-4 bg-[#FDFBF7] border-2 ${currentPlan === 'yearly' ? 'border-[#D4AF77]' : 'border-[#E8D5C4]'} hover:border-[#D4AF77] transition-all rounded-xl cursor-pointer`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#5C4A3A] flex items-center gap-2" style={{ fontFamily: 'Lora, serif' }}>
                    Yearly
                    {currentPlan === 'yearly' && <Check className="w-4 h-4 text-[#D4AF77]" />}
                  </h3>
                  <p className="text-sm text-[#5C4A3A]/60">€39.99 / year • One payment, full year access</p>
                </div>
                {currentPlan !== 'yearly' && (
                  <Button
                    onClick={() => handleUpgradeClick('yearly')}
                    className="bg-[#D4AF77] hover:bg-[#C49F67] text-white"
                  >
                    Select <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <p className="text-xs text-[#5C4A3A]/50 text-center mt-6">
            All plans include full access to all features and rituals
          </p>

          {currentPlan !== 'free' && (
            <div className="mt-6 text-center">
              <Button 
                onClick={handleManageSubscription}
                variant="outline"
                className="border-[#E8D5C4] text-[#5C4A3A] hover:bg-[#F0EEE6]"
              >
                Manage Subscription <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-6 bg-[#F0EEE6] border border-[#E8D5C4] shadow-md rounded-2xl">
          <h2 className="text-2xl font-semibold text-[#5C4A3A] accent-font mb-6">Account</h2>
          <div className="space-y-4">
            <Button onClick={handleLogout} variant="outline" className="w-full justify-start text-left h-auto py-3 border-[#E8D5C4] text-[#5C4A3A] hover:bg-[#E8D5C4]/60">
              <LogOut className="w-4 h-4 mr-3 text-[#D4AF77]" />
              Log Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

const checkSubscriptionAccess = (user) => {
  if (!user) return { hasAccess: true, isFirstTime: true };

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