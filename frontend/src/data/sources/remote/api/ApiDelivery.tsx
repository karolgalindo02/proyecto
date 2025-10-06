import axios from "axios";

const ApiDelivery = axios.create({
    baseURL: 'http://192.168.1.79:3000',
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