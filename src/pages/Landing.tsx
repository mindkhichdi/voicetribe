
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Mic, Share2, Users, ArrowRight, Check, Clock } from "lucide-react";
import { toast } from "sonner";
import VoiceTribeLogo from "@/components/VoiceTribeLogo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFreePlanClick = () => {
    navigate("/login?action=sign_up");
  };

  const handleComingSoonClick = () => {
    toast.info("This plan will be available soon!");
  };

  const PricingCard = ({ 
    title, 
    price, 
    features, 
    highlighted = false,
    buttonText = "Get Started",
    onButtonClick,
  }: { 
    title: string; 
    price: string; 
    features: string[]; 
    highlighted?: boolean;
    buttonText?: string;
    onButtonClick?: () => void;
  }) => (
    <div className={`glass p-8 rounded-xl ${highlighted ? 'retro-border retro-shadow scale-105' : 'border border-purple-light/20'}`}>
      <div className="flex flex-col items-center gap-4">
        <h3 className="font-display text-2xl font-semibold text-primary">
          {title}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-foreground/60">/month</span>
        </div>
        <ul className="mt-8 space-y-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          className={`mt-8 w-full ${highlighted ? 'retro-border hover:retro-shadow' : ''}`}
          variant={highlighted ? "default" : "outline"}
          onClick={onButtonClick}
        >
          {buttonText === "Coming Soon" ? (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {buttonText}
            </div>
          ) : (
            buttonText
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <VoiceTribeLogo />
            <div className="hidden md:flex gap-6">
              <button 
                onClick={() => scrollToSection("features")}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("pricing")}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
              >
                Pricing
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            {!session ? (
              <Button
                onClick={() => navigate("/login")}
                variant="ghost"
                className="hover:bg-primary/10 font-medium"
              >
                Sign In
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="ghost"
                  className="hover:bg-primary/10 font-medium"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="hover:bg-primary/10 font-medium"
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center space-y-12 mt-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-light/20 via-purple/20 to-purple-vivid/20 blur-3xl -z-10" />
        <div className="relative animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple to-purple-vivid">
              VoiceTribe
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto text-foreground/80">
            Record, Share, and Connect through Voice
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            {!session ? (
              <Button
                onClick={() => navigate("/login")}
                className="retro-border retro-shadow transform hover:-translate-y-1 transition-transform px-8 py-6 text-lg font-semibold"
              >
                Get Started <ArrowRight className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/dashboard")}
                className="retro-border retro-shadow transform hover:-translate-y-1 transition-transform px-8 py-6 text-lg font-semibold"
              >
                Go to Dashboard <ArrowRight className="ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 w-full max-w-6xl mx-auto px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-soft/20 to-transparent blur-3xl -z-10" />
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Mic className="h-8 w-8 text-primary" />}
            title="Record"
            description="Capture your voice notes with one click. High-quality audio recording with noise reduction."
          />
          <FeatureCard
            icon={<Share2 className="h-8 w-8 text-primary" />}
            title="Share"
            description="Share recordings with your tribe. Control who can access your content."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-primary" />}
            title="Connect"
            description="Build your voice community. Engage with like-minded individuals."
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 w-full bg-purple-soft/10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-light/10 via-transparent to-purple-vivid/10 blur-3xl" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight">
            Simple Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Free"
              price="$0"
              features={[
                "Unlimited voice recordings",
                "1 text-to-speech per month",
                "Basic audio quality",
                "7-day storage"
              ]}
              onButtonClick={handleFreePlanClick}
              buttonText="Get Started"
            />
            <PricingCard
              title="Pro"
              price="$10"
              features={[
                "Unlimited voice recordings",
                "10 text-to-speech per month",
                "HD audio quality",
                "Unlimited storage",
                "Priority support"
              ]}
              onButtonClick={handleComingSoonClick}
              buttonText="Coming Soon"
              highlighted
            />
            <PricingCard
              title="Team"
              price="$29"
              features={[
                "Unlimited voice recordings",
                "50 text-to-speech per month",
                "Team collaboration",
                "Analytics dashboard",
                "API access"
              ]}
              onButtonClick={handleComingSoonClick}
              buttonText="Coming Soon"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 w-full max-w-3xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does VoiceTribe work?</AccordionTrigger>
            <AccordionContent>
              VoiceTribe allows you to record, organize, and share voice recordings with your community. Simply click record, speak your mind, and share with your tribe.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What audio formats are supported?</AccordionTrigger>
            <AccordionContent>
              We support all major audio formats including MP3, WAV, and AAC. Recordings are automatically optimized for quality and file size.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is my data secure?</AccordionTrigger>
            <AccordionContent>
              Yes! We use industry-standard encryption to protect your recordings and personal information. You have full control over who can access your content.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Can I upgrade or downgrade my plan?</AccordionTrigger>
            <AccordionContent>
              Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="glass p-6 rounded-xl retro-border hover:retro-shadow transition-all duration-300">
    <div className="flex flex-col items-center gap-4">
      {icon}
      <h3 className="text-xl font-bold tracking-tight text-primary">
        {title}
      </h3>
      <p className="text-foreground/80 font-light">{description}</p>
    </div>
  </div>
);

export default Landing;
