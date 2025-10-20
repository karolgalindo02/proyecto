import { ApiDelivery } from '../sources/remote/api/ApiDelivery';

export const testConnection = async () => {
  try {
    console.log('🔗 Probando conexión con backend...');
    console.log('URL base:', ApiDelivery.defaults.baseURL);
    
    // Probar endpoint raíz
    const response = await ApiDelivery.get('/');
    console.log('✅ Backend responde:', response.status, response.data);
    return true;
  } catch (error: any) {
    console.log('❌ Error de conexión:', error.message);
    return false;
  }
};

export const testUserEndpoint = async () => {
  try {
    console.log('🔍 Probando endpoint /api/users...');
    // ✅ CORREGIDO: Usar /api/users en lugar de /users
    const response = await ApiDelivery.get('/api/users');
    console.log('✅ Endpoint /api/users funciona:', response.status);
    return true;
  } catch (error: any) {
    console.log('❌ Endpoint /api/users no funciona:', error.response?.status || error.message);
    return false;
  }
};

export const createUser = async (userData: any) => {
  try {
    console.log('📤 Enviando a /api/users/create:', userData);
    
    // ✅ CORREGIDO: Usar /api/users/create
    const response = await ApiDelivery.post('/api/users/create', userData);
    
    console.log('✅ Usuario creado exitosamente:', response.status);
    console.log('📊 Respuesta del backend:', response.data);
    return response.data;
  } catch (error: any) {
    console.log('❌ Error al crear usuario:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};