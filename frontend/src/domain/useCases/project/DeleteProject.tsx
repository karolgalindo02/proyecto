import { ProjectRepositoryImpl } from "../../../data/repositories/ProjectRepository";

const { remove } = new ProjectRepositoryImpl();

export const DeleteProjectUseCase = async (id: number) => {
  return await remove(id);
};