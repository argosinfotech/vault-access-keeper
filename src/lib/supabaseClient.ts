
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
  
  // Create a consistent response object that always has data and error properties
  const ensureConsistentResponse = (obj: any) => {
    // Add a then method that always returns a properly structured response
    const original = obj;
    obj.then = (resolve: any) => resolve({ data: [], error: null });
    return obj;
  };

  // Helper function to create consistent mock method chains
  const createMockChain = () => {
    const chain: any = {
      data: [],
      error: null,
      then: (callback: any) => callback({ data: [], error: null }),
    };
    
    const methods = [
      'single', 'eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'like', 'ilike', 'in',
      'contains', 'containedBy', 'rangeLt', 'rangeGt', 'rangeGte', 'rangeLte',
      'textSearch', 'match', 'not', 'filter', 'or', 'select', 'order', 'limit',
      'range', 'maybeSingle'
    ];
    
    methods.forEach(method => {
      chain[method] = () => chain;
    });
    
    return chain;
  };

  return {
    auth: {
      getUser: () => createMockResponse({ user: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: (table: string) => {
      const mockChain = createMockChain();
      
      return {
        select: () => mockChain,
        insert: (values: any) => ({
          ...mockChain,
          select: () => ({
            ...mockChain,
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
        update: (values: any) => ({
          ...mockChain,
          eq: (column: string, value: any) => ({
            ...mockChain,
            eq: (column2: string, value2: any) => ({
              ...mockChain,
              select: () => ({
                ...mockChain,
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
          }),
        }),
        delete: () => ({
          ...mockChain,
          eq: (column: string, value: any) => ({
            ...mockChain,
            eq: (column2: string, value2: any) => createMockResponse(),
          }),
        }),
      };
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
