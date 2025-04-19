import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ComponentPropsWithoutRef, ReactNode, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { LoginFormInputs } from "@/components/auth/login/LoginComponent";
import { RegisterFormInputs } from "@/components/auth/register/RegisterForm";
import { UseFormReturn } from "react-hook-form";
import { cn, setAccessTokenHeaders } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { AuthRouter } from "@/lib/routes/auth";
import Link from "next/link";

// Define a type for the component props.
interface AuthFormProps {
  readonly isLogin: boolean;
  readonly form: UseFormReturn<LoginFormInputs> | UseFormReturn<RegisterFormInputs>;
  readonly props: ComponentPropsWithoutRef<"div">;
  readonly children: ReactNode;
  readonly className?: string;
}

export default function AuthForm({ isLogin, className, form, children, ...props }: AuthFormProps) {
  const { handleSubmit } = form;
  const auth = useAuth();

  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const response = await AuthRouter.me()
        if (response) {
          setAccessTokenHeaders(response.accessToken);
        } else {
          console.error("Failed to fetch access token, response:", response);
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    }
    fetchAccessToken();
  }, []);

  const onSubmit = (data: LoginFormInputs | RegisterFormInputs) => {
    try {
      if (isLogin) {
        auth.login(data as LoginFormInputs);
      } else {
        auth.register(data as RegisterFormInputs);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const googleAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || 'http://localhost:8080/api/auth/google';

  // Handler for Google Sign-In button click.
  const handleGoogleSignIn = () => {
    // Optionally, add loading state or analytics tracking here.
    window.location.href = googleAuthUrl;
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="px-10">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            {/* Google Sign-In Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              aria-label="Sign in with Google"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Login with Google
            </Button>
          </div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                {children}
                <Button type="submit" className="w-full">
                  {isLogin ? "Login" : "Register"}
                </Button>
              </div>
              {isLogin ? (
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              ) : (
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Sign in
                  </Link>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
