
import { supabase } from "@/lib/supabaseClient";
import { User, UserRole } from "@/types";

// Get all users (admin/manager only, per RLS)
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  // Convert to camelCase+typed
  return (
    data?.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role as UserRole,
      createdAt: new Date(u.created_at),
      lastLogin: u.last_login ? new Date(u.last_login) : undefined,
    })) ?? []
  );
}

// Get current user's row (self, via RLS)
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", (supabase.auth.getUser()).then(u => u.data?.user?.id))
    .single();
  if (error && error.code !== "PGRST116") throw error;
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role as UserRole,
    createdAt: new Date(data.created_at),
    lastLogin: data.last_login ? new Date(data.last_login) : undefined,
  };
}

// Create a user (admin/manager)
// NOTE: You should provision auth.user + profile row for real projects
export async function addUser(newUser: {
  name: string;
  email: string;
  role: UserRole;
}): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert([{
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }])
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role as UserRole,
    createdAt: new Date(data.created_at),
    lastLogin: data.last_login ? new Date(data.last_login) : undefined,
  };
}

// Update user (admin/manager)
export async function updateUser(id: string, changes: Partial<Pick<User, "name" | "email" | "role">>): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .update(changes)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role as UserRole,
    createdAt: new Date(data.created_at),
    lastLogin: data.last_login ? new Date(data.last_login) : undefined,
  };
}

// Delete user (admin/manager)
export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw error;
}
