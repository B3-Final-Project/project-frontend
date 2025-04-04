import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RegisterDto } from "@/lib/routes/auth/dto/register.dto";
import { LoginDto } from "@/lib/routes/auth/dto/login.dto";
import { AuthRouter } from "@/lib/routes/auth";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { setAccessTokenHeaders } from "@/lib/utils";
import { AxiosError } from "axios";

// Hook for Register Mutation
export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: RegisterDto) => AuthRouter.register(data),
    onSuccess: (data) => {
      console.log("Registration successful", data);
      queryClient.invalidateQueries({ queryKey: ["user"] }); // Refresh user data
      toast({
        title: "Registered Successfully",
        })
      router.push("/confirm")
    },
    onError: (error) => {
      console.error("Registration failed", error);
      toast({
        variant: "destructive",
        title: "Something went wrong, user not created",
        description: process.env.NODE_ENV && error.cause + error.message
      })
    },
  });
}

// Hook for Login Mutation
export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: LoginDto) => AuthRouter.login(data),
    onSuccess: (data) => {
      console.log("Login successful", data);
      queryClient.invalidateQueries({ queryKey: ["user"] }); // Refresh user state
      setAccessTokenHeaders(data.AccessToken)
      toast({
        title: "Logged In Successfully",
      })
      router.push('/')
    },
    onError: (error: AxiosError) => {
      console.error("Login failed", error);
      toast({
        variant: "destructive",
        title: "Something went wrong, couldn't log in",
        description: process.env.NODE_ENV && error.cause + error.message
      })
    },
  });
}

// Hook for Confirm Account Mutation
export function useConfirmAccountMutation() {
  const router = useRouter()
  return useMutation({
    mutationFn: async (data: { username: string; code: string }) =>
      AuthRouter.confirm(data),
    onSuccess: (data) => {
      console.log("Account confirmed", data);
      toast({
        title: "Account Confirmed",
      })
      router.push('/')
    },
    onError: (error) => {
      console.error("Account confirmation failed", error);
      toast({
        variant: "destructive",
        title: "Something went wrong, couldn't log in",
        description: process.env.NODE_ENV && error.cause + error.message
      })
    },
  });
}
