import { StepComponent } from "@/components/profile/create/StepComponent";
import { ProfileGate } from "@/components/profile/create/ProfileGate";

export function CreationPage() {
  return (
    <ProfileGate>
      <div className="h-full flex mx-auto justify-center flex-col">
        <StepComponent />
      </div>
    </ProfileGate>
  );
}
