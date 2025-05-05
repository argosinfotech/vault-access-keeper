import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, UserRole } from "@/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { addUser, updateUser, userRoleToString, mapUserRoleToRoleId } from "@/api/userApi";

interface UserFormProps {
  mode: "add" | "edit";
  user?: User | null;
  onCompleted: () => void;
  onCancel: () => void;
}

type FormValues = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
};

const UserForm = ({ mode, user, onCompleted, onCancel }: UserFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Split the name into first and last name parts if it contains a space
  const getNameParts = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length > 1) {
      return {
        firstName: parts[0],
        lastName: parts.slice(1).join(' ')
      };
    }
    return {
      firstName: fullName,
      lastName: ''
    };
  };

  const nameParts = user?.name ? getNameParts(user.name) : { firstName: '', lastName: '' };

  const form = useForm<FormValues>({
    defaultValues: {
      username: user?.name || "",
      email: user?.email || "",
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      password: "",
      confirmPassword: "",
      role: user?.role || UserRole.VIEWER,
    },
  });

  useEffect(() => {
    if (user) {
      const nameParts = getNameParts(user.name);
      form.reset({
        username: user.name,
        email: user.email,
        firstName: nameParts.firstName,
        lastName: nameParts.lastName,
        password: "",
        confirmPassword: "",
        role: user.role,
      });
    }
  }, [user, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // Password validation for new users
      if (mode === "add" && !values.password) {
        toast({ 
          title: "Password required", 
          description: "Password is required for new users", 
          variant: "destructive" 
        });
        return;
      }

      // Password confirmation check
      if (values.password && values.password !== values.confirmPassword) {
        toast({ 
          title: "Passwords don't match", 
          description: "Please ensure passwords match", 
          variant: "destructive" 
        });
        return;
      }

      if (mode === "add") {
        // Create new user
        await addUser({
          username: values.username,
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          userRoleId: mapUserRoleToRoleId(values.role),
          isActive: true
        });
        toast({ title: "User added", description: "User has been created successfully" });
        
        // Ensure callback is called after successful addition
        onCompleted();
      } else if (user) {
        // Update existing user
        const updateData: any = {
          username: values.username,
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          userRoleId: mapUserRoleToRoleId(values.role),
        };

        // Only include password if it was changed
        if (values.password) {
          updateData.password = values.password;
        }

        await updateUser(user.id, updateData);
        toast({ title: "User updated", description: "User has been updated successfully" });
        
        // Ensure callback is called after successful update
        onCompleted();
      }
    } catch (error: any) {
      console.error("Error saving user:", error);
      
      // Extract error message from API response
      const errorMessage = error.response?.data?.message || error.message || "There was a problem saving the user";
      
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="username"
          control={form.control}
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          name="email"
          control={form.control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^@]+@[^@]+\.[^@]+$/,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="password"
          control={form.control}
          rules={{ required: mode === "add" ? "Password is required" : false }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{mode === "add" ? "Password" : "New Password (leave blank to keep current)"}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="confirmPassword"
          control={form.control}
          rules={{ 
            validate: (value) => !form.getValues("password") || value === form.getValues("password") || "Passwords don't match" 
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="role"
          control={form.control}
          rules={{ required: "Role is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <select
                  className="w-full border rounded-md px-2 py-2"
                  {...field}
                >
                  <option value={UserRole.ADMIN}>Administrator</option>
                  <option value={UserRole.MANAGER}>Manager</option>
                  <option value={UserRole.VIEWER}>Viewer</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (mode === "add" ? "Add User" : "Save Changes")}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
