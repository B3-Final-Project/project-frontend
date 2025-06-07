import BoosterList from "./BoosterList";
import MatchList from "./MatchList";

export default function UserDashboard() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1>My Matches</h1>
      <MatchList/>
      <h1>Open a Booster</h1>
      <BoosterList/>
    </main>
  )
}
