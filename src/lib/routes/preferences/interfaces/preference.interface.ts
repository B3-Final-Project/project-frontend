import { Interest } from "@/lib/routes/preferences/interfaces/interface";
import { RelationshipTypeEnum } from "@/lib/routes/preferences/enums";

export interface Preference {
  id: number;
  min_age?: number;
  max_age?: number;
  gender_preference?: number;
  max_distance?: number;
  relationship_type?: RelationshipTypeEnum;
  user_id: string;
  interests?: Interest[];
}
