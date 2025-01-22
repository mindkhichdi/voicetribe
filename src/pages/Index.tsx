import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { TopBar } from "@/components/dashboard/TopBar";
import { RecordingsList } from "@/components/dashboard/RecordingsList";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { TagsFilter } from '@/components/dashboard/TagsFilter';
import { useRecordingsManager } from "@/hooks/useRecordingsManager";

const Index = () => {
  const session = useSession();
  const navigate = useNavigate();
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
  } = useRecordingsManager(session?.user?.id);

  React.useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

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

      <VoiceRecorder onRecordingComplete={(newRecording) => {
        // This will be handled by the useRecordingsManager hook
        console.log('New recording created:', newRecording);
      }} />
    </div>
  );
};

export default Index;