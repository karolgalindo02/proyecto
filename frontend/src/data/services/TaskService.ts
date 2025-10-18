import { ApiDelivery } from '../sources/remote/api/ApiDelivery';

export interface Task {
  id?: number;
  name: string;
  description: string;
  project_id: number;
  assigned_to: number;
  progress: number;
  priority: 'Low' | 'Medium' | 'High';
  due_date: string;
  status: 'In Progress' | 'Completed';
  created_at?: string;
  updated_at?: string;
}

export const TaskService = {
  async getAll(token: string) {
    try {
      const response = await ApiDelivery.get('/api/tasks', {
        headers: { Authorization: token }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener tareas:', error);
      throw error.response?.data || error;
    }
  },

  async create(task: Task, token: string) {
    try {
      const response = await ApiDelivery.post('/api/tasks', task, {
        headers: { Authorization: token }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al crear tarea:', error);
      throw error.response?.data || error;
    }
  },

  async update(id: number, task: Partial<Task>, token: string) {
    try {
      const response = await ApiDelivery.put(`/api/tasks/${id}`, task, {
        headers: { Authorization: token }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar tarea:', error);
      throw error.response?.data || error;
    }
  },

  async delete(id: number, token: string) {
    try {
      const response = await ApiDelivery.delete(`/api/tasks/${id}`, {
        headers: { Authorization: token }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al eliminar tarea:', error);
      throw error.response?.data || error;
    }
  }
};
