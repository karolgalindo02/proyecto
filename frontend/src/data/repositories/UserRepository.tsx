import { ApiDelivery } from "../sources/remote/api/ApiDelivery";

export interface UserRepository {
  getAll(): Promise<any>;
  getById(id: number): Promise<any>;
}

export interface UserRepository {
  getAll(): Promise<any>;
  getById(id: number): Promise<any>;
}

export class UserRepositoryImpl implements UserRepository {
  async getAll(): Promise<any> {
    const response = await ApiDelivery.get('/api/users');
    return response.data;
  }

  async getById(id: number): Promise<any> {
    const response = await ApiDelivery.get(`/api/users/${id}`);
    return response.data;
  }
}