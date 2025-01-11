import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

const Login = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordingId = searchParams.get("recording");
  const email = searchParams.get("email");
  const action = searchParams.get("action");

  useEffect(() => {
    const handleSharedRecording = async () => {
      if (session?.user && recordingId && action === "share") {
        try {
          const { error: shareError } = await supabase
            .from('shared_recordings')
            .insert({
              recording_id: recordingId,
              shared_with_id: session.user.id,
            });

          if (shareError) {
            console.error('Error creating share:', shareError);
            toast.error('Failed to access shared recording');
            return;
          }

          toast.success('Recording shared successfully');
          navigate('/dashboard');
        } catch (error) {
          console.error('Error handling shared recording:', error);
          toast.error('Failed to process shared recording');
        }
      }
    };

    // Handle magic link email if provided
    const handleMagicLink = async () => {
      if (email && !session) {
        try {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: window.location.href,
            },
          });
          
          if (error) {
            console.error('Error sending magic link:', error);
            toast.error('Failed to send magic link');
          } else {
            toast.success('Check your email for the magic link');
          }
        } catch (error) {
          console.error('Error sending magic link:', error);
          toast.error('Failed to send magic link');
        }
      }
    };

    if (session) {
      handleSharedRecording();
      if (!recordingId) {
        navigate('/dashboard');
      }
    } else if (email) {
      handleMagicLink();
    }
  }, [session, navigate, recordingId, action, supabase, email]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {action === "share" ? "Listen to Shared Recording" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {action === "share"
              ? "Sign in or create an account to listen to the shared recording"
              : "Sign in to your account"}
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          redirectTo={window.location.href}
          view={email ? "magic_link" : "sign_in"}
        />
      </div>
    </div>
  );
};

export default Login;