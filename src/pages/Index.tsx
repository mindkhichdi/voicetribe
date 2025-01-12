import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { RecordingItem } from "@/components/recording/RecordingItem";
import { PlaybackControls } from "@/components/recording/PlaybackControls";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState<any[]>([]);
  const [sharedRecordings, setSharedRecordings] = useState<any[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    const fetchRecordings = async () => {
      try {
        // Fetch user's own recordings
        const { data: ownRecordings, error: ownError } = await supabase
          .from("recordings")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (ownError) {
          console.error("Error fetching recordings:", ownError);
          toast.error("Failed to fetch recordings");
          return;
        }

        // Fetch recordings shared with the user
        const { data: shared, error: sharedError } = await supabase
          .from("shared_recordings")
          .select(`
            recording_id,
            recordings (
              id,
              blob_url,
              created_at
            )
          `)
          .eq("shared_with_id", session.user.id);

        if (sharedError) {
          console.error("Error fetching shared recordings:", sharedError);
          toast.error("Failed to fetch shared recordings");
          return;
        }

        // Transform shared recordings data
        const transformedShared = shared
          .filter(item => item.recordings) // Filter out any null recordings
          .map(item => ({
            ...item.recordings,
          }));

        setRecordings(ownRecordings || []);
        setSharedRecordings(transformedShared || []);
        console.log("Fetched recordings:", ownRecordings);
        console.log("Fetched shared recordings:", transformedShared);
      } catch (error) {
        console.error("Error in fetchRecordings:", error);
        toast.error("Failed to fetch recordings");
      }
    };

    fetchRecordings();
  }, [session, supabase, navigate]);

  const handlePlay = (url: string, index: number) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (currentlyPlaying === index) {
      setCurrentlyPlaying(null);
      setAudio(null);
      return;
    }

    const newAudio = new Audio(url);
    newAudio.playbackRate = playbackSpeed;
    newAudio.play();
    newAudio.onended = () => {
      setCurrentlyPlaying(null);
      setAudio(null);
    };
    setAudio(newAudio);
    setCurrentlyPlaying(index);
  };

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setPlaybackSpeed(newSpeed);
    if (audio) {
      audio.playbackRate = newSpeed;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("recordings").delete().eq("id", id);

      if (error) {
        console.error("Error deleting recording:", error);
        toast.error("Failed to delete recording");
        return;
      }

      setRecordings((prev) => prev.filter((recording) => recording.id !== id));
      toast.success("Recording deleted successfully");
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("Failed to delete recording");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>

      <VoiceRecorder />
      {(playbackSpeed !== 1 || currentlyPlaying !== null) && (
        <PlaybackControls
          playbackSpeed={playbackSpeed}
          onSpeedChange={handleSpeedChange}
        />
      )}
      
      <div className="space-y-8">
        {/* User's Recordings */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Recordings</h2>
          <div className="space-y-4">
            {recordings.map((recording, index) => (
              <RecordingItem
                key={recording.id}
                recording={recording}
                index={index}
                currentlyPlaying={currentlyPlaying}
                playbackSpeed={playbackSpeed}
                onPlay={handlePlay}
                onSpeedChange={handleSpeedChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>

        {/* Shared Recordings */}
        {sharedRecordings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Shared With You</h2>
            <div className="space-y-4">
              {sharedRecordings.map((recording, index) => (
                <RecordingItem
                  key={recording.id}
                  recording={recording}
                  index={recordings.length + index} // Offset index to avoid conflicts with own recordings
                  currentlyPlaying={currentlyPlaying}
                  playbackSpeed={playbackSpeed}
                  onPlay={handlePlay}
                  onSpeedChange={handleSpeedChange}
                  onDelete={() => {}} // Shared recordings cannot be deleted by the recipient
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
