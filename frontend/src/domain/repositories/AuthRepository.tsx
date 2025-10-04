import { User } from "../entities/User";
import { ResponseApiDelivery } from "../../data/sources/remote/models/ResponseApiDelivery";  

export interface AuthRepository {
  register(user: User): Promise<ResponseApiDelivery>;
}
