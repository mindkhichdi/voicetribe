import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { TopBar } from "@/components/dashboard/TopBar";
import { RecordingsList } from "@/components/dashboard/RecordingsList";
import { VoiceRecorder } from "@/components/VoiceRecorder";

const Index = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState<any[]>([]);
  const [sharedRecordings, setSharedRecordings] = useState<any[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    const fetchRecordings = async () => {
      try {
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

        const transformedShared = shared
          .filter(item => item.recordings)
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <TopBar />
        
        {showRecorder ? (
          <VoiceRecorder />
        ) : (
          <>
            <RecordingsList
              recordings={recordings}
              currentlyPlaying={currentlyPlaying}
              playbackSpeed={playbackSpeed}
              onPlay={handlePlay}
              onSpeedChange={handleSpeedChange}
              onDelete={handleDelete}
            />

            {sharedRecordings.length > 0 && (
              <RecordingsList
                recordings={sharedRecordings}
                currentlyPlaying={currentlyPlaying}
                playbackSpeed={playbackSpeed}
                onPlay={handlePlay}
                onSpeedChange={handleSpeedChange}
                onDelete={handleDelete}
                isShared
              />
            )}

            <button
              onClick={() => setShowRecorder(true)}
              className="fixed bottom-8 right-8 rounded-full bg-purple hover:bg-purple-vivid text-white px-6 py-3 animate-float"
            >
              start recording
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
