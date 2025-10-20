import { ProjectRepositoryImpl } from "../../../data/repositories/ProjectRepository";
import { Project } from "../../entities/Project";

const { create } = new ProjectRepositoryImpl();

export const CreateProjectUseCase = async (project: Project) => {
  return await create(project);
};