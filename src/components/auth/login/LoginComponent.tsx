'use client'
import z, { ZodType } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginDto } from "@/lib/routes/auth/dto/login.dto";
import AuthForm from "@/components/auth/AuthForm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const loginSchema: ZodType<LoginDto> = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .nonempty("Email is required")
    .email("Please enter a valid email"),
  password: z.string({ required_error: "Password is required" }).nonempty("Password is required"),
})

export type LoginFormInputs = z.infer<typeof loginSchema>

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  })
  const {register, formState: {errors}} = form



  return (
    <AuthForm className={className} form={form} isLogin={true}  props={props}>
      <div className="grid gap-2">
        <Label htmlFor="username">Email</Label>
        <Input
          id="username"
          type="email"
          placeholder="m@example.com"
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
