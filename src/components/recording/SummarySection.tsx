
import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SummarySectionProps {
  recordingId: string;
  description?: string;
}

export const SummarySection = ({ recordingId, description }: SummarySectionProps) => {
  const [summaries, setSummaries] = useState<{
    bulletPoints?: string;
    detailed?: string;
    simple?: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'bullet' | 'detailed' | 'simple'>('simple');
  const [isLoading, setIsLoading] = useState(false);
  const [currentDescription, setCurrentDescription] = useState(description);
  const supabase = useSupabaseClient();

  const needsTranscription = !currentDescription || currentDescription.startsWith('Recording ');

  const generateSummary = async () => {
    setIsLoading(true);
    try {
      // If we need to transcribe first
      if (needsTranscription) {
        toast.loading('Transcribing your recording...');
        
        const { data: recordingData, error: recordingError } = await supabase
          .from('recordings')
          .select('blob_url')
          .eq('id', recordingId)
          .single();
          
        if (recordingError) {
          throw new Error('Failed to load recording data');
        }
        
        // Call the transcription function
        const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('transcribe-audio', {
          body: { 
            audioUrl: recordingData.blob_url,
            recordingId: recordingId
          }
        });
        
        if (transcriptionError) {
          console.error('Transcription error:', transcriptionError);
          throw new Error('Failed to transcribe recording');
        }
        
        // Update the local description
        setCurrentDescription(transcriptionData.transcription);
        
        toast.success('Transcription completed');
        
        // Now generate summary from the transcription
        await generateSummaryFromText(transcriptionData.transcription);
      } else {
        // Just generate summary from existing description
        await generateSummaryFromText(currentDescription!);
      }
    } catch (error) {
      console.error('Error in generating summary:', error);
      toast.error('Failed to process recording');
      setIsLoading(false);
    }
  };

  const generateSummaryFromText = async (text: string) => {
    try {
      console.log('Calling generate-summary function with description:', text.substring(0, 100) + '...');
      
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: { transcription: text }
      });

      if (error) throw error;

      console.log('Received summary data:', data);
      setSummaries(data);
      toast.success('Summary generated successfully');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = needsTranscription 
    ? 'Transcribe and Generate Summary' 
    : 'Generate Summary';

  return (
    <div className="mt-4 space-y-4">
      {!summaries ? (
        <Button 
          onClick={generateSummary} 
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {needsTranscription ? 'Transcribing and generating...' : 'Generating summary...'}
            </>
          ) : (
            buttonText
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'bullet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('bullet')}
            >
              Bullet Points
            </Button>
            <Button
              variant={activeTab === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('detailed')}
            >
              Detailed
            </Button>
            <Button
              variant={activeTab === 'simple' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('simple')}
            >
              Simple
            </Button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            {activeTab === 'bullet' && (
              <div className="prose dark:prose-invert">
                {summaries.bulletPoints}
              </div>
            )}
            {activeTab === 'detailed' && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {summaries.detailed}
              </p>
            )}
            {activeTab === 'simple' && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {summaries.simple}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
