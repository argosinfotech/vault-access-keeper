
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
  
  // Helper function to create consistent mock method chains
  const createMockChain = () => {
    const methods = {
      single: () => createMockResponse({ id: "mock-id" }),
      eq: () => methods,
      neq: () => methods,
      lt: () => methods,
      lte: () => methods,
      gt: () => methods,
      gte: () => methods,
      like: () => methods,
      ilike: () => methods,
      in: () => methods,
      contains: () => methods,
      containedBy: () => methods,
      rangeLt: () => methods,
      rangeGt: () => methods,
      rangeGte: () => methods,
      rangeLte: () => methods,
      textSearch: () => methods,
      match: () => methods,
      not: () => methods,
      filter: () => methods,
      or: () => methods,
      select: () => methods,
      order: () => createMockResponse([]),
      limit: () => methods,
      range: () => methods,
      maybeSingle: () => createMockResponse({ id: "mock-id" }),
    };
    return methods;
  };

  return {
    auth: {
      getUser: () => createMockResponse({ user: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: (table: string) => {
      const methods = {
        select: () => createMockChain(),
        insert: (values: any) => ({
          select: () => ({
            single: () => createMockResponse({ 
              id: "mock-id", 
              user_id: "user-id", 
              application_id: "app-id", 
              permission: "viewer", 
              created_at: new Date().toISOString(), 
              updated_at: new Date().toISOString() 
            }),
            maybeSingle: () => createMockResponse({ id: "mock-id" }),
          }),
          ...createMockChain()
        }),
        update: (values: any) => ({
          eq: (column: string, value: any) => ({
            eq: (column2: string, value2: any) => ({
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
            ...createMockChain()
          }),
          ...createMockChain()
        }),
        delete: () => ({
          eq: (column: string, value: any) => ({
            eq: (column2: string, value2: any) => createMockResponse(),
            ...createMockChain()
          }),
          ...createMockChain()
        }),
        ...createMockChain()
      };
      return methods;
    },
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
