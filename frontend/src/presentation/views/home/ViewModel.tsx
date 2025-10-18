import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';
import { LoginAuthUseCase } from '../../../domain/useCases/auth/LoginAuth';
import { SaveUserLocal } from '../../../domain/useCases/userLocal/SaveUserLocal';
import { Validators } from '../../../utils/validators';

type HomeNavigationProp = StackNavigationProp<RootStackParamList>;

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
        // Guardar datos del usuario localmente
        await SaveUserLocal(response.data);
        
        showModal('success', '¡Login exitoso!', `Bienvenido ${response.data?.name || 'Usuario'}`);
        
        // Redirigir según el rol después de mostrar el mensaje
        setTimeout(() => {
          setModalVisible(false);
          
          if (response.data?.role === 'admin') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'DashboardAdminScreen' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'DashboardUserScreen' }],
            });
          }
        }, 1500);
        
      } else {
        showModal('error', 'Error en el login', response.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      showModal('error', 'Error de conexión', 'No se pudo conectar con el servidor');
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