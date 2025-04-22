'use client'
import { useRouter } from "next/navigation";
import { usePreferenceQuery } from "@/hooks/react-query/preferences";

export default function Page(){
  const router = useRouter();
  const query = usePreferenceQuery()

  if (!query.data){
    router.push("/profile/create/welcome")
  }


  if (query.data){
    return JSON.stringify(query.data)
  }
}
