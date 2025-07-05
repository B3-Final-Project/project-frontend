import BoosterList from "../boosters/BoosterList";
import MatchList from "@/components/home/MatchList";

export default function UserDashboard() {
  return (
    <main className="flex flex-col p-16">
      <MatchList />
      <BoosterList />
    </main>
  );
}
