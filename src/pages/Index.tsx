
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { TopBar } from "@/components/dashboard/TopBar";
import { RecordingsList } from "@/components/dashboard/RecordingsList";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { TextToSpeech } from "@/components/TextToSpeech";
import { TagsFilter } from '@/components/dashboard/TagsFilter';
import { useRecordingsManager } from "@/hooks/useRecordingsManager";
import { Button } from "@/components/ui/button";
import { Mic, Type } from "lucide-react";

const Index = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('list');
  const [inputMode, setInputMode] = React.useState<'voice' | 'text'>('voice');

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
    fetchRecordings,
  } = useRecordingsManager(session?.user?.id);

  React.useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  const handleRecordingComplete = (newRecording: any) => {
    console.log('New recording created:', newRecording);
    fetchRecordings();
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

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
        <Button
          variant={inputMode === 'voice' ? 'default' : 'outline'}
          onClick={() => setInputMode('voice')}
          className="rounded-full"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice
        </Button>
        <Button
          variant={inputMode === 'text' ? 'default' : 'outline'}
          onClick={() => setInputMode('text')}
          className="rounded-full"
        >
          <Type className="h-4 w-4 mr-2" />
          Text
        </Button>
      </div>

      {inputMode === 'voice' ? (
        <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
      ) : (
        <TextToSpeech 
          onRecordingComplete={handleRecordingComplete} 
          onCancel={() => setInputMode('voice')}
        />
      )}
    </div>
  );
};

export default Index;
