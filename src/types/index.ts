// Types for the Vault Access Keeper application

// User roles for access control
export enum UserRole {
  ADMIN = "admin",     // Full access to all features and credentials
  MANAGER = "manager", // Can add and view credentials, limited user management
  VIEWER = "viewer",   // Can only view credentials they have access to
}

// Environment types for credentials
export enum EnvironmentType {
  PRODUCTION = "production",
  STAGING = "staging",
  DEVELOPMENT = "development",
  TESTING = "testing",
}

// Category types for organizing credentials (updated to fixed list)
export enum CategoryType {
  STAGING_HOSTING = "Development Hosting",
  PRODUCTION_HOSTING = "Production Hosting",
  STAGING_APPLICATION = "Staging Application",
  LIVE_APPLICATION = "Live Application",
  QA_APPLICATION = "QA Application",
  OTHER = "Other",
}

// Application permission level
export enum ApplicationPermission {
  ADMIN = "admin",     // Can manage app and all its credentials
  VIEWER = "viewer",   // Can only view app and its credentials
}

// Category permission level
export interface CategoryPermission {
  category: CategoryType;
  permission: ApplicationPermission;
}

// User application permission
export interface UserApplicationPermission {
  id: string;
  userId: string;
  applicationId: string;
  permission: ApplicationPermission;
  categoryPermissions: CategoryPermission[]; // Added category-specific permissions
  createdAt: Date;
  updatedAt?: Date;
  // Properties for UI display - populated when joining with users table
  userName?: string;
  userEmail?: string;
  // Properties for UI display - populated when joining with applications table
  applicationName?: string;
  applicationDescription?: string;
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
}

// Application type for master list
export interface Application {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Credential type
export interface Credential {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  environment: EnvironmentType;
  category: CategoryType;
  applicationId?: string;  // Link to master application
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastAccessedBy?: string;
  lastAccessedAt?: Date;
}

// Audit log entry
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  details?: string;
  timestamp: Date;
}
