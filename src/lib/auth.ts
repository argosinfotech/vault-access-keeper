
import { supabase } from "@/lib/supabaseClient";
import { UserRole } from "@/types";
import { toast } from "sonner";

// Types for authentication
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
    // Authenticate with Supabase
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!data.user) return { user: null, error: "Authentication failed" };

    // Get user profile from database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return { 
        user: null, 
        error: "Your account exists but profile data could not be loaded" 
      };
    }

    // If no user profile exists yet, create one (this might happen for new sign-ups)
    if (!userData) {
      return { 
        user: null, 
        error: "User profile not found. Please contact an administrator." 
      };
    }

    // Update last login time
    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", data.user.id);

    // Return user data
    return {
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role as UserRole,
      },
      error: null,
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return { user: null, error: error.message || "Failed to authenticate" };
  }
};

// Sign out
export const signOut = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error("Sign out error:", error);
    toast.error("Failed to sign out");
    return false;
  }
};

// Create a new user (admin function)
export const createUser = async (
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<{ success: boolean; error: string | null; userId: string | null }> => {
  try {
    // First, create the authentication user
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!data.user) return { success: false, error: "Failed to create user", userId: null };

    // Then, create the user profile in our users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([
        {
          id: data.user.id,
          email,
          name,
          role,
        },
      ])
      .select()
      .single();

    if (userError) {
      // If profile creation fails, we should ideally clean up the auth user
      console.error("Error creating user profile:", userError);
      return { 
        success: false, 
        error: "User created but profile setup failed", 
        userId: data.user.id 
      };
    }

    return { 
      success: true, 
      error: null, 
      userId: userData.id 
    };
  } catch (error: any) {
    console.error("Create user error:", error);
    return { 
      success: false, 
      error: error.message || "Failed to create user", 
      userId: null 
    };
  }
};

// Check current authentication state
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    
    if (!authData.user) return null;
    
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (userError || !userData) {
      console.error("Error fetching current user:", userError);
      return null;
    }
    
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role as UserRole,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};
