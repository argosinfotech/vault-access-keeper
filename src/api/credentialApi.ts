import axiosInstance from "@/lib/axiosInterceptor";
import axios from "axios";
import { Credential, EnvironmentType, CategoryType } from "@/types";

// API endpoints 
const CREDENTIALS_ENDPOINT = "/credentials";

// Backend response types
interface CredentialResponse {
  id: number;
  title: string;
  username: string;
  password: string; // Will be masked by backend
  url?: string;
  environmentTypeId: number;
  categoryTypeId: number;
  applicationId?: number;
  notes?: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  lastAccessedByUserId?: string;
  lastAccessedAt?: string;
  isActive: boolean;
}

// Convert environment type to ID for backend
export function mapEnvironmentToId(type?: EnvironmentType): number {
  switch (type) {
    case EnvironmentType.DEVELOPMENT: return 1;
    case EnvironmentType.TESTING: return 2;
    case EnvironmentType.STAGING: return 3;
    case EnvironmentType.PRODUCTION: return 4;
    default: return 1; // Default to DEV
  }
}

// Convert environment ID to type for frontend
export function mapIdToEnvironment(id?: number): EnvironmentType {
  switch (id) {
    case 1: return EnvironmentType.DEVELOPMENT;
    case 2: return EnvironmentType.TESTING;
    case 3: return EnvironmentType.STAGING;
    case 4: return EnvironmentType.PRODUCTION;
    default: return EnvironmentType.DEVELOPMENT;
  }
}

// Convert category type to ID for backend
export function mapCategoryToId(type?: CategoryType): number {
  switch (type) {
    case CategoryType.STAGING_HOSTING: return 1;
    case CategoryType.PRODUCTION_HOSTING: return 2;
    case CategoryType.STAGING_APPLICATION: return 3;
    case CategoryType.LIVE_APPLICATION: return 4;
    case CategoryType.QA_APPLICATION: return 5;
    case CategoryType.OTHER: return 6;
    default: return 1;
  }
}

// Convert category ID to type for frontend
export function mapIdToCategory(id?: number): CategoryType {
  switch (id) {
    case 1: return CategoryType.STAGING_HOSTING;
    case 2: return CategoryType.PRODUCTION_HOSTING;
    case 3: return CategoryType.STAGING_APPLICATION;
    case 4: return CategoryType.LIVE_APPLICATION;
    case 5: return CategoryType.QA_APPLICATION;
    case 6: return CategoryType.OTHER;
    default: return CategoryType.OTHER;
  }
}

// Map backend response to frontend model
function mapToCredential(response: CredentialResponse): Credential {
  return {
    id: response.id.toString(),
    title: response.title,
    username: response.username,
    password: response.password,
    url: response.url,
    environment: mapIdToEnvironment(response.environmentTypeId),
    category: mapIdToCategory(response.categoryTypeId),
    applicationId: response.applicationId?.toString(),
    notes: response.notes,
    createdBy: response.createdByUserId,
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
    lastAccessedBy: response.lastAccessedByUserId,
    lastAccessedAt: response.lastAccessedAt ? new Date(response.lastAccessedAt) : undefined,
  };
}

