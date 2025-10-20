import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ApiDelivery = axios.create({
  baseURL: 'http://192.168.1.79:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

ApiDelivery.interceptors.request.use(
  (async (config: any) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const formatted = token.startsWith('JWT ') ? token : `JWT ${token}`;
        config.headers = { ...config.headers, Authorization: formatted };
      }
    } catch {
      // no bloquear la petición si falla la lectura del token
    }
    return config;
  }) as unknown as (config: any) => any,
);

// Interceptor de response
ApiDelivery.interceptors.response.use(
  (response) => response,

);

export { ApiDelivery };