
import { User, UserRole, Credential, EnvironmentType, CategoryType, AuditLog } from "@/types";

// Mock users for demonstration
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@company.com",
    role: UserRole.ADMIN,
    createdAt: new Date("2023-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@company.com",
    role: UserRole.MANAGER,
    createdAt: new Date("2023-02-15"),
    lastLogin: new Date(),
  },
  {
    id: "3",
    name: "Viewer User",
    email: "viewer@company.com",
    role: UserRole.VIEWER,
    createdAt: new Date("2023-03-20"),
    lastLogin: new Date(),
  },
];

// Mock credentials for demonstration
export const mockCredentials: Credential[] = [
  {
    id: "cred-1",
    title: "Main Website Admin",
    username: "admin",
    password: "secureP@ssw0rd123!",
    url: "https://admin.company.com",
    environment: EnvironmentType.PRODUCTION,
    category: CategoryType.APPLICATION,
    notes: "Admin access for the main company website",
    createdBy: "1",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-06-15"),
    lastAccessedBy: "2",
    lastAccessedAt: new Date("2023-08-01"),
  },
  {
    id: "cred-2",
    title: "Database Production",
    username: "db_admin",
    password: "dbP@ssw0rd!2023",
    url: "postgres://db.company.com:5432",
    environment: EnvironmentType.PRODUCTION,
    category: CategoryType.DATABASE,
    notes: "Main production database credentials",
    createdBy: "1",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-07-01"),
  },
  {
    id: "cred-3",
    title: "AWS Hosting Account",
    username: "aws_user",
    password: "Cl0udH0st!ng2023",
    url: "https://console.aws.amazon.com",
    environment: EnvironmentType.PRODUCTION,
    category: CategoryType.HOSTING,
    notes: "Main AWS account for production servers",
    createdBy: "1",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-05-10"),
  },
  {
    id: "cred-4",
    title: "API Gateway",
    username: "api_user",
    password: "ApiK3y!2023",
    url: "https://api.company.com",
    environment: EnvironmentType.STAGING,
    category: CategoryType.API,
    notes: "API gateway for staging environment",
    createdBy: "2",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-07-22"),
  },
  {
    id: "cred-5",
    title: "Staging Website",
    username: "stage_admin",
    password: "St@geTest!ng123",
    url: "https://staging.company.com",
    environment: EnvironmentType.STAGING,
    category: CategoryType.APPLICATION,
    notes: "Staging website admin credentials",
    createdBy: "2",
    createdAt: new Date("2023-04-05"),
    updatedAt: new Date("2023-08-10"),
  },
];

// Mock audit logs for demonstration
export const mockAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    userId: "1",
    action: "CREDENTIAL_CREATE",
    targetId: "cred-1",
    targetType: "credential",
    details: "Created credential: Main Website Admin",
    timestamp: new Date("2023-01-10T10:30:00"),
  },
  {
    id: "log-2",
    userId: "2",
    action: "CREDENTIAL_VIEW",
    targetId: "cred-1",
    targetType: "credential",
    details: "Viewed credential: Main Website Admin",
    timestamp: new Date("2023-08-01T14:45:00"),
  },
  {
    id: "log-3",
    userId: "1",
    action: "USER_CREATE",
    targetId: "3",
    targetType: "user",
    details: "Created user: Viewer User",
    timestamp: new Date("2023-03-20T09:15:00"),
  },
  {
    id: "log-4",
    userId: "1",
    action: "CREDENTIAL_UPDATE",
    targetId: "cred-2",
    targetType: "credential",
    details: "Updated credential: Database Production",
    timestamp: new Date("2023-07-01T16:20:00"),
  },
  {
    id: "log-5",
    userId: "3",
    action: "CREDENTIAL_VIEW",
    targetId: "cred-5",
    targetType: "credential",
    details: "Viewed credential: Staging Website",
    timestamp: new Date("2023-08-15T11:10:00"),
  },
];

// Current logged in user
export const currentUser: User = mockUsers[0]; // Admin user by default
