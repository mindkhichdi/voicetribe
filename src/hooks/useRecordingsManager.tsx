import { useState, useEffect, useMemo } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';
import { SortOption } from '@/components/dashboard/TopBar';

export const useRecordingsManager = (userId: string | undefined) => {
  const supabase = useSupabaseClient();
  const [recordings, setRecordings] = useState<any[]>([]);
  const [sharedRecordings, setSharedRecordings] = useState<any[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    [...recordings, ...sharedRecordings].forEach(recording => {
      recording.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [recordings, sharedRecordings]);

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

  useEffect(() => {
    if (!userId) return;

    const fetchRecordings = async () => {
      try {
        console.log('Fetching recordings for user:', userId);
        
        const { data: ownRecordings, error: ownError } = await supabase
          .from("recordings")
          .select("*")
          .eq("user_id", userId)
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
              created_at,
              title,
              description
            )
          `)
          .eq("shared_with_id", userId);

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
  }, [userId, supabase, sortOption]);

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

  const handleTitleUpdate = async (id: string, newTitle: string) => {
    setRecordings(prevRecordings => {
      const updatedRecordings = prevRecordings.map(recording =>
        recording.id === id ? { ...recording, title: newTitle } : recording
      );
      return sortRecordings(updatedRecordings, sortOption);
    });
  };

  return {
    recordings: filteredRecordings,
    sharedRecordings: filteredSharedRecordings,
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
  };
};