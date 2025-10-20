import { ApiDelivery } from "../sources/remote/api/ApiDelivery";
import { Task } from '../../domain/entities/Task';

export interface TaskRepository {
  getAll(): Promise<any>;
  create(task: Task): Promise<any>;
  update(id: number, task: Task): Promise<any>;
  remove(id: number): Promise<any>;
}

export class TaskRepositoryImpl implements TaskRepository {
  async getAll(): Promise<any> {
    const response = await ApiDelivery.get('/api/tasks');
    return response.data;
  }

  async create(task: Task): Promise<any> {
    const response = await ApiDelivery.post('/api/tasks', task);
    return response.data;
  }

  async update(id: number, task: Task): Promise<any> {
    const response = await ApiDelivery.put(`/api/tasks/${id}`, task);
    return response.data;
  }

  async remove(id: number): Promise<any> {
    const response = await ApiDelivery.delete(`/api/tasks/${id}`);
    return response.data;
  }
}