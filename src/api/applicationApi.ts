import { apiRequest } from "@/lib/api";
import { Application } from "@/types";

// Get all applications
export async function getApplications(): Promise<Application[]> {
  const response = await apiRequest<any[]>("/Applications");
  return response.map((app) => ({
    id: app.applicationId.toString(),
    name: app.name,
    description: app.description || undefined,
    createdBy: app.createdBy?.toString() || "unknown",
    createdAt: new Date(app.createdDate),
    updatedAt: new Date(app.modifiedDate || app.createdDate),
  }));
}

// Get a single application by ID
export async function getApplicationById(id: string): Promise<Application> {
  const response = await apiRequest<any>(`/Applications/${id}`);
  return {
    id: response.applicationId.toString(),
    name: response.name,
    description: response.description || undefined,
    createdBy: response.createdBy?.toString() || "unknown",
    createdAt: new Date(response.createdDate),
    updatedAt: new Date(response.modifiedDate || response.createdDate),
  };
}

// Add a new application
export async function addApplication(newApp: Omit<Application, "id" | "createdAt" | "updatedAt">): Promise<Application> {
  const payload = {
    name: newApp.name,
    description: newApp.description || "",
    isActive: true
  };
  
  const response = await apiRequest<any>("/Applications", {
    method: "POST",
    data: payload
  });
  
  return {
    id: response.toString(), // The API returns just the ID
    name: newApp.name,
    description: newApp.description,
    createdBy: newApp.createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Update an application
export async function updateApplication(id: string, changes: Partial<Application>): Promise<Application> {
  const payload = {
    applicationId: parseInt(id),
    name: changes.name,
    description: changes.description || "",
    isActive: true
  };
  
  await apiRequest<any>(`/Applications/${id}`, {
    method: "PUT",
    data: payload
  });
  
  // Since the API doesn't return the updated object, we'll construct it
  // from what we know
  return {
    id,
    name: changes.name || "",
    description: changes.description,
    createdBy: changes.createdBy || "unknown",
    createdAt: changes.createdAt || new Date(),
    updatedAt: new Date(),
  };
}

// Delete an application
export async function deleteApplication(id: string): Promise<void> {
  await apiRequest<any>(`/Applications/${id}`, {
    method: "DELETE"
  });
}

// Get credentials for an application (across environments)
export async function getCredentialsByApplicationId(applicationId: string): Promise<any[]> {
  const response = await apiRequest<any[]>(`/Credentials?applicationId=${applicationId}`);
  return response || [];
}
