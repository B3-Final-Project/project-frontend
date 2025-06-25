'use client'
import { ReactNode } from "react"
import { useAuth } from "react-oidc-context"
import { useRouter } from "next/navigation";

interface AdminGateProps {
  children: ReactNode
}

export const AdminGate = ({children}: AdminGateProps) => {
  const auth = useAuth()
  const router = useRouter()
  const groups = auth.user?.profile?.["cognito:groups"] as string[] | undefined
  const isAdmin = groups && groups.includes("admin")

  if (!isAdmin) {
    router.replace('/')
  }

  return <>{children}</>
}
