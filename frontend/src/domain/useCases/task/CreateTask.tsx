import { TaskRepositoryImpl } from "../../../data/repositories/TaskRepository";
import { Task } from "../../entities/Task";

const { create } = new TaskRepositoryImpl();

export const CreateTaskUseCase = async (task: Task) => {
  return await create(task);
};