import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut, Music } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

const Index = () => {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="fixed right-8 top-24 z-50 animate-float">
        <div className="glass rounded-full p-4">
          <Music className="h-6 w-6 text-primary" />
        </div>
      </div>

      <nav className="fixed top-0 w-full glass z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            VoiceTribe
          </h2>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="hover:bg-primary/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-primary/10"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16 space-y-6">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-fade-in">
            Create your Tribe
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto animate-fade-in">
            Record Voice notes - ideas, health logs, book notes, lists etc. and Share it with your Tribe
          </p>
        </div>

        <div className="max-w-4xl mx-auto glass rounded-2xl p-8 shadow-lg animate-fade-in">
          <VoiceRecorder />
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
          <FeatureCard
            title="Record & Share"
            description="Capture your thoughts with one tap and share them with your tribe"
          />
          <FeatureCard
            title="Organize"
            description="Keep your voice notes organized with custom categories and tags"
          />
          <FeatureCard
            title="Access Anywhere"
            description="Access your voice notes from any device, anytime"
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="glass p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <h3 className="font-display text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
      {title}
    </h3>
    <p className="text-foreground/80">{description}</p>
  </div>
);

export default Index;