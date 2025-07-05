import { RESTServerRoute } from "@/lib/routes/server";
import { createFetcher } from "@/lib/utils";
import { SeedAllResponse } from "./response/seed-all.response";

export class SeedRouter {
  public static readonly SeedAll = createFetcher<SeedAllResponse, {count: number}>(RESTServerRoute.REST_SEED_USERS, "POST")
  public static readonly SeedBoosters = createFetcher<{message: string, count: number}>(RESTServerRoute.REST_SEED_BOOSTERS, "POST");
}
