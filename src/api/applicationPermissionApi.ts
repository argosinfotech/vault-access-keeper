
import { supabase } from "@/lib/supabaseClient";
import { UserApplicationPermission, ApplicationPermission } from "@/types";

// Get all users with permissions for a specific application
export async function getUsersWithPermissions(applicationId: string): Promise<UserApplicationPermission[]> {
  const response = await supabase
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

  if (response.error) throw response.error;
  
  return (response.data ?? []).map((p: any) => ({
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
  const response = await supabase
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

  if (response.error) throw response.error;
  
  return (response.data ?? []).map((p: any) => ({
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
  // In real implementation, Supabase supports upsert
  // In mock implementation, we need to handle it differently
  const recordData = {
    user_id: userId,
    application_id: applicationId,
    permission,
    updated_at: new Date().toISOString()
  };

  // First try to update existing record
  const existingResponse = await supabase
    .from("user_application_permissions")
    .select()
    .eq("user_id", userId)
    .eq("application_id", applicationId);

  let response;
  if (existingResponse.data && existingResponse.data.length > 0) {
    // Update existing record
    response = await supabase
      .from("user_application_permissions")
      .update(recordData)
      .eq("user_id", userId)
      .eq("application_id", applicationId)
      .select()
      .single();
  } else {
    // Insert new record
    response = await supabase
      .from("user_application_permissions")
      .insert(recordData)
      .select()
      .single();
  }

  if (response.error) throw response.error;
  
  return {
    id: response.data.id,
    userId: response.data.user_id,
    applicationId: response.data.application_id,
    permission: response.data.permission as ApplicationPermission,
    createdAt: new Date(response.data.created_at),
    updatedAt: new Date(response.data.updated_at),
  };
}

// Remove a user's permission for an application
export async function removeApplicationPermission(
  userId: string, 
  applicationId: string
): Promise<void> {
  const response = await supabase
    .from("user_application_permissions")
    .delete()
    .eq("user_id", userId)
    .eq("application_id", applicationId);

  if (response.error) throw response.error;
}
