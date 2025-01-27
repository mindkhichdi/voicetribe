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
  const supabase = useSupabaseClient();

  const generateSummary = async () => {
    if (!description) {
      toast.error('No transcription available to summarize');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Calling generate-summary function with description:', description.substring(0, 100) + '...');
      
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: { transcription: description }
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

  if (!description) {
    return null;
  }

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
              Generating summary...
            </>
          ) : (
            'Generate Summary'
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