import {
  Booster
} from "@/lib/routes/booster/interfaces/booster.interface";
import { RESTServerRoute } from "@/lib/routes/server";
import { createFetcher } from "@/lib/utils";

export class BoosterRouter {
  public static readonly getBooster = createFetcher<Booster[], undefined>(RESTServerRoute.REST_TEN_BOOSTERS, "GET");
}
