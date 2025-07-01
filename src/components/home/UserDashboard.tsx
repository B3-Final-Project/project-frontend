import BoosterList from "./BoosterList";
import MatchList from "./MatchList";

export default function UserDashboard() {
  return (
    <main className="flex flex-col h-screen p-16">
      <MatchList />
      <BoosterList />
    </main>
  );
}
