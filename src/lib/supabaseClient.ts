
import { createClient } from "@supabase/supabase-js";

// These environment variables are set by Lovable/Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if Supabase configuration is missing
const createMockClient = () => {
  console.warn("Using mock Supabase client. Connect to Supabase for full functionality.");
  
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ 
            data: { 
              id: "mock-id", 
              user_id: "user-id", 
              application_id: "app-id", 
              permission: "viewer", 
              created_at: new Date().toISOString(), 
              updated_at: new Date().toISOString() 
            }, 
            error: null 
          }),
        }),
      }),
      update: () => ({
        eq: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ 
                data: { 
                  id: "mock-id", 
                  user_id: "user-id", 
                  application_id: "app-id", 
                  permission: "admin", 
                  created_at: new Date().toISOString(), 
                  updated_at: new Date().toISOString() 
                }, 
                error: null 
              }),
            }),
          }),
          select: () => ({
            single: () => Promise.resolve({ data: { id: "mock-id" }, error: null }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ error: null }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
    functions: {
      invoke: (name, options) => {
        console.log(`Mocked function call to ${name}`, options);
        return Promise.resolve({ data: {}, error: null });
      },
    },
  };
};

// Create the Supabase client (real or mock)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();
