import { useProfileMatchesQuery } from "@/hooks/react-query/profiles";
import Image from "next/image";

export default function MatchList() {
  const query = useProfileMatchesQuery()

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Your Matches</h2>
      {query.isLoading ? (
        <p>Loading matches...</p>
      ) : query.isError ? (
        <p>Error loading matches: {query.error.message}</p>
      ) : (
        <ul className="list-disc">
          {query.data!.matches.map((match) =>
            <li key={match.id} className="flex items-center gap-4">
              <Image
                src={match.imageUrl}
                alt={match.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full"
              />
              <span className="text-lg">{match.name}</span>
            </li>
          )
          }
        </ul>
      )}
    </div>
  )
}
