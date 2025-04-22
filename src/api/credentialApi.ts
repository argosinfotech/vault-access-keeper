
import { supabase } from "@/lib/supabaseClient";
import { Credential, EnvironmentType, CategoryType } from "@/types";

// Get all credentials (RLS enforced)
export async function getCredentials(): Promise<Credential[]> {
  const { data, error } = await supabase
    .from("credentials")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((c: any) => ({
    id: c.id,
    title: c.title,
    username: c.username,
    password: c.password, // Never expose this in frontend; here for demo
    url: c.url || undefined,
    environment: c.environment as EnvironmentType,
    category: c.category as CategoryType,
    applicationId: c.application_id || undefined,
    notes: c.notes || undefined,
    createdBy: c.created_by,
    createdAt: new Date(c.created_at),
    updatedAt: new Date(c.updated_at),
    lastAccessedBy: c.last_accessed_by || undefined,
    lastAccessedAt: c.last_accessed_at ? new Date(c.last_accessed_at) : undefined,
  }));
}

// Get credentials by application ID
export async function getCredentialsByApplication(applicationId: string): Promise<Credential[]> {
  const { data, error } = await supabase
    .from("credentials")
    .select("*")
    .eq("application_id", applicationId)
    .order("environment", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((c: any) => ({
    id: c.id,
    title: c.title,
    username: c.username,
    password: c.password,
    url: c.url || undefined,
    environment: c.environment as EnvironmentType,
    category: c.category as CategoryType,
    applicationId: c.application_id,
    notes: c.notes || undefined,
    createdBy: c.created_by,
    createdAt: new Date(c.created_at),
    updatedAt: new Date(c.updated_at),
    lastAccessedBy: c.last_accessed_by || undefined,
    lastAccessedAt: c.last_accessed_at ? new Date(c.last_accessed_at) : undefined,
  }));
}

// Add a credential (admin/manager)
export async function addCredential(newCred: Omit<Credential, "id" | "createdAt" | "updatedAt">): Promise<Credential> {
  const { data, error } = await supabase
    .from("credentials")
    .insert([{
      ...newCred,
      application_id: newCred.applicationId
    }])
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    username: data.username,
    password: data.password,
    url: data.url || undefined,
    environment: data.environment as EnvironmentType,
    category: data.category as CategoryType,
    applicationId: data.application_id || undefined,
    notes: data.notes || undefined,
    createdBy: data.created_by,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    lastAccessedBy: data.last_accessed_by || undefined,
    lastAccessedAt: data.last_accessed_at ? new Date(data.last_accessed_at) : undefined,
  };
}

// Update credential (admin/manager)
export async function updateCredential(id: string, changes: Partial<Credential>): Promise<Credential> {
  const { data, error } = await supabase
    .from("credentials")
    .update({
      ...changes,
      application_id: changes.applicationId
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    username: data.username,
    password: data.password,
    url: data.url || undefined,
    environment: data.environment as EnvironmentType,
    category: data.category as CategoryType,
    applicationId: data.application_id || undefined,
    notes: data.notes || undefined,
    createdBy: data.created_by,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    lastAccessedBy: data.last_accessed_by || undefined,
    lastAccessedAt: data.last_accessed_at ? new Date(data.last_accessed_at) : undefined,
  };
}

// Delete credential (admin/manager)
export async function deleteCredential(id: string): Promise<void> {
  const result = await supabase.from("credentials").delete().eq("id", id);
  if (result.error) throw result.error;
}
