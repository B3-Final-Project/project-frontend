import { authenticatedAxios } from "@/lib/auth-axios";
import { BoosterPackDto } from "@/lib/routes/booster/dto/booster.dto";
import { UserCardDto } from "@/lib/routes/booster/dto/user-card.dto";
import { RESTServerRoute } from "@/lib/routes/server";
import { createFetcher } from "@/lib/utils";

interface GetBoostersParams {
  type?: string;
  boosterType?: number;
}

export class BoosterRouter {
  public static getBooster = createFetcher(RESTServerRoute.REST_BOOSTER, "GET");
  public static getBoosters = async (params?: GetBoostersParams): Promise<UserCardDto[]> => {
    const parsedParams = params?.type ? {
      boosterType: Number(params.type) 
    } : undefined;
    
    const config = {
      method: "GET",
      url: RESTServerRoute.REST_TEN_BOOSTERS,
      params: parsedParams
    };
    
    const response = await authenticatedAxios<{ data: UserCardDto[] }>(config);
    return response.data.data;
  };
  public static getAvailablePacks = createFetcher<BoosterPackDto[]>(
    RESTServerRoute.REST_AVAILABLE_PACKS,
    "GET",
  );
}
