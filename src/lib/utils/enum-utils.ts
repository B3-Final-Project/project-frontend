import {
  DrinkingEnum,
  GenderEnum,
  OrientationEnum,
  PoliticsEnum,
  RelationshipTypeEnum,
  ReligionEnum,
  SmokingEnum,
  ZodiacEnum,
} from "@/lib/routes/profiles/enums";
import { RarityEnum } from "@/lib/routes/booster/dto/rarity.enum";
import { ReportReason } from "../routes/admin/dto/report.dto";

export function formatGenderEnum(value?: GenderEnum): string {
  switch (value) {
    case GenderEnum.MALE:
      return "Male";
    case GenderEnum.FEMALE:
      return "Female";
    case GenderEnum.NON_BINARY:
      return "Non-Binary";
    case GenderEnum.OTHER:
      return "Other";
    default:
      return "";
  }
}

export function formatOrientationEnum(value?: OrientationEnum): string {
  switch (value) {
    case OrientationEnum.STRAIGHT:
      return "Straight";
    case OrientationEnum.GAY:
      return "Gay";
    case OrientationEnum.LESBIAN:
      return "Lesbian";
    case OrientationEnum.BISEXUAL:
      return "Bisexual";
    case OrientationEnum.PANSEXUAL:
      return "Pansexual";
    case OrientationEnum.ASEXUAL:
      return "Asexual";
    case OrientationEnum.OTHER:
      return "Other";
    default:
      return "";
  }
}

export function formatRelationshipTypeEnum(value?: RelationshipTypeEnum): string {
  switch (value) {
    case RelationshipTypeEnum.CASUAL:
      return "Casual Dating";
    case RelationshipTypeEnum.LONG_TERM:
      return "Long-Term Relationship";
    case RelationshipTypeEnum.MARRIAGE:
      return "Marriage";
    case RelationshipTypeEnum.FRIENDSHIP:
      return "Friendship";
    case RelationshipTypeEnum.UNSURE:
      return "Not Sure Yet";
    case RelationshipTypeEnum.ANY:
    default:
      return "Any Type";
  }
}

export function formatSmokingEnum(value?: SmokingEnum): string {
  switch (value) {
    case SmokingEnum.NEVER:
      return "Never";
    case SmokingEnum.OCCASIONALLY:
      return "Occasionally";
    case SmokingEnum.REGULARLY:
      return "Regularly";
    case SmokingEnum.TRYING_TO_QUIT:
      return "Trying to Quit";
    case SmokingEnum.UNKNOWN:
      return "Prefer Not to Say";
    default:
      return "";
  }
}

export function formatDrinkingEnum(value?: DrinkingEnum): string {
  switch (value) {
    case DrinkingEnum.NEVER:
      return "Never";
    case DrinkingEnum.SOCIALLY:
      return "Socially";
    case DrinkingEnum.REGULARLY:
      return "Regularly";
    default:
      return "";
  }
}

export function formatReligionEnum(value?: ReligionEnum): string {
  switch (value) {
    case ReligionEnum.ATHEIST:
      return "Atheist";
    case ReligionEnum.AGNOSTIC:
      return "Agnostic";
    case ReligionEnum.BUDDHIST:
      return "Buddhist";
    case ReligionEnum.CHRISTIAN:
      return "Christian";
    case ReligionEnum.HINDU:
      return "Hindu";
    case ReligionEnum.JEWISH:
      return "Jewish";
    case ReligionEnum.MUSLIM:
      return "Muslim";
    case ReligionEnum.SPIRITUAL:
      return "Spiritual";
    case ReligionEnum.OTHER:
      return "Other";
    case ReligionEnum.PREFER_NOT_TO_SAY:
      return "Prefer Not to Say";
    default:
      return "";
  }
}

