import { UserRepositoryImpl } from "../../../data/repositories/UserRepository";

const { getAll } = new UserRepositoryImpl();

export const GetAllUsersUseCase = async () => {
  return await getAll();
};