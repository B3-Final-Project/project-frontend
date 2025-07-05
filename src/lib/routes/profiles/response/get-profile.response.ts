import { Profile } from "@/lib/routes/profiles/interfaces/profile.interface";
import { User } from "@/lib/routes/profiles/interfaces/user.interface";

export interface GetProfileResponse {
  profile: Profile;
  user: User;
}
