import axiosInstance from "@/lib/axiosInterceptor";
import axios from "axios";
import { User, UserRole } from "@/types";

// API endpoint
const USERS_ENDPOINT = "/users";

// Backend response types
interface UserResponse {
  userId: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userRoleId: number;
  userRoleName: string;
  isActive: boolean;
  lastLoginDate?: string;
  createdDate: string;
}

interface UserDetailResponse extends UserResponse {
  createdBy?: number;
  createdByUsername?: string;
  modifiedDate: string;
  modifiedBy?: number;
  modifiedByUsername?: string;
}

// Convert backend UserRoleId to frontend UserRole
function mapRoleIdToUserRole(roleId: number): UserRole {
  switch (roleId) {
    case 1: return UserRole.ADMIN;
    case 2: return UserRole.MANAGER;
    case 3: return UserRole.VIEWER;
    default: return UserRole.VIEWER;
  }
}

// Convert frontend UserRole to backend UserRoleId
export function mapUserRoleToRoleId(role: UserRole): number {
  switch (role) {
    case UserRole.ADMIN: return 1;
    case UserRole.MANAGER: return 2;
    case UserRole.VIEWER: return 3;
    default: return 3;
  }
}

// Map backend response to frontend model
function mapToUser(response: UserResponse): User {
  return {
    id: response.userId.toString(),
    name: `${response.firstName || ''} ${response.lastName || ''}`.trim() || response.username,
    email: response.email,
    role: mapRoleIdToUserRole(response.userRoleId),
    createdAt: new Date(response.createdDate),
    lastLogin: response.lastLoginDate ? new Date(response.lastLoginDate) : undefined,
  };
}

// Get all users
export async function listUsers(includeInactive: boolean = false): Promise<User[]> {
  try {
    console.log("Fetching all users");
    const response = await axiosInstance.get(`${USERS_ENDPOINT}?includeInactive=${includeInactive}`);
    console.log("Received users:", response.data);
    
    if (!response.data || !Array.isArray(response.data)) {
      console.warn("API returned unexpected data format:", response.data);
      return [];
    }
    
    return response.data.map((item: UserResponse) => mapToUser(item));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(id: string | number): Promise<User | null> {
  try {
    console.log(`Fetching user with ID ${id}`);
    const response = await axiosInstance.get(`${USERS_ENDPOINT}/${id}`);
    console.log("Received user:", response.data);
    
    if (!response.data) {
      console.warn("User not found");
      return null;
    }
    
    return mapToUser(response.data);
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

// Create a new user
export async function addUser(newUser: {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  userRoleId: number;
  isActive?: boolean;
}): Promise<User> {
  try {
    console.log("Creating user:", newUser);
    const response = await axiosInstance.post(USERS_ENDPOINT, newUser);
    console.log("User created with response:", response);
    
    // The response should be the new user's ID
    const userId = response.data;
    
    // Fetch the complete user data
    const createdUser = await getUserById(userId);
    if (!createdUser) {
      throw new Error("Failed to retrieve created user");
    }
    
    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Update an existing user
export async function updateUser(id: string | number, changes: {
  username?: string;
  email?: string;
  password?: string; // Optional - only if changing password
  firstName?: string;
  lastName?: string;
  userRoleId?: number;
  isActive?: boolean;
}): Promise<User> {
  try {
    console.log(`Updating user ${id}:`, changes);
    const response = await axiosInstance.put(`${USERS_ENDPOINT}/${id}`, changes);
    console.log("User updated with response:", response);
    
    // Fetch the updated user data
    const updatedUser = await getUserById(id);
    if (!updatedUser) {
      throw new Error("Failed to retrieve updated user");
    }
    
    return updatedUser;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
}

// Delete user (soft delete)
export async function deleteUser(id: string | number): Promise<boolean> {
  try {
    console.log(`Deleting user ${id}`);
    const response = await axiosInstance.delete(`${USERS_ENDPOINT}/${id}`);
    console.log("User deletion response:", response);
    
    return response.data?.success === true;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
}

// Convenience conversion helper for UI components
export function userRoleToString(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN: return "Administrator";
    case UserRole.MANAGER: return "Manager";
    case UserRole.VIEWER: return "Viewer";
    default: return "Unknown";
  }
}

// Convert user role string to enum
export function stringToUserRole(role: string): UserRole {
  const lowerRole = role.toLowerCase();
  if (lowerRole.includes("admin")) return UserRole.ADMIN;
  if (lowerRole.includes("manager")) return UserRole.MANAGER;
  return UserRole.VIEWER;
}

// Backward compatibility for existing components
export const getUsers = listUsers;
