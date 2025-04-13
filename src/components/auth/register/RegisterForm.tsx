'use client'
import z, { ZodType } from "zod";
import { RegisterDto } from "@/lib/routes/auth/dto/register.dto";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthForm from "@/components/auth/AuthForm";
import { ComponentPropsWithoutRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const registerSchema: ZodType<RegisterDto> = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .nonempty("Username is required")
    .min(3,"Username must be at least 3 characters long")
    .max(12,"Username can be a maximum of 12 characters"),
  password: z
    .string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
  email: z
    .string({ required_error: "Email is required" })
    .nonempty("Email is required")
    .email("Please enter a valid email"),
})

export type RegisterFormInputs = z.infer<typeof registerSchema>

export default function RegisterForm({className, ...props}: ComponentPropsWithoutRef<"div">){
  const form = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  })
  const {register, formState: {errors}} = form

  return (
    <AuthForm form={form} className={className} props={props} isLogin={false} >
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="username">Username</Label>
        </div>
        <Input id="username" type="username" {...register("username")} />
        {errors.username && (
          <p className="text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <a
            href="#"
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
    </AuthForm>
  )
}
