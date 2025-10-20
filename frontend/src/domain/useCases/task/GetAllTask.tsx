import { TaskRepositoryImpl } from "../../../data/repositories/TaskRepository";

const { getAll } = new TaskRepositoryImpl();

export const GetAllTasksUseCase = async () => {
  return await getAll();
};