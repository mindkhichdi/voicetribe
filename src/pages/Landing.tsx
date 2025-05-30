
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Mic, Share2, Users, ArrowRight, Check, Clock, AudioWaveform, Music, Radio } from "lucide-react";
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Sound Waves */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-10">
          <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 opacity-10">
          <div className="w-full h-full bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-pulse delay-1000"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5">
          <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse delay-500"></div>
        </div>
        
        {/* Floating Audio Icons */}
        <div className="absolute top-20 left-20 text-cyan-400 opacity-20 animate-float">
          <AudioWaveform size={48} />
        </div>
        <div className="absolute top-40 right-32 text-pink-400 opacity-20 animate-float delay-1000">
          <Music size={40} />
        </div>
        <div className="absolute bottom-32 left-32 text-green-400 opacity-20 animate-float delay-2000">
          <Radio size={44} />
        </div>
        <div className="absolute bottom-20 right-20 text-yellow-400 opacity-20 animate-float delay-3000">
          <Mic size={36} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <VoiceTribeLogo />
            <div className="hidden md:flex gap-6">
              <button 
                onClick={() => scrollToSection("features")}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("pricing")}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
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
                className="hover:bg-gray-100 font-medium text-gray-700 border-gray-300"
              >
                Sign In
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="ghost"
                  className="hover:bg-gray-100 font-medium text-gray-700"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="hover:bg-gray-100 font-medium text-gray-700"
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center space-y-12 mt-20 relative z-10 mx-auto px-4">
        <div className="relative animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500">
              VoiceTribe
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto text-gray-600 mb-8">
            Record, Share, and Connect through Voice
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            {!session ? (
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all px-8 py-6 text-lg font-semibold border-0 shadow-lg hover:shadow-xl"
              >
                Get Started <ArrowRight className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all px-8 py-6 text-lg font-semibold border-0 shadow-lg hover:shadow-xl"
              >
                Go to Dashboard <ArrowRight className="ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 w-full max-w-6xl mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight text-gray-900">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Mic className="h-8 w-8 text-white" />}
            title="Record"
            description="Capture your voice notes with one click. High-quality audio recording with noise reduction."
            gradient="from-cyan-500 to-blue-600"
          />
          <FeatureCard
            icon={<Share2 className="h-8 w-8 text-white" />}
            title="Share"
            description="Share recordings with your tribe. Control who can access your content."
            gradient="from-pink-500 to-rose-600"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-white" />}
            title="Connect"
            description="Build your voice community. Engage with like-minded individuals."
            gradient="from-green-500 to-emerald-600"
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 w-full bg-gray-50 relative z-10">
        <div className="max-w-6xl mx-auto px-4 relative">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight text-gray-900">
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
      <section className="py-24 w-full max-w-3xl mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight text-gray-900">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-gray-200">
            <AccordionTrigger className="text-gray-900 hover:text-cyan-600">How does VoiceTribe work?</AccordionTrigger>
            <AccordionContent className="text-gray-600">
              VoiceTribe allows you to record, organize, and share voice recordings with your community. Simply click record, speak your mind, and share with your tribe.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-gray-200">
            <AccordionTrigger className="text-gray-900 hover:text-cyan-600">What audio formats are supported?</AccordionTrigger>
            <AccordionContent className="text-gray-600">
              We support all major audio formats including MP3, WAV, and AAC. Recordings are automatically optimized for quality and file size.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-gray-200">
            <AccordionTrigger className="text-gray-900 hover:text-cyan-600">Is my data secure?</AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Yes! We use industry-standard encryption to protect your recordings and personal information. You have full control over who can access your content.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="border-gray-200">
            <AccordionTrigger className="text-gray-900 hover:text-cyan-600">Can I upgrade or downgrade my plan?</AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  gradient: string;
}) => (
  <div className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20`}>
    <div className="flex flex-col items-center gap-4">
      <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold tracking-tight text-white">
        {title}
      </h3>
      <p className="text-white/90 font-light text-center">{description}</p>
    </div>
  </div>
);

export default Landing;