export function formatPoliticsEnum(value?: PoliticsEnum): string {
  switch (value) {
    case PoliticsEnum.LIBERAL:
      return "Liberal";
    case PoliticsEnum.MODERATE:
      return "Moderate";
    case PoliticsEnum.CONSERVATIVE:
      return "Conservative";
    case PoliticsEnum.NOT_POLITICAL:
      return "Not Political";
    case PoliticsEnum.OTHER:
      return "Other";
    case PoliticsEnum.PREFER_NOT_TO_SAY:
      return "Prefer Not to Say";
    default:
      return "";
  }
}

export function formatZodiacEnum(value?: ZodiacEnum): string {
  switch (value) {
    case ZodiacEnum.ARIES:
      return "Aries";
    case ZodiacEnum.TAURUS:
      return "Taurus";
    case ZodiacEnum.GEMINI:
      return "Gemini";
    case ZodiacEnum.CANCER:
      return "Cancer";
    case ZodiacEnum.LEO:
      return "Leo";
    case ZodiacEnum.VIRGO:
      return "Virgo";
    case ZodiacEnum.LIBRA:
      return "Libra";
    case ZodiacEnum.SCORPIO:
      return "Scorpio";
    case ZodiacEnum.SAGITTARIUS:
      return "Sagittarius";
    case ZodiacEnum.CAPRICORN:
      return "Capricorn";
    case ZodiacEnum.AQUARIUS:
      return "Aquarius";
    case ZodiacEnum.PISCES:
      return "Pisces";
    case ZodiacEnum.DONT_BELIEVE:
      return "Don't Believe in Zodiac Signs";
    default:
      return "";
  }
}

export function formatEnumByField(
  fieldName: string,
  value?: number,
): string {
  switch (fieldName) {
    case "gender":
      return formatGenderEnum(value);
    case "orientation":
      return formatOrientationEnum(value);
    case "relationship_type":
      return formatRelationshipTypeEnum(value);
    case "smoking":
      return formatSmokingEnum(value);
    case "drinking":
      return formatDrinkingEnum(value);
    case "religion":
      return formatReligionEnum(value);
    case "politics":
      return formatPoliticsEnum(value);
    case "zodiac":
      return formatZodiacEnum(value);
    default:
      // If no specific formatter exists, convert to string and format generic
      return formatGenericEnum(value);
  }
}

export function formatRarityEnum(value: RarityEnum): string {
  switch (value) {
    case RarityEnum.COMMON:
      return "Common";
    case RarityEnum.UNCOMMON:
      return "Uncommon";
    case RarityEnum.RARE:
      return "Rare";
    case RarityEnum.EPIC:
      return "Epic";
    case RarityEnum.LEGENDARY:
      return "Legendary";
    default:
      return "Common"; // Default to Common if no match
  }
}

export function formatReportEnum(value: ReportReason): string {
  switch (value) {
    case ReportReason.SPAM:
      return "Spam";
    case ReportReason.HARASSMENT:
      return "Harassment";
    case ReportReason.FAKE_PROFILE:
      return "Fake Profile";
    case ReportReason.INAPPROPRIATE_CONTENT:
      return "Inappropriate Content";
    case ReportReason.UNDERAGE:
      return "Underage";
    case ReportReason.OTHER:
      return "Other";
  }
  // Default case if no match found
  return "Other";
}

function formatGenericEnum(value?: string | number): string {
  // Handle undefined/null values
  if (value === undefined || value === null) return "";

  // Handle string values
  const stringValue = String(value);

  // Return empty string for empty values
  if (!stringValue.trim()) return "";

  // Handle special cases that are already in readable format
  if (stringValue.includes(" ")) return stringValue;

  // Convert SNAKE_CASE to normal text with spaces and proper capitalization
  return (
    stringValue
      // Split by underscores and join with spaces
      .replace(/_/g, " ")
      // Convert to lowercase first
      .toLowerCase()
      // Capitalize first letter of each word
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function getEnumOptions<T extends object>(enumObj: T): number[] {
  return Object.keys(enumObj)
    .filter((key) => !isNaN(Number(key)))
    .map((key) => Number(key));
}
