import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { 
  Mic, 
  Share2, 
  Users, 
  ArrowRight, 
  Check, 
  Clock, 
  AudioWaveform, 
  Music, 
  Radio,
  Sparkles,
  Star,
  Play,
  Shield,
  Zap,
  TrendingUp
} from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-radial from-purple/20 via-purple/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-purple-light/30 via-purple-light/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 text-purple/30 animate-float">
          <AudioWaveform size={64} />
        </div>
        <div className="absolute top-60 right-32 text-purple-light/20 animate-float delay-1000">
          <Music size={48} />
        </div>
        <div className="absolute bottom-40 left-40 text-accent/25 animate-float delay-2000">
          <Radio size={56} />
        </div>
        <div className="absolute bottom-20 right-20 text-purple-vivid/30 animate-float delay-3000">
          <Sparkles size={40} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl z-50 border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <VoiceTribeLogo />
            <div className="hidden md:flex gap-8">
              <button 
                onClick={() => scrollToSection("features")}
                className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium text-sm tracking-wide"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("pricing")}
                className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium text-sm tracking-wide"
              >
                Pricing
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            {!session ? (
              <>
                <Button
                  onClick={() => navigate("/login")}
                  variant="ghost"
                  className="hover:bg-muted/50 font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/login?action=sign_up")}
                  className="bg-gradient-to-r from-purple to-purple-light hover:from-purple-light hover:to-purple-vivid transition-all duration-300 shadow-lg hover:shadow-purple/25"
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="ghost"
                  className="hover:bg-muted/50 font-medium"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-border/50 hover:bg-muted/30"
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Beta Badge */}
          <div className="inline-flex items-center gap-2 bg-purple/10 border border-purple/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-purple" />
            <span className="text-sm font-medium text-purple">Now in Beta • Join the Revolution</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-8 mb-16">
            <h1 className="text-7xl md:text-9xl font-black tracking-tight leading-none">
              <span className="block bg-gradient-to-r from-purple via-purple-vivid to-accent bg-clip-text text-transparent">
                Voice
              </span>
              <span className="block bg-gradient-to-r from-accent via-purple-light to-purple bg-clip-text text-transparent">
                Tribe
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl font-light text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Transform your thoughts into powerful voice recordings.
              <br />
              <span className="text-primary font-medium">Share your story with the world.</span>
            </p>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            {!session ? (
              <>
                <Button
                  onClick={() => navigate("/login?action=sign_up")}
                  size="lg"
                  className="bg-gradient-to-r from-purple to-purple-vivid hover:from-purple-vivid hover:to-accent transform hover:scale-105 transition-all duration-300 px-16 py-8 text-xl font-semibold shadow-2xl hover:shadow-purple/30 group"
                >
                  Start Recording Free
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => scrollToSection("features")}
                  variant="outline"
                  size="lg"
                  className="border-border/50 hover:bg-muted/50 px-12 py-8 text-lg font-medium group backdrop-blur-sm"
                >
                  <Play className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                  See How It Works
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="bg-gradient-to-r from-purple to-purple-vivid hover:from-purple-vivid hover:to-accent transform hover:scale-105 transition-all duration-300 px-16 py-8 text-xl font-semibold shadow-2xl hover:shadow-purple/30"
              >
                Open Dashboard
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            )}
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2 group-hover:scale-110 transition-transform">15K+</div>
              <div className="text-muted-foreground font-medium">Recordings Created</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2 group-hover:scale-110 transition-transform">1.2K+</div>
              <div className="text-muted-foreground font-medium">Active Creators</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2 group-hover:scale-110 transition-transform">98%</div>
              <div className="text-muted-foreground font-medium">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6 bg-gradient-to-b from-transparent via-muted/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Everything you need to create, share, and manage your voice content like a professional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Mic className="w-10 h-10" />}
              title="Studio Quality Recording"
              description="Crystal-clear audio with automatic noise reduction and professional-grade processing that rivals expensive studio equipment."
              features={["HD Audio Quality", "Noise Cancellation", "One-Click Recording", "Auto-Enhancement"]}
              gradient="from-purple to-purple-vivid"
            />
            <FeatureCard
              icon={<Share2 className="w-10 h-10" />}
              title="Smart Sharing"
              description="Share with precision control. From private links to public broadcasts, you decide who hears your voice."
              features={["Private Links", "Public Galleries", "Team Collaboration", "Access Control"]}
              gradient="from-purple-vivid to-accent"
            />
            <FeatureCard
              icon={<Users className="w-10 h-10" />}
              title="Community Building"
              description="Connect with like-minded creators and build your voice community with powerful engagement tools."
              features={["Tribe Creation", "Follower System", "Engagement Analytics", "Discovery Feed"]}
              gradient="from-accent to-purple-light"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Start free and scale as you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              title="Free"
              price="$0"
              description="Perfect for getting started"
              features={[
                "Unlimited voice recordings",
                "1 text-to-speech per month",
                "Basic audio quality",
                "7-day storage",
                "Community access"
              ]}
              onButtonClick={handleFreePlanClick}
              buttonText="Start Free"
              popular={false}
            />
            <PricingCard
              title="Pro"
              price="$12"
              description="For serious creators"
              features={[
                "Everything in Free",
                "15 text-to-speech per month",
                "HD audio quality",
                "Unlimited storage",
                "Priority support",
                "Advanced analytics"
              ]}
              onButtonClick={handleComingSoonClick}
              buttonText="Coming Soon"
              popular={true}
            />
            <PricingCard
              title="Team"
              price="$39"
              description="For organizations"
              features={[
                "Everything in Pro",
                "100 text-to-speech per month",
                "Team collaboration",
                "Admin dashboard",
                "API access",
                "Custom integrations"
              ]}
              onButtonClick={handleComingSoonClick}
              buttonText="Coming Soon"
              popular={false}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-32 px-6 bg-gradient-to-b from-transparent via-muted/20 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Got Questions?
            </h2>
            <p className="text-xl text-muted-foreground">
              We've got answers to help you get started on your voice journey
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-6">
            <AccordionItem value="item-1" className="border border-border/50 rounded-2xl px-8 bg-card/50 backdrop-blur-sm hover:border-purple/30 transition-colors">
              <AccordionTrigger className="text-foreground hover:text-primary font-semibold text-lg py-6">
                How does VoiceTribe work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
                VoiceTribe is your all-in-one platform for voice content creation. Simply click record, speak your mind, and our AI-powered tools automatically enhance your audio quality. You can then organize, share, and discover content within your voice community. Our platform handles everything from recording to distribution.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border border-border/50 rounded-2xl px-8 bg-card/50 backdrop-blur-sm hover:border-purple/30 transition-colors">
              <AccordionTrigger className="text-foreground hover:text-primary font-semibold text-lg py-6">
                What audio formats are supported?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
                We support all major audio formats including MP3, WAV, AAC, and FLAC. Our platform automatically optimizes recordings for quality and file size, ensuring the best listening experience across all devices and platforms. You can also export in multiple formats for different use cases.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border border-border/50 rounded-2xl px-8 bg-card/50 backdrop-blur-sm hover:border-purple/30 transition-colors">
              <AccordionTrigger className="text-foreground hover:text-primary font-semibold text-lg py-6">
                Is my data secure?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
                Absolutely! We use enterprise-grade encryption to protect your recordings and personal information. All data is stored on secure servers with regular backups. You maintain full ownership and control over your content, with granular privacy settings for each recording. We never share your data with third parties.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border border-border/50 rounded-2xl px-8 bg-card/50 backdrop-blur-sm hover:border-purple/30 transition-colors">
              <AccordionTrigger className="text-foreground hover:text-primary font-semibold text-lg py-6">
                Can I upgrade or downgrade my plan?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
                Yes, you can change your plan at any time with just a few clicks. Upgrades take effect immediately, giving you instant access to new features. Downgrades take effect at the start of your next billing cycle, and your data is always preserved during plan changes. No hidden fees or long-term commitments.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-r from-purple/5 via-purple-light/10 to-accent/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple to-accent bg-clip-text text-transparent">
            Ready to amplify your voice?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of creators who are already sharing their stories and building their voice communities
          </p>
          {!session && (
            <Button
              onClick={() => navigate("/login?action=sign_up")}
              size="lg"
              className="bg-gradient-to-r from-purple to-purple-vivid hover:from-purple-vivid hover:to-accent transform hover:scale-105 transition-all duration-300 px-16 py-8 text-xl font-semibold shadow-2xl hover:shadow-purple/30"
            >
              Start Your Journey Free
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  features,
  gradient 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  features: string[];
  gradient: string;
}) => (
  <div className="relative group">
    {/* Glow Effect */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
    
    {/* Card Content */}
    <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 p-10 rounded-3xl hover:border-purple/30 transition-all duration-300 group-hover:transform group-hover:-translate-y-2 h-full">
      <div className="flex flex-col gap-8 h-full">
        {/* Icon */}
        <div className={`p-6 bg-gradient-to-br ${gradient} rounded-2xl text-white shadow-lg w-fit`}>
          {icon}
        </div>
        
        {/* Content */}
        <div className="space-y-6 flex-1">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
          
          {/* Feature List */}
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-purple flex-shrink-0" />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const PricingCard = ({ 
  title, 
  price, 
  description,
  features, 
  popular = false,
  buttonText = "Get Started",
  onButtonClick,
}: { 
  title: string; 
  price: string; 
  description: string;
  features: string[]; 
  popular?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}) => (
  <div className={`relative ${popular ? 'scale-105 md:scale-110' : ''}`}>
    {/* Popular Badge */}
    {popular && (
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple to-accent text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg z-10">
        <Star className="w-4 h-4 inline mr-2" />
        Most Popular
      </div>
    )}
    
    {/* Glow Effect for Popular */}
    {popular && (
      <div className="absolute inset-0 bg-gradient-to-br from-purple to-accent rounded-3xl blur-2xl opacity-20"></div>
    )}
    
    {/* Card Content */}
    <div className={`relative bg-card/80 backdrop-blur-sm border ${popular ? 'border-purple/50 shadow-2xl shadow-purple/20' : 'border-border/50'} p-10 rounded-3xl transition-all duration-300 hover:border-purple/30 hover:shadow-xl h-full`}>
      <div className="flex flex-col gap-8 h-full">
        {/* Header */}
        <div className="space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h3>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-5xl md:text-6xl font-black text-primary">{price}</span>
          <span className="text-muted-foreground text-lg">/month</span>
        </div>
        
        {/* Features */}
        <ul className="space-y-4 flex-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-4">
              <Check className="w-6 h-6 text-purple mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground text-base leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* CTA Button */}
        <Button 
          className={`w-full ${popular 
            ? 'bg-gradient-to-r from-purple to-purple-vivid hover:from-purple-vivid hover:to-accent shadow-lg hover:shadow-purple/25 transform hover:scale-105' 
            : 'border-border/50 hover:bg-muted/50'
          } transition-all duration-300 py-6 text-lg font-semibold`}
          variant={popular ? "default" : "outline"}
          size="lg"
          onClick={onButtonClick}
        >
          {buttonText === "Coming Soon" ? (
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" />
              {buttonText}
            </div>
          ) : (
            <>
              {buttonText}
              {popular && <ArrowRight className="ml-2 w-5 h-5" />}
            </>
          )}
        </Button>
      </div>
    </div>
  </div>
);

export default Landing;