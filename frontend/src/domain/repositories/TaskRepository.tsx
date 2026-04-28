import { ApiDelivery } from '../../data/sources/remote/api/ApiDelivery';
import { Task, TaskStatus } from '../../domain/entities/Task';

export interface TaskListQuery {
  project_id?: number | string;
  status?: TaskStatus;
  date?: string;
  scope?: 'today';
}

export const TaskRepository = {
  async list(query: TaskListQuery = {}): Promise<Task[]> {
    const { data } = await ApiDelivery.get('/tasks', { params: query });
    return data?.data?.tasks || [];
  },

  async create(payload: Partial<Task> & { title: string }): Promise<Task> {
    const { data } = await ApiDelivery.post('/tasks', payload);
    return data.data.task;
  },

  async update(id: number, payload: Partial<Task>): Promise<Task> {
    const { data } = await ApiDelivery.put(`/tasks/${id}`, payload);
    return data.data.task;
  },

  async remove(id: number): Promise<boolean> {
    const { data } = await ApiDelivery.delete(`/tasks/${id}`);
    return !!data?.success;
  },

  async dashboardSummary(): Promise<{ total: number; done: number; in_progress: number; completion_percent: number; project_count: number }> {
    const { data } = await ApiDelivery.get('/tasks/dashboard/summary');
    return data.data;
  },
};