import { ProjectRepositoryImpl } from "../../../data/repositories/ProjectRepository";
import { Project } from "../../entities/Project";

const { update } = new ProjectRepositoryImpl();

export const UpdateProjectUseCase = async (id: number, project: Project) => {
  return await update(id, project);
};