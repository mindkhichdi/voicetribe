import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Filter, Grid2X2, List, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortOption = 'recent' | 'oldest' | 'alphabetical';
export type ViewMode = 'list' | 'grid';

interface TopBarProps {
  onSortChange: (sort: SortOption) => void;
  onViewModeChange: (mode: ViewMode) => void;
  viewMode: ViewMode;
}

export const TopBar = ({ onSortChange, onViewModeChange, viewMode }: TopBarProps) => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple clicks
    
    setIsSigningOut(true);
    console.log('Starting sign out process...');
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        
        // If the error is due to session not found, we can still redirect the user
        if (error.message.includes('session_not_found')) {
          console.log('Session not found, but proceeding with sign out flow');
          toast.success("Signed out successfully");
          navigate("/landing");
          return;
        }
        
        toast.error("Failed to sign out");
        return;
      }
      
      console.log('Sign out successful');
      toast.success("Signed out successfully");
      navigate("/landing");
    } catch (error) {
      console.error("Error in handleSignOut:", error);
      toast.error("Failed to sign out");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="glass mb-8 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-purple hover:bg-purple-soft/50">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-white dark:bg-gray-800">
              <DropdownMenuItem onClick={() => onSortChange('recent')}>
                Most Recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange('oldest')}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange('alphabetical')}>
                Alphabetically
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="border-purple hover:bg-purple-soft/50">All Recordings</Button>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-purple-soft/50"
            onClick={() => onViewModeChange(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? (
              <Grid2X2 className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSignOut} 
            className="hover:bg-purple-soft/50"
            disabled={isSigningOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};