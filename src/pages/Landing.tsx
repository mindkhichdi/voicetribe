import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Mic, Share2, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Landing = () => {
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        toast.error("Failed to sign out");
        return;
      }
      toast.success("Signed out successfully");
      navigate("/landing");
    } catch (error) {
      console.error("Error in handleSignOut:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            VoiceTribe
          </h2>
          <div className="flex gap-4">
            {!session ? (
              <Button
                onClick={() => navigate("/login")}
                variant="ghost"
                className="hover:bg-primary/10"
              >
                Sign In
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="ghost"
                  className="hover:bg-primary/10"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="hover:bg-primary/10"
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center space-y-12">
        <h1 className="text-6xl md:text-8xl font-bold font-display mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            VoiceTribe
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl font-mono max-w-2xl mx-auto opacity-80">
          Record, Share, and Connect through Voice
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {!session ? (
            <Button
              onClick={() => navigate("/login")}
              className="retro-border retro-shadow transform hover:-translate-y-1 transition-transform px-8 py-6 text-lg"
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/dashboard")}
              className="retro-border retro-shadow transform hover:-translate-y-1 transition-transform px-8 py-6 text-lg"
            >
              Go to Dashboard <ArrowRight className="ml-2" />
            </Button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon={<Mic className="h-8 w-8 text-primary" />}
            title="Record"
            description="Capture your voice notes with one click"
          />
          <FeatureCard
            icon={<Share2 className="h-8 w-8 text-primary" />}
            title="Share"
            description="Share recordings with your tribe"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-primary" />}
            title="Connect"
            description="Build your voice community"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="glass p-6 rounded-xl retro-border hover:retro-shadow transition-all duration-300">
    <div className="flex flex-col items-center gap-4">
      {icon}
      <h3 className="font-display text-xl font-semibold text-primary">
        {title}
      </h3>
      <p className="text-foreground/80">{description}</p>
    </div>
  </div>
);

export default Landing;