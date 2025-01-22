import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { TopBar } from "@/components/dashboard/TopBar";
import { RecordingsList } from "@/components/dashboard/RecordingsList";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { TagsFilter } from '@/components/dashboard/TagsFilter';
import { useRecordingsManager } from "@/hooks/useRecordingsManager";
import { toast } from "sonner";

const Index = () => {
  const session = useSession();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('list');

  const {
    recordings,
    sharedRecordings,
    currentlyPlaying,
    playbackSpeed,
    sortOption,
    selectedTag,
    allTags,
    handlePlay,
    handleSpeedChange,
    handleDelete,
    handleTitleUpdate,
    setSortOption,
    setSelectedTag,
    refreshRecordings,
  } = useRecordingsManager(session?.user?.id);

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  // Set up real-time subscription for new recordings
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('recordings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recordings',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          refreshRecordings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, supabase, refreshRecordings]);

  const handleRecordingComplete = async (recording: { url: string; blob: Blob }) => {
    try {
      if (!session?.user?.id) {
        toast.error('You must be logged in to save recordings');
        return;
      }

      // Upload the blob to Supabase Storage
      const fileName = `recording-${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, recording.blob);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(fileName);

      // Save the recording metadata to the database
      const { error: dbError } = await supabase
        .from('recordings')
        .insert({
          user_id: session.user.id,
          blob_url: publicUrl,
          title: `Recording ${new Date().toLocaleString()}`,
        });

      if (dbError) throw dbError;

      toast.success('Recording saved successfully');
      refreshRecordings();
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error('Failed to save recording');
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
        
        <TagsFilter
          tags={allTags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
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

      <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
    </div>
  );
};

export default Index;