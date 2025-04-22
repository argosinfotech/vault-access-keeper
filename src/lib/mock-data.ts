export const mockUsers = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    createdAt: new Date("2023-01-01T00:00:00"),
    lastLogin: new Date("2024-01-20T14:30:00")
  },
  {
    id: "user-2",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    role: "manager",
    createdAt: new Date("2023-02-15T08:00:00"),
    lastLogin: new Date("2024-01-22T09:45:00")
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "viewer",
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
    category: "application",
    createdBy: "user-1",
    createdAt: new Date("2023-11-15T10:00:00"),
    updatedAt: new Date("2023-11-15T10:00:00")
  },
  {
    id: "app-2",
    name: "Admin Portal",
    description: "Internal admin management system",
    category: "application",
    createdBy: "user-1",
    createdAt: new Date("2023-10-25T10:00:00"),
    updatedAt: new Date("2023-11-10T10:00:00")
  },
  {
    id: "app-3",
    name: "Customer Database",
    description: "Main database for customer records",
    category: "database",
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
    environment: "production",
    category: "application",
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
    environment: "staging",
    category: "application",
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
    environment: "production",
    category: "application",
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
    environment: "production",
    category: "database",
    applicationId: "app-3",
    notes: "Read-only access for reporting",
    createdBy: "user-2",
    createdAt: new Date("2023-08-10T09:30:00"),
    updatedAt: new Date("203-11-15T12:40:00")
  },
  {
    id: "cred-5",
    title: "SMTP Server",
    username: "smtp_user",
    password: "smtp-password",
    url: "smtp.example.com",
    environment: "production",
    category: "email",
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
    environment: "production",
    category: "api",
    notes: "API key for processing payments",
    createdBy: "user-3",
    createdAt: new Date("2023-06-15T11:30:00"),
  },
  {
    id: "cred-7",
    title: "Test Credential",
    username: "testuser",
    password: "testpassword",
    environment: "testing",
    category: "other",
    notes: "Just a test credential",
    createdBy: "user-1",
    createdAt: new Date("2023-05-01T16:00:00"),
  },
];
