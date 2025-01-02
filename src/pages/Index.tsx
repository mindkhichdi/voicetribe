import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference
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
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="font-display text-6xl font-bold mb-4">
            Create your Tribe
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Record Voice notes - ideas, health logs, book notes, lists etc. and Share it with your Tribe
          </p>
        </div>
        
        <VoiceRecorder />
      </main>
    </div>
  );
};

export default Index;