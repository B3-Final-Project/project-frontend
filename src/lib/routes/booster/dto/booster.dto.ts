import { RelationshipTypeEnum } from "@/lib/routes/profiles/enums";

export interface BoosterPackDto {
  id: string,
  name: string,
  imageUrl: string,
  type: RelationshipTypeEnum,
}
