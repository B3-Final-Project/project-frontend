import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RegisterDto } from "@/lib/routes/auth/dto/register.dto";
import { LoginDto } from "@/lib/routes/auth/dto/login.dto";
import { AuthRouter } from "@/lib/routes/auth";
import { toast } from "@/hooks/use-toast";

// Hook for Register Mutation
export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterDto) => AuthRouter.register(data),
    onSuccess: (data) => {
      console.log("Registration successful", data);
      queryClient.invalidateQueries({ queryKey: ["user"] }); // Refresh user data
      toast({
        title: "Registered Successfully",
        })
    },
    onError: (error) => {
      console.error("Registration failed", error);
      toast({
        title: "Something went wrong, user not created",
      })
    },
  });
}

// Hook for Login Mutation
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginDto) => AuthRouter.login(data),
    onSuccess: (data) => {
      console.log("Login successful", data);
      queryClient.invalidateQueries({ queryKey: ["user"] }); // Refresh user state
      toast({
        title: "Logged In Successfully",
      })
    },
    onError: (error) => {
      console.error("Login failed", error);
      toast({
        title: "Something went wrong, account not confirmed",
      })
    },
  });
}

// Hook for Confirm Account Mutation
export function useConfirmAccountMutation() {
  return useMutation({
    mutationFn: async (data: { username: string; code: string }) =>
      AuthRouter.confirm(data),
    onSuccess: (data) => {
      console.log("Account confirmed", data);
      toast({
        title: "Account Confirmed",
      })
    },
    onError: (error) => {
      console.error("Account confirmation failed", error);
      toast({
        title: "Something went wrong, couldn't log in",
      })
    },
  });
}
