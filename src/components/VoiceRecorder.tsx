import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useSession } from '@supabase/auth-helpers-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RecordButton } from './recording/RecordButton';
import { PlaybackControls } from './recording/PlaybackControls';
import { RecordingItem } from './recording/RecordingItem';

export const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: recordings = [], isLoading } = useQuery({
    queryKey: ['recordings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recordings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user,
  });

  const uploadMutation = useMutation({
    mutationFn: async (blob: Blob) => {
      const fileName = `${crypto.randomUUID()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('recordings')
        .insert({
          blob_url: publicUrl,
          user_id: session!.user.id,
        });

      if (dbError) throw dbError;

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordings'] });
      toast.success('Recording saved successfully');
    },
    onError: (error) => {
      console.error('Error saving recording:', error);
      toast.error('Failed to save recording');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (recordingId: string) => {
      const { error } = await supabase
        .from('recordings')
        .delete()
        .eq('id', recordingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordings'] });
      toast.success('Recording deleted');
    },
    onError: (error) => {
      console.error('Error deleting recording:', error);
      toast.error('Failed to delete recording');
    },
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        uploadMutation.mutate(blob);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const playRecording = (url: string, index: number) => {
    if (currentlyPlaying === index) {
      stopPlayback();
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = url;
      audioPlayerRef.current.playbackRate = playbackSpeed;
      audioPlayerRef.current.play();
      setCurrentlyPlaying(index);

      audioPlayerRef.current.onended = () => {
        setCurrentlyPlaying(null);
      };
    } else {
      const audio = new Audio(url);
      audio.playbackRate = playbackSpeed;
      audioPlayerRef.current = audio;
      audio.play();
      setCurrentlyPlaying(index);

      audio.onended = () => {
        setCurrentlyPlaying(null);
      };
    }
  };

  const stopPlayback = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    setCurrentlyPlaying(null);
  };

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setPlaybackSpeed(newSpeed);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = newSpeed;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="flex justify-center mb-8">
        <RecordButton
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
        />
      </div>

      {recordings.length > 0 && (
        <PlaybackControls
          playbackSpeed={playbackSpeed}
          onSpeedChange={handleSpeedChange}
        />
      )}

      <div className="space-y-4">
        {recordings.map((recording, index) => (
          <RecordingItem
            key={recording.id}
            recording={recording}
            index={index}
            currentlyPlaying={currentlyPlaying}
            playbackSpeed={playbackSpeed}
            onPlay={playRecording}
            onSpeedChange={handleSpeedChange}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        ))}
      </div>
    </div>
  );
};