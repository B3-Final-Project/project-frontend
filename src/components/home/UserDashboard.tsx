import BoosterList from "../boosters/BoosterList";
import MatchList from "@/components/home/MatchList";

export default function UserDashboard() {
  return (
    <main className="flex flex-col h-[calc(100vh-130px)] px-4 py-2 justify-between">
      <MatchList />
      <BoosterList />
      <div className="h-10"></div>
    </main>
  );
}
