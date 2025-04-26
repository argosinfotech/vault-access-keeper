
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
      signInWithPassword: () => createMockResponse({ user: null, session: null }),
      signOut: () => createMockResponse({}),
      signUp: () => createMockResponse({ user: null, session: null }),
    },
    from: (table: string) => {
      const mockChain = {
        select: () => mockChain,
        insert: () => mockChain,
        update: () => mockChain,
        delete: () => mockChain,
        eq: () => mockChain,
        single: () => createMockResponse(),
      };
      return mockChain;
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
