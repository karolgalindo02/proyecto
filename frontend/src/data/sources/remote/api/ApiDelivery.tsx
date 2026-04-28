import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'http://192.168.1.79:3000';
export const API_BASE = `${BASE_URL}/api`;

export const ApiDelivery = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Inyecta el JWT en cada request
ApiDelivery.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('takio_token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export function formatApiError(err: any): string {
  const d = err?.response?.data;
  if (!d) return err?.message || 'Error de conexión';
  if (typeof d?.message === 'string') return d.message;
  if (typeof d?.detail === 'string') return d.detail;
  return 'Error desconocido';
}