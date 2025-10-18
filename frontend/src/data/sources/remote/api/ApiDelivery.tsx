import axios from "axios";

// Para desarrollo local en dispositivo físico o emulador, usa tu IP local
// Para producción o cuando uses el backend en el mismo contenedor, usa localhost o la URL del servidor
const API_URL = 'http://192.168.1.79:8001';

const ApiDelivery = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 segundos
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para logging
ApiDelivery.interceptors.request.use(
    (config) => {
        console.log(`🔄 Enviando: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.log('❌ Error en request:', error);
        return Promise.reject(error);
    }
);

export { ApiDelivery };