import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Music } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed right-8 top-24 z-50 animate-float">
        <div className="glass rounded-full p-4">
          <Music className="h-6 w-6 text-primary" />
        </div>
      </div>
      
      <div className="w-full max-w-md glass p-8 rounded-xl retro-border retro-shadow">
        <h2 className="font-display text-2xl font-bold text-center mb-8 text-primary">
          Welcome to VoiceTribe
        </h2>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#CAFE33',
                  brandAccent: '#a5cb29',
                  brandButtonText: '#000000',
                },
              },
            },
            className: {
              button: 'retro-border hover:retro-shadow transition-all duration-300',
              input: 'retro-border focus:ring-2 ring-primary',
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Login;