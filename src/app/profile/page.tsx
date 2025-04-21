import { useRouter } from "next/navigation";
import { usePreferenceQuery } from "@/hooks/react-query/preferences";

export function Page(){
  const router = useRouter();
  const query = usePreferenceQuery()

  if (!query.data){
    router.push("create/welcome")
  }

  if (query.data){
    return JSON.stringify(query.data)
  }
}
