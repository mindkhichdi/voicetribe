import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import { VoiceRecorder } from "@/components/VoiceRecorder";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="font-display text-6xl font-bold mb-4">
            Your Second Brain
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Record voice notes — ideas, grocery lists, health logs, book highlights, anything.
          </p>
        </div>
        
        <VoiceRecorder />
      </main>
    </div>
  );
};

export default Index;