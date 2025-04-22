
import { supabase } from "@/lib/supabaseClient";
import { UserApplicationPermission, ApplicationPermission, CategoryPermission, CategoryType } from "@/types";

// Get all users with permissions for a specific application
export async function getUsersWithPermissions(applicationId: string): Promise<UserApplicationPermission[]> {
  const result = await supabase
    .from("user_application_permissions")
    .select(`
      id,
      user_id,
      application_id,
      permission,
      category_permissions,
      created_at,
      updated_at,
      users:user_id (name, email)
    `)
    .eq("application_id", applicationId);

  // Access the response properties safely
  const data = result?.data ?? [];
  const error = result?.error;
  
  if (error) throw error;
  
  return data.map((p: any) => ({
    id: p.id,
    userId: p.user_id,
    applicationId: p.application_id,
    permission: p.permission as ApplicationPermission,
    categoryPermissions: parseCategoryPermissions(p.category_permissions),
    createdAt: new Date(p.created_at),
    updatedAt: p.updated_at ? new Date(p.updated_at) : undefined,
    userName: p.users?.name,
    userEmail: p.users?.email,
  }));
}

// Parse category permissions from JSON
function parseCategoryPermissions(categoryPermissions: any): CategoryPermission[] {
  if (!categoryPermissions || !Array.isArray(categoryPermissions)) {
    return [];
  }
  
  return categoryPermissions.map((cp: any) => ({
    category: cp.category as CategoryType,
    permission: cp.permission as ApplicationPermission,
  }));
}

// Get applications a user has access to
export async function getUserApplications(userId: string): Promise<UserApplicationPermission[]> {
  const result = await supabase
    .from("user_application_permissions")
    .select(`
      id,
      user_id,
      application_id,
      permission,
      category_permissions,
      created_at,
      updated_at,
      applications:application_id (name, description)
    `)
    .eq("user_id", userId);

  // Access the response properties safely
  const data = result?.data ?? [];
  const error = result?.error;
  
  if (error) throw error;
  
  return data.map((p: any) => ({
    id: p.id,
    userId: p.user_id,
    applicationId: p.application_id,
    permission: p.permission as ApplicationPermission,
    categoryPermissions: parseCategoryPermissions(p.category_permissions),
    createdAt: new Date(p.created_at),
    updatedAt: p.updated_at ? new Date(p.updated_at) : undefined,
    applicationName: p.applications?.name,
    applicationDescription: p.applications?.description,
  }));
}

// Grant permission to a user for an application with category permissions
export async function grantApplicationPermission(
  userId: string, 
  applicationId: string, 
  permission: ApplicationPermission,
  categoryPermissions: CategoryPermission[]
): Promise<UserApplicationPermission> {
  // In real implementation, Supabase supports upsert
  // In mock implementation, we need to handle it differently
  const recordData = {
    user_id: userId,
    application_id: applicationId,
    permission,
    category_permissions: categoryPermissions,
    updated_at: new Date().toISOString()
  };

  // First try to update existing record
  const existingResult = await supabase
    .from("user_application_permissions")
    .select()
    .eq("user_id", userId)
    .eq("application_id", applicationId);
  
  // Handle data and error safely
  const existingData = existingResult?.data ?? [];
  
  let result;
  if (existingData && existingData.length > 0) {
    // Update existing record
    result = await supabase
      .from("user_application_permissions")
      .update(recordData)
      .eq("user_id", userId)
      .eq("application_id", applicationId)
      .select()
      .single();
  } else {
    // Insert new record
    result = await supabase
      .from("user_application_permissions")
      .insert(recordData)
      .select()
      .single();
  }
  
  // Handle data and error safely
  const data = result?.data;
  const error = result?.error;

  if (error) throw error;
  
  return {
    id: data.id,
    userId: data.user_id,
    applicationId: data.application_id,
    permission: data.permission as ApplicationPermission,
    categoryPermissions: parseCategoryPermissions(data.category_permissions),
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    userName: undefined,
    userEmail: undefined,
  };
}

// Remove a user's permission for an application
export async function removeApplicationPermission(
  userId: string, 
  applicationId: string
): Promise<void> {
  const result = await supabase
    .from("user_application_permissions")
    .delete()
    .eq("user_id", userId)
    .eq("application_id", applicationId);

  // Handle error safely  
  const error = result?.error;
  if (error) throw error;
}