// Get all credentials
export async function getCredentials(): Promise<Credential[]> {
  try {
    console.log("Fetching all credentials");
    const response = await axiosInstance.get(CREDENTIALS_ENDPOINT);
    console.log("Received credentials:", response.data);
    
    // Handle the case where the response might be null, undefined, or not an array
    if (!response.data || !Array.isArray(response.data)) {
      console.warn("API returned unexpected data format:", response.data);
      return [];
    }
    
    // Check the structure of the first item to determine the response format
    const credentials = response.data;
    
    // Map the response to our Credential type
    return credentials.map((item: any) => {
      // Using defensive programming to handle potentially missing properties
      try {
        // Check if we're dealing with standard API response or different format
        const credId = item.id || item.credentialId; 
        if (!credId) {
          console.warn("Credential without ID:", item);
          throw new Error("Invalid credential data - missing ID");
        }
        
        return {
          id: credId.toString(),
          title: item.title || "",
          username: item.username || "",
          password: item.password || "••••••••",
          url: item.url || "",
          environment: item.environment || 
                     (item.environmentTypeId && mapIdToEnvironment(item.environmentTypeId)) || 
                     (item.environmentType && mapIdToEnvironment(item.environmentType)) || 
                     EnvironmentType.DEVELOPMENT,
          category: item.category || 
                   (item.categoryTypeId && mapIdToCategory(item.categoryTypeId)) || 
                   (item.categoryType && mapIdToCategory(item.categoryType)) || 
                   CategoryType.OTHER,
          applicationId: item.applicationId ? item.applicationId.toString() : undefined,
          notes: item.notes || "",
          createdBy: item.createdBy || item.createdByUserId || "unknown",
          createdAt: item.createdAt ? new Date(item.createdAt) : 
                     item.createdDate ? new Date(item.createdDate) : 
                     new Date(),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : 
                     item.modifiedDate ? new Date(item.modifiedDate) : 
                     new Date(),
          lastAccessedBy: item.lastAccessedBy || item.lastAccessedByUserId || undefined,
          lastAccessedAt: item.lastAccessedAt ? new Date(item.lastAccessedAt) : 
                          item.lastAccessedDate ? new Date(item.lastAccessedDate) : 
                          undefined,
        };
      } catch (error) {
        console.error("Error mapping credential:", error, item);
        // Return a default credential to avoid breaking the UI
        return {
          id: "error-" + Math.random().toString(36).substring(2, 9),
          title: "Error loading credential",
          username: "",
          password: "",
          environment: EnvironmentType.DEVELOPMENT,
          category: CategoryType.OTHER,
          createdBy: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    });
  } catch (error) {
    console.error("Error fetching credentials:", error);
    throw error;
  }
}

// Get credentials by application ID
export async function getCredentialsByApplication(applicationId: string): Promise<Credential[]> {
  try {
    console.log(`Fetching credentials for application ${applicationId}`);
    const response = await axiosInstance.get(
      `${CREDENTIALS_ENDPOINT}/application/${applicationId}`
    );
    console.log("Received credentials for application:", response.data);
    
    // Handle the case where the response might be null, undefined, or not an array
    if (!response.data || !Array.isArray(response.data)) {
      console.warn("API returned unexpected data format:", response.data);
      return [];
    }
    
    // Use the same mapping function as getCredentials
    return response.data.map((item: any) => {
      try {
        const credId = item.id || item.credentialId; 
        if (!credId) {
          console.warn("Credential without ID:", item);
          throw new Error("Invalid credential data - missing ID");
        }
        
        return {
          id: credId.toString(),
          title: item.title || "",
          username: item.username || "",
          password: item.password || "••••••••",
          url: item.url || "",
          environment: item.environment || 
                     (item.environmentTypeId && mapIdToEnvironment(item.environmentTypeId)) || 
                     (item.environmentType && mapIdToEnvironment(item.environmentType)) || 
                     EnvironmentType.DEVELOPMENT,
          category: item.category || 
                   (item.categoryTypeId && mapIdToCategory(item.categoryTypeId)) || 
                   (item.categoryType && mapIdToCategory(item.categoryType)) || 
                   CategoryType.OTHER,
          applicationId: item.applicationId ? item.applicationId.toString() : undefined,
          notes: item.notes || "",
          createdBy: item.createdBy || item.createdByUserId || "unknown",
          createdAt: item.createdAt ? new Date(item.createdAt) : 
                     item.createdDate ? new Date(item.createdDate) : 
                     new Date(),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : 
                     item.modifiedDate ? new Date(item.modifiedDate) : 
                     new Date(),
          lastAccessedBy: item.lastAccessedBy || item.lastAccessedByUserId || undefined,
          lastAccessedAt: item.lastAccessedAt ? new Date(item.lastAccessedAt) : 
                          item.lastAccessedDate ? new Date(item.lastAccessedDate) : 
                          undefined,
        };
      } catch (error) {
        console.error("Error mapping credential:", error, item);
        return {
          id: "error-" + Math.random().toString(36).substring(2, 9),
          title: "Error loading credential",
          username: "",
          password: "",
          environment: EnvironmentType.DEVELOPMENT,
          category: CategoryType.OTHER,
          createdBy: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    });
  } catch (error) {
    console.error(`Error fetching credentials for application ${applicationId}:`, error);
    throw error;
  }
}

// Create a new credential
export async function create(credential: any): Promise<string> {
  try {
    console.log("Creating credential:", credential);
    const response = await axiosInstance.post(CREDENTIALS_ENDPOINT, credential);
    console.log("Credential created with response:", response);
    
    // Handle different response formats
    if (response.data !== undefined && response.data !== null) {
      if (typeof response.data === 'number') {
        return response.data.toString();
      } else if (typeof response.data === 'string') {
        return response.data;
      } else if (typeof response.data === 'object' && response.data.id) {
        return response.data.id.toString();
      } else if (typeof response.data === 'object' && response.data.credentialId) {
        return response.data.credentialId.toString();
      }
    }
    
    // If we can't determine the ID, return a placeholder
    console.warn("Couldn't extract ID from response:", response.data);
    return "new-credential";
  } catch (error) {
    console.error("Error creating credential:", error);
    throw error;
  }
}

// Update an existing credential
export async function update(id: number, changes: any): Promise<void> {
  try {
    // Validate the ID
    if (isNaN(id) || id <= 0) {
      console.error(`Invalid credential ID for update: ${id}`);
      throw new Error(`Invalid credential ID: ${id}`);
    }
    
    console.log(`Updating credential ${id}:`, changes);
    const response = await axiosInstance.put(`${CREDENTIALS_ENDPOINT}/${id}`, changes);
    console.log(`Credential ${id} updated with response:`, response);
  } catch (error) {
    console.error(`Error updating credential ${id}:`, error);
    
    // Provide more details on the error
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      throw new Error(`API error: ${error.message}`);
    }
    
    throw error;
  }
}

// Delete a credential
export async function remove(id: number): Promise<void> {
  try {
    // Validate the ID
    if (isNaN(id) || id <= 0) {
      console.error(`Invalid credential ID for deletion: ${id}`);
      throw new Error(`Invalid credential ID: ${id}`);
    }
    
    console.log(`Deleting credential ${id}`);
    await axiosInstance.delete(`${CREDENTIALS_ENDPOINT}/${id}`);
    console.log(`Credential ${id} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting credential ${id}:`, error);
    
    // Provide more details on the error
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      throw new Error(`API error: ${error.message}`);
    }
    
    throw error;
  }
}

// Get a single credential by ID
export async function getById(id: number): Promise<Credential | null> {
  try {
    console.log(`Fetching credential with ID ${id}`);
    
    // Validate the ID
    if (isNaN(id) || id <= 0) {
      console.error(`Invalid credential ID: ${id}`);
      throw new Error(`Invalid credential ID: ${id}`);
    }
    
    const response = await axiosInstance.get(`${CREDENTIALS_ENDPOINT}/${id}`);
    console.log(`Received credential with ID ${id}:`, response.data);
    
    // Handle case where API returns null or undefined
    if (!response.data) {
      console.warn(`API returned no data for credential ${id}`);
      return null;
    }
    
    // Extract the credential data
    const item = response.data;
    
    // Map to our Credential type using the same approach as in getCredentials
    try {
      const credId = item.id || item.credentialId; 
      if (!credId) {
        console.warn("Credential without ID:", item);
        throw new Error("Invalid credential data - missing ID");
      }
      
      return {
        id: credId.toString(),
        title: item.title || "",
        username: item.username || "",
        password: item.password || "••••••••",
        url: item.url || "",
        environment: item.environment || 
                   (item.environmentTypeId && mapIdToEnvironment(item.environmentTypeId)) || 
                   (item.environmentType && mapIdToEnvironment(item.environmentType)) || 
                   EnvironmentType.DEVELOPMENT,
        category: item.category || 
                 (item.categoryTypeId && mapIdToCategory(item.categoryTypeId)) || 
                 (item.categoryType && mapIdToCategory(item.categoryType)) || 
                 CategoryType.OTHER,
        applicationId: item.applicationId ? item.applicationId.toString() : undefined,
        notes: item.notes || "",
        createdBy: item.createdBy || item.createdByUserId || "unknown",
        createdAt: item.createdAt ? new Date(item.createdAt) : 
                   item.createdDate ? new Date(item.createdDate) : 
                   new Date(),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : 
                   item.modifiedDate ? new Date(item.modifiedDate) : 
                   new Date(),
        lastAccessedBy: item.lastAccessedBy || item.lastAccessedByUserId || undefined,
        lastAccessedAt: item.lastAccessedAt ? new Date(item.lastAccessedAt) : 
                        item.lastAccessedDate ? new Date(item.lastAccessedDate) : 
                        undefined,
      };
    } catch (error) {
      console.error(`Error mapping credential with ID ${id}:`, error, item);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching credential with ID ${id}:`, error);
    
    // Provide more details on the error
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
    }
    
    throw error;
  }
}
