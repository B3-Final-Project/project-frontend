'use client'
import { usePreferenceQuery } from "@/hooks/react-query/preferences";

export default function HomePage() {
  const query = usePreferenceQuery()

  if (query.data) {
    return <div>{JSON.stringify(query.data)}</div>
  }
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
