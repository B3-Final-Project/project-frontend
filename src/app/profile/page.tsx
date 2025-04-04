import { Background } from "@/components/Background";

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Background />
      <div className="relative z-10 flex flex-col items-center justify-center">
        <h1>Profile</h1>
      </div>
    </div>
  );
}
