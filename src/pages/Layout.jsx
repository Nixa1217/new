
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { MessageCircle, Home, Sparkles, Eye, Settings, Target } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SubscriptionGuard from "./components/SubscriptionGuard";
import EnergyResetOrb from "./components/EnergyResetOrb";

const navigationItems = [
  { name: "Frequencies", icon: MessageCircle, label: "" },
  { name: "VisionBoard", icon: Sparkles, label: "" },
  { name: "Compass", icon: Home, label: "" },
  { name: "Vault", icon: Target, label: "" },
  { name: "IdentityPortal", icon: Eye, label: "" },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = React.useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      setIsCheckingAuth(true);
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
        // Redirect to login if not authenticated
        base44.auth.redirectToLogin(window.location.href);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    fetchUser();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#F5EFE7] flex items-center justify-center">
        <div className="text-[#D4AF77] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <SubscriptionGuard user={currentUser}>
      <SidebarProvider>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
          
          :root {
            --cream-bg: #F5EFE7;
            --soft-white: #F0EEE6;
            --muted-gold: #D4AF77;
            --off-white: #FDFBF7;
            --deep-brown: #5C4A3A;
            --soft-blush: #E8D5C4;
          }
          
          h1, h2, h3 {
            font-family: 'Cormorant Garamond', serif;
          }
          
          body, p, span, button, input, textarea {
            font-family: 'Inter', sans-serif;
          }
          
          .accent-font {
            font-family: 'Lora', serif;
          }
        `}</style>
        
        <div className="min-h-screen flex w-full bg-[#F5EFE7] pb-20">
          <main className="flex-1 flex flex-col relative">
            {currentPageName === 'Compass' && (
              <Link
                to={createPageUrl("Profile")}
                className="absolute top-4 right-4 z-50 p-2 bg-[#F0EEE6]/80 backdrop-blur-sm rounded-full text-[#5C4A3A]/70 hover:text-[#5C4A3A] transition-colors"
              >
                <Settings className="w-6 h-6" />
              </Link>
            )}
            {children}
          </main>

          <nav className="fixed bottom-0 left-0 right-0 bg-[#F0EEE6]/95 backdrop-blur-sm border-t border-[#E8D5C4] shadow-lg z-50">
            <div className="max-w-lg mx-auto px-4">
              <div className="flex items-center justify-around py-3">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === createPageUrl(item.name);
                  return (
                    <Link
                      key={item.name}
                      to={createPageUrl(item.name)}
                      className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                        isActive ? 'text-[#D4AF77]' : 'text-[#5C4A3A]/60'
                      }`}
                    >
                      <item.icon 
                        className={`w-6 h-6 transition-transform duration-300 ${
                          isActive ? 'scale-110' : 'scale-100'
                        }`}
                      />
                      <span className="text-xs font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          <EnergyResetOrb user={currentUser} />
        </div>
      </SidebarProvider>
    </SubscriptionGuard>
  );
}
