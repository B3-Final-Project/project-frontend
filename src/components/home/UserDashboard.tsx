import BoosterList from "../boosters/BoosterList";
import MatchList from "@/components/home/MatchList";

export default function UserDashboard() {
  return (
    <main className="flex flex-col h-screen px-4 py-2">
      <MatchList />
      <BoosterList />
    </main>
  );
}
