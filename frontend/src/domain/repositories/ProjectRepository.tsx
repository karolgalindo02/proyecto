import { ApiDelivery } from '../../data/sources/remote/api/ApiDelivery';
import { Project } from '../../domain/entities/Project';

export const ProjectRepository = {
  async list(): Promise<Project[]> {
    const { data } = await ApiDelivery.get('/projects');
    return data?.data?.projects || [];
  },

  async create(payload: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    start_date?: string | null;
    end_date?: string | null;
  }): Promise<Project> {
    const { data } = await ApiDelivery.post('/projects', payload);
    return data.data.project;
  },

  async joinByCode(code: string): Promise<Project> {
    const { data } = await ApiDelivery.post('/projects/join', { code });
    return data.data.project;
  },

  async getById(id: number): Promise<Project> {
    const { data } = await ApiDelivery.get(`/projects/${id}`);
    return data.data.project;
  },

  async remove(id: number): Promise<boolean> {
    const { data } = await ApiDelivery.delete(`/projects/${id}`);
    return !!data?.success;
  },
};