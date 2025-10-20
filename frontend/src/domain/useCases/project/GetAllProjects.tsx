import { ProjectRepositoryImpl } from "../../../data/repositories/ProjectRepository";

const { getAll } = new ProjectRepositoryImpl();

export const GetAllProjectsUseCase = async () => {
  return await getAll();
};