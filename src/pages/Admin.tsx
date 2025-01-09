import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Users, UserX, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is admin
  const { data: userRole } = useQuery({
    queryKey: ["userRole", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch all users and their roles
  const { data: users, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      return profiles.map((profile) => ({
        ...profile,
        role: roles.find((role) => role.user_id === profile.id)?.role || "user",
      }));
    },
  });

  // Toggle user role between admin and user
  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const { error } = await supabase
      .from("user_roles")
      .upsert({ user_id: userId, role: newRole });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      refetch();
    }
  };

  // Redirect if not admin
  if (userRole?.role !== "admin") {
    navigate("/");
    return null;
  }

  return (
    <div className="container mx-auto p-6 bg-black text-white min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Users className="w-8 h-8 text-[#CAFE33]" />
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <div className="rounded-lg border border-[#CAFE33] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#CAFE33] text-black hover:bg-[#CAFE33]/90">
              <TableHead>Username</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-white/5 transition-colors"
              >
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      user.role === "admin"
                        ? "bg-[#CAFE33] text-black"
                        : "bg-white/10"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleUserRole(user.id, user.role as string)}
                    className="hover:text-[#CAFE33]"
                  >
                    {user.role === "admin" ? (
                      <UserX className="w-4 h-4" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}