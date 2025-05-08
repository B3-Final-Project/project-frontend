import { createFetcher } from "@/lib/utils";
import { RESTServerRoute } from "@/lib/routes/server";

export class BoosterRouter {
  public static getMatch = createFetcher(RESTServerRoute.REST_BOOSTER, "GET")
  public static getMatches = createFetcher(RESTServerRoute.REST_TEN_BOOSTERS, "GET")
}
