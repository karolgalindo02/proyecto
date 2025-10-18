import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../App';
import { LoginAuthUseCase } from '../../../domain/useCases/auth/LoginAuth';
import { Validators } from '../../../utils/validators';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeViewModel = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
  });

  const navigation = useNavigation<HomeNavigationProp>();

  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'email':
        error = Validators.validateEmail(value).message;
        break;
      case 'password':
        error = Validators.validatePassword(value).message;
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const validateAllFields = () => {
    const newErrors = {
      email: Validators.validateEmail(values.email).message,
      password: Validators.validatePassword(values.password).message,
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const onChange = (property: string, value: any) => {
    setValues({
      ...values,
      [property]: value
    });
    validateField(property, value);
  }

  const showModal = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setModalConfig({ type, title, message });
    setModalVisible(true);
  };

  const login = async () => {
    if (!validateAllFields()) {
      showModal('error', 'Error de validación', 'Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      const response = await LoginAuthUseCase(values.email, values.password);
      
      if (response.success) {
        // Guardar token y usuario en AsyncStorage
        try {
          if (response.data?.session_token) {
            await AsyncStorage.setItem('token', response.data.session_token);
          }
          if (response.data) {
            await AsyncStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch (storageError) {
          console.error('AsyncStorage save error:', storageError);
          // continuar aunque falle el guardado local
        }

        // Navegar al Dashboard y limpiar historial de navegación
        navigation.reset({
          index: 0,
          routes: [{ name: 'DashboardScreen' }]
        });

        // Mostrar confirmación al usuario
        showModal('success', '¡Login exitoso!', `Bienvenido ${response.data?.name || 'Usuario'}`);
      } else {
        showModal('error', 'Error en el login', response.message || 'Credenciales incorrectas');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      let message = 'No se pudo conectar con el servidor';
      if (error instanceof Error && error.message) message = error.message;
      showModal('error', 'Error de conexión', message);
    } finally {
      setLoading(false);
    }
  }

  return {
    ...values,
    errors,
    loading,
    modalVisible,
    modalConfig,
    onChange,
    login,
    setModalVisible
  }
}

export default HomeViewModel;
