import { TaskRepositoryImpl } from "../../../data/repositories/TaskRepository";
import { Task } from "../../entities/Task";

const { update } = new TaskRepositoryImpl();

export const UpdateTaskUseCase = async (id: number, task: Task) => {
  return await update(id, task);
};