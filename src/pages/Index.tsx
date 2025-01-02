import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogIn, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const [isDark, setIsDark] = useState(false);

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

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold">Tribe</h2>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => console.log('Sign in clicked')}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <Button variant="default" size="sm" onClick={() => console.log('Sign up clicked')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16 space-y-6">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 animate-fade-in">
            Create your Tribe
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in">
            Record Voice notes - ideas, health logs, book notes, lists etc. and Share it with your Tribe
          </p>
          <div className="flex justify-center gap-4 animate-fade-in">
            <Button 
              variant="default" 
              size="lg"
              onClick={() => console.log('Get Started clicked')}
              className="bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 dark:text-black hover:opacity-90"
            >
              Get Started
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-secondary/50 dark:bg-secondary/10 rounded-2xl p-8 shadow-lg backdrop-blur-sm animate-fade-in">
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
  <div className="p-6 rounded-xl bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export default Index;