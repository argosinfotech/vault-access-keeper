
import { supabase } from "@/lib/supabaseClient";
import { Application, CategoryType } from "@/types";

// Get all applications
export async function getApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((app: any) => ({
    id: app.id,
    name: app.name,
    description: app.description || undefined,
    category: app.category as CategoryType,
    createdBy: app.created_by,
    createdAt: new Date(app.created_at),
    updatedAt: new Date(app.updated_at),
  }));
}

// Get a single application by ID
export async function getApplicationById(id: string): Promise<Application> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    category: data.category as CategoryType,
    createdBy: data.created_by,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

// Add a new application
export async function addApplication(newApp: Omit<Application, "id" | "createdAt" | "updatedAt">): Promise<Application> {
  const { data, error } = await supabase
    .from("applications")
    .insert([{
      ...newApp
    }])
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    category: data.category as CategoryType,
    createdBy: data.created_by,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

// Update an application
export async function updateApplication(id: string, changes: Partial<Application>): Promise<Application> {
  const { data, error } = await supabase
    .from("applications")
    .update(changes)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    category: data.category as CategoryType,
    createdBy: data.created_by,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

// Delete an application
export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) throw error;
}

// Get credentials for an application (across environments)
export async function getCredentialsByApplicationId(applicationId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from("credentials")
    .select("*")
    .eq("application_id", applicationId)
    .order("environment", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
