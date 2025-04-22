import { User, UserRole, Application, Credential, AuditLog, EnvironmentType, CategoryType } from "@/types";

// Mock current user (for development)
export const currentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: UserRole.ADMIN,
  createdAt: new Date("2023-01-01T00:00:00"),
  lastLogin: new Date("2024-01-20T14:30:00")
};

export const mockUsers = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: UserRole.ADMIN,
    createdAt: new Date("2023-01-01T00:00:00"),
    lastLogin: new Date("2024-01-20T14:30:00")
  },
  {
    id: "user-2",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    role: UserRole.MANAGER,
    createdAt: new Date("2023-02-15T08:00:00"),
    lastLogin: new Date("2024-01-22T09:45:00")
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: UserRole.VIEWER,
    createdAt: new Date("2023-03-10T12:00:00"),
    lastLogin: new Date("2024-01-21T18:20:00")
  }
];

// Add application mockdata
export const mockApplications = [
  {
    id: "app-1",
    name: "Frontend Web App",
    description: "Main customer-facing web application",
    createdBy: "user-1",
    createdAt: new Date("2023-11-15T10:00:00"),
    updatedAt: new Date("2023-11-15T10:00:00")
  },
  {
    id: "app-2",
    name: "Admin Portal",
    description: "Internal admin management system",
    createdBy: "user-1",
    createdAt: new Date("2023-10-25T10:00:00"),
    updatedAt: new Date("2023-11-10T10:00:00")
  },
  {
    id: "app-3",
    name: "Customer Database",
    description: "Main database for customer records",
    createdBy: "user-2",
    createdAt: new Date("2023-09-15T10:00:00"),
    updatedAt: new Date("2023-10-05T10:00:00")
  }
];

// Update some credentials to link to applications
export const mockCredentials = [
  {
    id: "cred-1",
    title: "Frontend Web App - Production",
    username: "admin",
    password: "securePass123!",
    url: "https://app.example.com",
    environment: EnvironmentType.PRODUCTION,
    category: CategoryType.LIVE_APPLICATION,
    applicationId: "app-1",
    notes: "Main production credentials",
    createdBy: "user-1",
    createdAt: new Date("2023-11-15T10:00:00"),
    updatedAt: new Date("2023-12-01T14:30:00"),
    lastAccessedBy: "user-2",
    lastAccessedAt: new Date("2024-03-10T09:15:00")
  },
  {
    id: "cred-2",
    title: "Frontend Web App - Staging",
    username: "developer",
    password: "dev-password-456",
    url: "https://staging.example.com",
    environment: EnvironmentType.STAGING,
    category: CategoryType.STAGING_APPLICATION,
    applicationId: "app-1",
    createdBy: "user-1",
    createdAt: new Date("2023-10-20T11:00:00"),
    updatedAt: new Date("2023-11-25T16:45:00")
  },
  {
    id: "cred-3",
    title: "Admin Portal - Production",
    username: "administrator",
    password: "admin-secret!",
    url: "https://admin.example.com",
    environment: EnvironmentType.PRODUCTION,
    category: CategoryType.LIVE_APPLICATION,
    applicationId: "app-2",
    notes: "Admin access",
    createdBy: "user-2",
    createdAt: new Date("2023-09-01T15:00:00"),
    updatedAt: new Date("2023-12-20T10:20:00"),
    lastAccessedBy: "user-1",
    lastAccessedAt: new Date("2024-01-18T11:00:00")
  },
  {
    id: "cred-4",
    title: "Customer DB - Read Only",
    username: "readonly_user",
    password: "db-read-only",
    environment: EnvironmentType.PRODUCTION,
    category: CategoryType.PRODUCTION_HOSTING,
    applicationId: "app-3",
    notes: "Read-only access for reporting",
    createdBy: "user-2",
    createdAt: new Date("2023-08-10T09:30:00"),
    updatedAt: new Date("2023-11-15T12:40:00")
  },
  {
    id: "cred-5",
    title: "SMTP Server",
    username: "smtp_user",
    password: "smtp-password",
    url: "smtp.example.com",
    environment: EnvironmentType.PRODUCTION,
    category: CategoryType.OTHER,
    notes: "Credentials for sending emails",
    createdBy: "user-1",
    createdAt: new Date("2023-07-01T14:00:00"),
    updatedAt: new Date("2023-10-01T18:50:00")
  },
  {
    id: "cred-6",
    title: "API Key - Payments",
    username: "api_payments",
    password: "payments-api-key",
    environment: EnvironmentType.PRODUCTION,
    category: CategoryType.OTHER,
    notes: "API key for processing payments",
    createdBy: "user-3",
    createdAt: new Date("2023-06-15T11:30:00"),
    updatedAt: new Date("2023-06-15T11:30:00")
  },
  {
    id: "cred-7",
    title: "Test Credential",
    username: "testuser",
    password: "testpassword",
    environment: EnvironmentType.TESTING,
    category: CategoryType.OTHER,
    notes: "Just a test credential",
    createdBy: "user-1",
    createdAt: new Date("2023-05-01T16:00:00"),
    updatedAt: new Date("2023-05-01T16:00:00")
  },
];

// Add mock audit logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    userId: "user-1",
    action: "CREDENTIAL_VIEW",
    targetId: "cred-1",
    targetType: "credential",
    details: "Viewed Frontend Web App credentials",
    timestamp: new Date("2024-01-20T14:35:00")
  },
  {
    id: "log-2",
    userId: "user-2",
    action: "CREDENTIAL_UPDATE",
    targetId: "cred-3",
    targetType: "credential",
    details: "Updated Admin Portal password",
    timestamp: new Date("2024-01-19T11:22:00")
  },
  {
    id: "log-3",
    userId: "user-1",
    action: "USER_CREATE",
    targetId: "user-3",
    targetType: "user",
    details: "Created new user: Bob Johnson",
    timestamp: new Date("2024-01-18T09:15:00")
  },
  {
    id: "log-4",
    userId: "user-2",
    action: "CREDENTIAL_CREATE",
    targetId: "cred-7",
    targetType: "credential",
    details: "Created Test Credential",
    timestamp: new Date("2024-01-17T16:40:00")
  },
  {
    id: "log-5",
    userId: "user-1",
    action: "CREDENTIAL_DELETE",
    targetId: "cred-old",
    targetType: "credential",
    details: "Deleted outdated AWS credentials",
    timestamp: new Date("2024-01-16T10:30:00")
  },
  {
    id: "log-6",
    userId: "user-3",
    action: "CREDENTIAL_VIEW",
    targetId: "cred-4",
    targetType: "credential",
    details: "Viewed Customer DB credentials",
    timestamp: new Date("2024-01-15T14:05:00")
  }
];
