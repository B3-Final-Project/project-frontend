import BoosterRedirect from "./BoosterRedirect";
import MatchList from "./MatchList";

export default function UserDashboard() {
  return (
    <main className="flex flex-col min-h-[calc(100vh-130px)] p-4 md:p-6 lg:p-8 gap-8">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Hero section */}
        <div className="w-full p-6 lg:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">Welcome to Holomatch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-4">Discover new connections and expand your network</p>
        </div>

        {/* Main content */}
        <div className="space-y-10">
          {/* Matches section */}
          <section className="bg-card/70 rounded-xl p-4 md:p-6 shadow-sm">
            <MatchList />
          </section>

          {/* Boosters redirect section */}
          <section>
            <BoosterRedirect />
          </section>
        </div>
      </div>
    </main>
  );
}
