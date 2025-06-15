import { ProfilesGate } from "@/components/profile/create/ProfilesGate";
import { StepComponent } from "@/components/profile/create/StepComponent";

export function ProfilesCreationPage() {
  return (
    <ProfilesGate>
      <div className="h-full flex mx-auto justify-center flex-col">
        <StepComponent />
      </div>
    </ProfilesGate>
  );
}
