import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Filter, Grid2X2, List, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export const TopBar = () => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        toast.error("Failed to sign out");
        return;
      }
      toast.success("Signed out successfully");
      navigate("/landing");
    } catch (error) {
      console.error("Error in handleSignOut:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="flex justify-between items-center mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline">All Recordings</Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Grid2X2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};