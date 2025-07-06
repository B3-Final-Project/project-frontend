import { useMatchesQuery } from "@/hooks/react-query/matches";
import Image from "next/image";

export default function MatchList() {
  const query = useMatchesQuery();

  return (
    <div className="flex flex-col gap-4">
      <h2>Your Matches</h2>
      {query.isLoading ? (
        <p>Loading matches...</p>
      ) : query.isError ? (
        <p>Error loading matches: {query.error.message}</p>
      ) : (
        <ul className="list-disc">
          {query.data && Array.isArray(query.data) && query.data.length > 0 
            ? query.data.map((match, index) => (
              <li key={index} className="flex items-center gap-4">
                <Image
                  src={match.imageUrl && match.imageUrl.trim() !== "" ? match.imageUrl : "/vintage.png"}
                  alt={match.name ?? "Match"}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <span className="text-lg">{match.name}</span>
              </li>
            ))
            : <li>No matches available</li>
          }
        </ul>
      )}
    </div>
  );
}
