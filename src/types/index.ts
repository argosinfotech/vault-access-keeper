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

// Category types for organizing credentials
export enum CategoryType {
  APPLICATION = "application",
  DATABASE = "database",
  HOSTING = "hosting",
  API = "api", 
  EMAIL = "email",
  OTHER = "other",
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
  category: CategoryType;
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
