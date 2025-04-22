
import { createClient } from "@supabase/supabase-js";

// These environment variables are set by Lovable/Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if Supabase configuration is missing
const createMockClient = () => {
  console.warn("Using mock Supabase client. Connect to Supabase for full functionality.");
  
  // Create a basic mock response with data and error properties
  const createMockResponse = (data: any = null, error: any = null) => {
    return Promise.resolve({ data, error });
  };
  
  return {
    auth: {
      getUser: () => createMockResponse({ user: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            select: () => ({
              single: () => createMockResponse({ id: "mock-id" })
            }),
          }),
          single: () => createMockResponse({ id: "mock-id" }),
          order: () => createMockResponse([]),
        }),
        order: () => createMockResponse([]),
      }),
      insert: () => ({
        select: () => ({
          single: () => createMockResponse({ 
            id: "mock-id", 
            user_id: "user-id", 
            application_id: "app-id", 
            permission: "viewer", 
            created_at: new Date().toISOString(), 
            updated_at: new Date().toISOString() 
          }),
        }),
      }),
      update: () => ({
        eq: () => ({
          eq: () => ({
            select: () => ({
              single: () => createMockResponse({ 
                id: "mock-id", 
                user_id: "user-id", 
                application_id: "app-id", 
                permission: "admin", 
                created_at: new Date().toISOString(), 
                updated_at: new Date().toISOString() 
              }),
            }),
          }),
          select: () => ({
            single: () => createMockResponse({ id: "mock-id" }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => ({
          eq: () => createMockResponse(),
          order: () => createMockResponse([]),
        }),
      }),
    }),
    functions: {
      invoke: (name: string, options: any) => {
        console.log(`Mocked function call to ${name}`, options);
        return createMockResponse({});
      },
    },
  };
};

// Create the Supabase client (real or mock)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();
