import { ApiDelivery } from '../sources/remote/api/ApiDelivery';

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  image?: string;
  role: string;
}

export const UserService = {
  async getAll(token: string) {
    try {
      const response = await ApiDelivery.get('/api/users', {
        headers: { Authorization: token }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener usuarios:', error);
      throw error.response?.data || error;
    }
  }
};
