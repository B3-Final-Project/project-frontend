import { formatRelationshipTypeEnum } from "@/lib/utils/enum-utils";
import { BoosterPackDto } from "@/lib/routes/booster/dto/booster.dto";
import clsx from "clsx";
import { RelationshipTypeEnum } from "@/lib/routes/profiles/enums";

interface BoosterPackProps {
  pack: BoosterPackDto
}

// Define background colors by relationship type
const relationshipTypeBg: Record<RelationshipTypeEnum, string> = {
  [RelationshipTypeEnum.CASUAL]: "bg-gradient-to-br from-blue-400 to-blue-600",
  [RelationshipTypeEnum.LONG_TERM]: "bg-gradient-to-br from-stone-400 to-stone-700",
  [RelationshipTypeEnum.MARRIAGE]: "bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600",
  [RelationshipTypeEnum.FRIENDSHIP]: "bg-gradient-to-br from-green-300 via-green-400 to-green-600",
  [RelationshipTypeEnum.UNSURE]: "bg-gradient-to-br from-gray-300 via-purple-300 to-purple-500",
  [RelationshipTypeEnum.ANY]: "bg-gradient-to-br from-gray-200 to-gray-400",
}

export function BoosterPack({ pack }: BoosterPackProps) {
  return (
    <li
      key={pack.id}
      className={clsx(
        "rounded-2xl shadow-lg p-0 flex flex-col items-center justify-between aspect-square w-56",
        relationshipTypeBg[pack.type]
      )}
      style={{ minHeight: 220, minWidth: 220 }}
    >
      {/* Pack Logo/Icon */}
      <div className="flex flex-col items-center justify-center flex-1 w-full p-6">
        <h2 className="text-lg font-bold drop-shadow text-white tracking-wide uppercase text-center">
          {pack.name}
        </h2>
      </div>
      {/* Relationship Type Label */}
      <div className="bg-white/80 rounded-b-2xl w-full py-2 text-center">
        <span className="text-sm font-semibold text-gray-700">
          {formatRelationshipTypeEnum(pack.type)}
        </span>
      </div>
    </li>
  );
}
