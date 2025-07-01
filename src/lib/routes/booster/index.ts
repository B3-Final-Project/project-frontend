import { createFetcher } from "@/lib/utils";
import { RESTServerRoute } from "@/lib/routes/server";
import { UserCardDto } from "@/lib/routes/booster/dto/user-card.dto";
import { BoosterPackDto } from "@/lib/routes/booster/dto/booster.dto";

export class BoosterRouter {
  public static getBooster = createFetcher(RESTServerRoute.REST_BOOSTER, "GET");
  public static getBoosters = createFetcher<UserCardDto[]>(
    RESTServerRoute.REST_TEN_BOOSTERS,
    "GET",
  );
  public static getAvailablePacks = createFetcher<BoosterPackDto[]>(
    RESTServerRoute.REST_AVAILABLE_PACKS,
    "GET",
  );
}
