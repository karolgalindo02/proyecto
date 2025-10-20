import { ApiDelivery } from "../sources/remote/api/ApiDelivery";
import { Project } from '../../domain/entities/Project';

export interface ProjectRepository {
  getAll(): Promise<any>;
  create(project: Project): Promise<any>;
  update(id: number, project: Project): Promise<any>;
  remove(id: number): Promise<any>;
}

export class ProjectRepositoryImpl implements ProjectRepository {
  async getAll(): Promise<any> {
    const response = await ApiDelivery.get('/api/projects');
    return response.data;
  }

  async create(project: Project): Promise<any> {
    const response = await ApiDelivery.post('/api/projects', project);
    return response.data;
  }

  async update(id: number, project: Project): Promise<any> {
    const response = await ApiDelivery.put(`/api/projects/${id}`, project);
    return response.data;
  }

  async remove(id: number): Promise<any> {
    const response = await ApiDelivery.delete(`/api/projects/${id}`);
    return response.data;
  }
}