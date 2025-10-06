import { useState } from 'react';
import { testConnection, testUserEndpoint, createUser } from '../../../data/services/TestConnection';

const RegisterViewModel = () => {
    const [values, setValues] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState('');

    const onChange = (property: string, value: any) => {
        setValues({ ...values, [property]: value });
        setError('');
        setDebugInfo('');
    };

    const register = async () => {
        console.log('🔄 Iniciando proceso de registro...');
        
        // Validaciones
        if (values.password !== values.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        setError('');
        setDebugInfo('Probando conexión...');

        try {
            // Paso 1: Probar conexión básica
            setDebugInfo('Paso 1: Probando conexión con backend...');
            const isConnected = await testConnection();
            
            if (!isConnected) {
                setError('No se puede conectar al servidor.');
                return;
            }

            // Paso 2: Probar endpoint de users (OPCIONAL - puede fallar por autenticación)
            setDebugInfo('Paso 2: Probando endpoint de usuarios...');
            try {
                const isUsersEndpointWorking = await testUserEndpoint();
                console.log('Endpoint /api/users:', isUsersEndpointWorking ? '✅ Funciona' : '❌ No funciona');
            } catch (endpointError) {
                console.log('⚠️  Endpoint /api/users requiere autenticación, pero continuamos...');
            }

            // Paso 3: Crear usuario (esto es lo importante)
            setDebugInfo('Paso 3: Enviando datos del usuario...');
            console.log('📝 Datos a enviar:', JSON.stringify(values, null, 2));
            
            const result = await createUser(values);
            
            setDebugInfo('✅ Registro exitoso!');
            console.log('🎉 Resultado del registro:', result);
            
            // Limpiar formulario
            setValues({
                name: '',
                lastname: '',
                phone: '',
                email: '',
                password: '',
                confirmPassword: '',
            });

            // Mostrar éxito
            setDebugInfo('Usuario registrado correctamente en la base de datos');

        } catch (error: any) {
            console.log('💥 Error en el proceso:', error);
            
            let errorMessage = 'Error al registrar usuario';
            
            if (error.response) {
                // El backend respondió con error
                if (error.response.status === 404) {
                    errorMessage = 'Endpoint no encontrado. Verifica las rutas del backend.';
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                } else {
                    errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
                }
            } else if (error.request) {
                errorMessage = 'No hay respuesta del servidor';
            } else {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            setDebugInfo(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        ...values,
        loading,
        error,
        debugInfo,
        onChange,
        register
    };
}

export default RegisterViewModel;