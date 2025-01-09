import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase}>
          <TooltipProvider>
            <Routes>
              <Route path="/landing" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/" element={<Index />} />
              <Route path="*" element={<Navigate to="/landing" replace />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;