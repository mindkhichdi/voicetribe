import React, { useState, useRef } from 'react';
import { Mic, Square, Trash2, Play, Pause, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Slider } from './ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          className={`rounded-full p-8 transition-all duration-300 ${
            isRecording 
              ? 'bg-gradient-to-r from-accent to-primary animate-recording-pulse' 
              : 'bg-gradient-to-r from-primary to-secondary hover:opacity-90'
          }`}
        >
          {isRecording ? (
            <Square className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </Button>
      </div>

      {recordings.length > 0 && (
        <div className="mb-6 glass rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Playback Speed</p>
          <Slider
            defaultValue={[1]}
            max={2}
            min={0.5}
            step={0.25}
            value={[playbackSpeed]}
            onValueChange={handleSpeedChange}
            className="w-48 mx-auto"
          />
          <div className="text-xs text-center mt-1">{playbackSpeed}x</div>
        </div>
      )}

      <div className="space-y-4">
        {recordings.map((recording, index) => (
          <div
            key={recording.id}
            className="glass rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => playRecording(recording.blob_url, index)}
                  className={`hover:bg-primary/10 ${currentlyPlaying === index ? 'text-primary' : ''}`}
                >
                  {currentlyPlaying === index ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <span className="text-sm font-medium">
                  {new Date(recording.created_at).toLocaleTimeString()}
                </span>
                {currentlyPlaying === index && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSpeedChange([Math.max(0.5, playbackSpeed - 0.25)])}
                      className="hover:bg-primary/10"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSpeedChange([Math.min(2, playbackSpeed + 0.25)])}
                      className="hover:bg-primary/10"
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteMutation.mutate(recording.id)}
                className="hover:bg-primary/10 hover:text-accent"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};