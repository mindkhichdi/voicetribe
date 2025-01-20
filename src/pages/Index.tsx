import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { TopBar, type SortOption, type ViewMode } from "@/components/dashboard/TopBar";
import { RecordingsList } from "@/components/dashboard/RecordingsList";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { TagsFilter } from '@/components/dashboard/TagsFilter';

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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get unique tags from all recordings
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    [...recordings, ...sharedRecordings].forEach(recording => {
      recording.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [recordings, sharedRecordings]);

  // Filter recordings based on selected tag
  const filteredRecordings = useMemo(() => {
    if (!selectedTag) return recordings;
    return recordings.filter(recording => recording.tags?.includes(selectedTag));
  }, [recordings, selectedTag]);

  const filteredSharedRecordings = useMemo(() => {
    if (!selectedTag) return sharedRecordings;
    return sharedRecordings.filter(recording => recording.tags?.includes(selectedTag));
  }, [sharedRecordings, selectedTag]);

  const sortRecordings = (recordings: any[], sort: SortOption) => {
    return [...recordings].sort((a, b) => {
      switch (sort) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'alphabetical':
          const titleA = (a.title || '').toLowerCase();
          const titleB = (b.title || '').toLowerCase();
          return titleA.localeCompare(titleB);
        default:
          return 0;
      }
    });
  };

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

      // Update and sort main recordings
      setRecordings(prevRecordings => {
        const updatedRecordings = prevRecordings.map(recording =>
          recording.id === id ? { ...recording, title: newTitle } : recording
        );
        return sortRecordings(updatedRecordings, sortOption);
      });

      // Update and sort shared recordings
      setSharedRecordings(prevRecordings => {
        const updatedRecordings = prevRecordings.map(recording =>
          recording.id === id ? { ...recording, title: newTitle } : recording
        );
        return sortRecordings(updatedRecordings, sortOption);
      });

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
        
        // Sort recordings before setting state
        const sortedOwnRecordings = sortRecordings(ownRecordings || [], sortOption);
        const sortedSharedRecordings = sortRecordings(transformedShared || [], sortOption);
        
        setRecordings(sortedOwnRecordings);
        setSharedRecordings(sortedSharedRecordings);
      } catch (error) {
        console.error("Error in fetchRecordings:", error);
        toast.error("Failed to fetch recordings");
      }
    };

    fetchRecordings();
  }, [session, supabase, navigate, sortOption]);

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    // Sorting will be handled by the useEffect when sortOption changes
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
          onSortChange={handleSortChange}
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
            recordings={filteredRecordings}
            currentlyPlaying={currentlyPlaying}
            playbackSpeed={playbackSpeed}
            onPlay={handlePlay}
            onSpeedChange={handleSpeedChange}
            onDelete={handleDelete}
            onTitleUpdate={handleTitleUpdate}
            viewMode={viewMode}
          />

          {filteredSharedRecordings.length > 0 && (
            <RecordingsList
              recordings={filteredSharedRecordings}
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
        setRecordings(prev => sortRecordings([newRecording, ...prev], sortOption));
      }} />
    </div>
  );
};

export default Index;
