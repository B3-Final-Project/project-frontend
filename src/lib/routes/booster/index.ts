import { createFetcher } from "@/lib/utils";
import { RESTServerRoute } from "@/lib/routes/server";
import {
  GetAvailablePacksDto
} from "@/lib/routes/booster/dto/get-available-packs.dto";

export class BoosterRouter {
  public static getMatch = createFetcher(RESTServerRoute.REST_BOOSTER, "GET")
  public static getMatches = createFetcher(RESTServerRoute.REST_TEN_BOOSTERS, "GET")
  public static getAvailablePacks = createFetcher<GetAvailablePacksDto>(RESTServerRoute.REST_AVAILABLE_PACKS, "GET")
}
