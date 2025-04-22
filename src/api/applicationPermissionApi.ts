
import { supabase } from "@/lib/supabaseClient";
import { UserApplicationPermission, ApplicationPermission } from "@/types";

// Get all users with permissions for a specific application
export async function getUsersWithPermissions(applicationId: string): Promise<UserApplicationPermission[]> {
  const { data, error } = await supabase
    .from("user_application_permissions")
    .select(`
      id,
      user_id,
      application_id,
      permission,
      created_at,
      updated_at,
      users:user_id (name, email)
    `)
    .eq("application_id", applicationId);

  if (error) throw error;
  
  return (data ?? []).map((p: any) => ({
    id: p.id,
    userId: p.user_id,
    applicationId: p.application_id,
    permission: p.permission as ApplicationPermission,
    createdAt: new Date(p.created_at),
    updatedAt: p.updated_at ? new Date(p.updated_at) : undefined,
    userName: p.users?.name,
    userEmail: p.users?.email,
  }));
}

// Get applications a user has access to
export async function getUserApplications(userId: string): Promise<UserApplicationPermission[]> {
  const { data, error } = await supabase
    .from("user_application_permissions")
    .select(`
      id,
      user_id,
      application_id,
      permission,
      created_at,
      updated_at,
      applications:application_id (name, description)
    `)
    .eq("user_id", userId);

  if (error) throw error;
  
  return (data ?? []).map((p: any) => ({
    id: p.id,
    userId: p.user_id,
    applicationId: p.application_id,
    permission: p.permission as ApplicationPermission,
    createdAt: new Date(p.created_at),
    updatedAt: p.updated_at ? new Date(p.updated_at) : undefined,
    applicationName: p.applications?.name,
    applicationDescription: p.applications?.description,
  }));
}

// Grant permission to a user for an application
export async function grantApplicationPermission(
  userId: string, 
  applicationId: string, 
  permission: ApplicationPermission
): Promise<UserApplicationPermission> {
  const { data, error } = await supabase
    .from("user_application_permissions")
    .upsert({
      user_id: userId,
      application_id: applicationId,
      permission,
      updated_at: new Date()
    }, { onConflict: 'user_id, application_id' })
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    userId: data.user_id,
    applicationId: data.application_id,
    permission: data.permission as ApplicationPermission,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

// Remove a user's permission for an application
export async function removeApplicationPermission(
  userId: string, 
  applicationId: string
): Promise<void> {
  const { error } = await supabase
    .from("user_application_permissions")
    .delete()
    .eq("user_id", userId)
    .eq("application_id", applicationId);

  if (error) throw error;
}
