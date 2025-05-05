// API service utility for making authenticated requests
import axios from 'axios';
import axiosInstance, { API_BASE_URL } from './axiosInterceptor';

/**
 * Makes an authenticated API request with the JWT token using axios
 */
export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    data?: any;
    params?: any;
  } = {}
): Promise<T> {
  console.log(`API Request: ${options.method || 'GET'} ${endpoint}`, {
    data: options.data,
    params: options.params
  });
  
  try {
    const response = await axiosInstance({
      url: endpoint,
      method: options.method || 'GET',
      data: options.data,
      params: options.params
    });
    
    console.log(`API Response: ${options.method || 'GET'} ${endpoint}`, {
      status: response.status,
      data: response.data
    });
    
    return response.data as T;
  } catch (error) {
    console.error(`API Error: ${options.method || 'GET'} ${endpoint}`, error);
    
    if (axios.isAxiosError(error)) {
      // Handle axios errors
      if (error.response?.status === 401) {
        // Auth error already handled by interceptor
        throw new Error("Your session has expired. Please log in again.");
      }
      
      // Handle other errors
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    
    // Re-throw unknown errors
    throw error;
  }
}

/**
 * Authentication-related API methods
 */
export const authApi = {
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Auth/login`, {
        username,
        password
      });
      return response;
    } catch (error) {
      // Handle error but don't perform automatic logout
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        throw new Error(responseData?.message || error.message);
      }
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  },
  
  getCurrentUser: () => {
    const userJson = localStorage.getItem("currentUser");
    return userJson ? JSON.parse(userJson) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  }
};

/**
 * Applications-related API methods
 */
export const applicationApi = {
  getAll: async (includeInactive = false) => {
    return await apiRequest<any[]>("/Applications", {
      params: { includeInactive }
    });
  },
  
  getById: async (id: number) => {
    return await apiRequest<any>(`/Applications/${id}`);
  },
  
  create: async (applicationData: any) => {
    return await apiRequest<number>("/Applications", {
      method: "POST",
      data: applicationData
    });
  },
  
  update: async (id: number, applicationData: any) => {
    return await apiRequest<any>(`/Applications/${id}`, {
      method: "PUT",
      data: applicationData
    });
  },
  
  delete: async (id: number) => {
    return await apiRequest<boolean>(`/Applications/${id}`, {
      method: "DELETE"
    });
  }
};

/**
 * Credentials-related API methods
 */
export const credentialsApi = {
  getAll: async (includeInactive = false) => {
    console.log('Fetching all credentials with includeInactive:', includeInactive);
    return await apiRequest<any[]>("/Credentials", {
      params: { includeInactive }
    });
  },
  
  getById: async (id: number) => {
    return await apiRequest<any>(`/Credentials/${id}`);
  },
  
  create: async (credentialData: any) => {
    console.log('Creating credential with data:', credentialData);
    try {
      const result = await apiRequest<number>("/Credentials", {
        method: "POST",
        data: credentialData
      });
      console.log('Credential created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating credential:', error);
      throw error;
    }
  },
  
  update: async (id: number, credentialData: any) => {
    console.log(`Updating credential ${id} with data:`, credentialData);
    try {
      const result = await apiRequest<any>(`/Credentials/${id}`, {
        method: "PUT",
        data: credentialData
      });
      console.log(`Credential ${id} updated successfully:`, result);
      return result;
    } catch (error) {
      console.error(`Error updating credential ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: number) => {
    return await apiRequest<boolean>(`/Credentials/${id}`, {
      method: "DELETE"
    });
  },
  
  access: async (id: number) => {
    return await apiRequest<{ password: string }>(`/Credentials/${id}/access`);
  }
};

/**
 * User-related API methods
 */
export const usersApi = {
  getAll: async () => {
    return await apiRequest<any[]>("/Users");
  },
  
  create: async (userData: any) => {
    return await apiRequest<any>("/Users", {
      method: "POST",
      data: userData
    });
  },
  
  // Add other user methods as needed
}; 