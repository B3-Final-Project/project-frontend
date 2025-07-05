import { createFetcher } from "@/lib/utils";
import { RESTServerRoute } from "../server";

export class UserRouter {
  // delete self
  // we receive an empty object if the function succeeds
  public static readonly deleteSelf = createFetcher<undefined, object>(RESTServerRoute.REST_USERS, "DELETE");
}
