import { ApiDelivery } from '../sources/remote/api/ApiDelivery';

export interface Project {
  id?: number;
  name: string;
  team: string;
  progress: number;
  status: 'In Progress' | 'Completed';
  created_at?: string;
  updated_at?: string;
}

export const ProjectService = {
  async getAll(token: string) {
    try {
      const response = await ApiDelivery.get('/api/projects', {
        headers: { Authorization: token }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener proyectos:', error);
      throw error.response?.data || error;
    }
  },

  async create(project: Project, token: string) {
    try {
      const response = await ApiDelivery.post('/api/projects', project, {
        headers: { Authorization: token }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al crear proyecto:', error);
      throw error.response?.data || error;
    }
  },

  async update(id: number, project: Project, token: string) {
    try {
      const response = await ApiDelivery.put(`/api/projects/${id}`, project, {
        headers: { Authorization: token }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar proyecto:', error);
      throw error.response?.data || error;
    }
  },

  async delete(id: number, token: string) {
    try {
      const response = await ApiDelivery.delete(`/api/projects/${id}`, {
        headers: { Authorization: token }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al eliminar proyecto:', error);
      throw error.response?.data || error;
    }
  }
};
