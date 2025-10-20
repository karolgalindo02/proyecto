import { TaskRepositoryImpl } from "../../../data/repositories/TaskRepository";

const { remove } = new TaskRepositoryImpl();

export const DeleteTaskUseCase = async (id: number) => {
  return await remove(id);
};