'use client'
import { useRouter } from "next/navigation";

export default function Page(){
  const router = useRouter()
  return router.push("http://localhost:8080/api/auth/cognito/login")
  // return <div className={'flex w-full h-screen items-center justify-center'}>
  //   <LoginForm/>
  // </div>
}
