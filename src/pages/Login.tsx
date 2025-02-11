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
  const sharedById = searchParams.get("sharedById");

  useEffect(() => {
    const handleSharedRecording = async () => {
      if (session?.user && recordingId && action === "share") {
        try {
          console.log('Handling shared recording after signup/login:', {
            recordingId,
            sharedById,
            sharedWithId: session.user.id
          });

          const { error: shareError } = await supabase
            .from('shared_recordings')
            .insert({
              recording_id: recordingId,
              shared_with_id: session.user.id,
              shared_by_id: sharedById
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
      } else if (session && !recordingId) {
        navigate('/dashboard');
      }
    };

    handleSharedRecording();
  }, [session, navigate, recordingId, action, sharedById, supabase]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {action === "share" ? "Listen to Shared Recording" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {action === "share"
              ? "Sign up with email and password to listen to the shared recording"
              : "Sign in to your account"}
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#9b87f5',
                  brandAccent: '#7E69AB',
                }
              }
            }
          }}
          providers={[]}
          redirectTo={window.location.href}
          view={action === "share" ? "sign_up" : "sign_in"}
        />
      </div>
    </div>
  );
};

export default Login;