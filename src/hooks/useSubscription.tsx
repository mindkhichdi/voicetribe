
import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export type SubscriptionPlan = 'free' | 'pro' | 'team';

interface SubscriptionData {
  plan: SubscriptionPlan;
  ttsUsage: number;
  ttsLimit: number;
}

export const useSubscription = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    plan: 'free',
    ttsUsage: 0,
    ttsLimit: 1
  });
  const [isLoading, setIsLoading] = useState(true);

  const getTtsLimit = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'pro':
        return 10;
      case 'team':
        return 50;
      default:
        return 1;
    }
  };

  const fetchSubscriptionData = async () => {
    if (!user) return;

    try {
      // Get subscription plan
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .single();

      // Get current month's TTS usage
      const { data: usageCount } = await supabase
        .rpc('get_monthly_tts_usage', { user_id: user.id });

      const plan = subscriptionData?.plan || 'free';
      
      setSubscriptionData({
        plan,
        ttsUsage: usageCount || 0,
        ttsLimit: getTtsLimit(plan)
      });
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementTtsUsage = async () => {
    if (!user) return;
    
    try {
      const { data: newCount } = await supabase
        .rpc('increment_tts_usage', { user_id: user.id });
      
      setSubscriptionData(prev => ({
        ...prev,
        ttsUsage: newCount || prev.ttsUsage + 1
      }));
      
      return newCount;
    } catch (error) {
      console.error('Error incrementing TTS usage:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [user]);

  return {
    ...subscriptionData,
    isLoading,
    refresh: fetchSubscriptionData,
    incrementTtsUsage
  };
};
