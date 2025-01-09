import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { Music } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const session = useSession();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <div className="fixed right-8 top-24 z-50 animate-float">
        <div className="glass rounded-full p-4">
          <Music className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="max-w-4xl w-full text-center space-y-12">
        <h1 className="text-6xl md:text-8xl font-bold font-display mb-8 relative">
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
              Get Started
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/dashboard")}
              className="retro-border retro-shadow transform hover:-translate-y-1 transition-transform px-8 py-6 text-lg"
            >
              Go to Dashboard
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            title="Record"
            description="Capture your voice notes with one click"
          />
          <FeatureCard
            title="Share"
            description="Share recordings with your tribe"
          />
          <FeatureCard
            title="Connect"
            description="Build your voice community"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="glass p-6 rounded-xl retro-border hover:retro-shadow transition-all duration-300">
    <h3 className="font-display text-xl font-semibold mb-2 text-primary">
      {title}
    </h3>
    <p className="text-foreground/80">{description}</p>
  </div>
);

export default Landing;