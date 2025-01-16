import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { TopBar, type SortOption, type ViewMode } from "@/components/dashboard/TopBar";
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
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const handleTitleUpdate = async (id: string, newTitle: string) => {
    try {
      console.log('Updating title for recording:', id, 'New title:', newTitle);
      
      const { error } = await supabase
        .from('recordings')
        .update({ title: newTitle })
        .eq('id', id);

      if (error) {
        console.error('Supabase error updating title:', error);
        throw error;
      }

      // Update local state for main recordings
      setRecordings(prevRecordings =>
        prevRecordings.map(recording =>
          recording.id === id ? { ...recording, title: newTitle } : recording
        )
      );

      // Update local state for shared recordings
      setSharedRecordings(prevRecordings =>
        prevRecordings.map(recording =>
          recording.id === id ? { ...recording, title: newTitle } : recording
        )
      );

      console.log('Title updated successfully');
      toast.success('Title updated successfully');
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error('Failed to update title');
    }
  };

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    const fetchRecordings = async () => {
      try {
        console.log('Fetching recordings for user:', session.user.id);
        
        // Fetch user's recordings with titles
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

        // Fetch shared recordings with titles
        const { data: shared, error: sharedError } = await supabase
          .from("shared_recordings")
          .select(`
            recording_id,
            recordings (
              id,
              blob_url,
              created_at,
              title,
              description
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

        console.log('Fetched recordings:', ownRecordings);
        console.log('Fetched shared recordings:', transformedShared);
        
        setRecordings(ownRecordings || []);
        setSharedRecordings(transformedShared || []);
      } catch (error) {
        console.error("Error in fetchRecordings:", error);
        toast.error("Failed to fetch recordings");
      }
    };

    fetchRecordings();
  }, [session, supabase, navigate]);

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    const sortedRecordings = [...recordings].sort((a, b) => {
      switch (sort) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'alphabetical':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });
    setRecordings(sortedRecordings);
  };

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
        <TopBar 
          onSortChange={setSortOption}
          onViewModeChange={setViewMode}
          viewMode={viewMode}
        />
        
        <div className="space-y-8">
          <RecordingsList
            recordings={recordings}
            currentlyPlaying={currentlyPlaying}
            playbackSpeed={playbackSpeed}
            onPlay={handlePlay}
            onSpeedChange={handleSpeedChange}
            onDelete={handleDelete}
            onTitleUpdate={handleTitleUpdate}
            viewMode={viewMode}
          />

          {sharedRecordings.length > 0 && (
            <RecordingsList
              recordings={sharedRecordings}
              currentlyPlaying={currentlyPlaying}
              playbackSpeed={playbackSpeed}
              onPlay={handlePlay}
              onSpeedChange={handleSpeedChange}
              onDelete={handleDelete}
              onTitleUpdate={handleTitleUpdate}
              isShared
              viewMode={viewMode}
            />
          )}
        </div>
      </div>

      <VoiceRecorder onRecordingComplete={(newRecording) => {
        setRecordings(prev => [newRecording, ...prev]);
      }} />
    </div>
  );
};

export default Index;