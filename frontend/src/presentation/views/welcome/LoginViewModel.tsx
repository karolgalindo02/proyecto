// Custom hook: estado + validación + login → guarda token+user en AsyncStorage e inserta sesión.
import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiDelivery, formatApiError } from '../../../data/sources/remote/api/ApiDelivery';

export interface LoginValues {
  email: string;
  password: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
}

export const useLoginViewModel = (onSuccess?: () => void) => {
  const [values, setValues] = useState<LoginValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const onChange = (field: keyof LoginValues, value: string) => {
    setValues((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: LoginErrors = {};
    const emailRx = /^[\w.+-]+@[\w-]+\.[\w.-]+$/;
    if (!values.email.trim()) e.email = 'El email es requerido';
    else if (!emailRx.test(values.email.trim())) e.email = 'Email no válido';
    if (!values.password) e.password = 'La contraseña es requerida';
    else if (values.password.length < 4) e.password = 'Mínimo 4 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /**
   * Llama POST /api/auth/login (Node) que valida con bcrypt contra `users` en MySQL.
   * Persiste el JWT en AsyncStorage; cualquier insert posterior (proyecto, tarea, chat) lo usará.
   */
  const submit = async (): Promise<boolean> => {
    if (!validate()) return false;
    setLoading(true);
    try {
      const { data } = await ApiDelivery.post('/auth/login', {
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      await AsyncStorage.setItem('takio_token', data.data.token);
      await AsyncStorage.setItem('takio_user', JSON.stringify(data.data.user));
      onSuccess?.();
      return true;
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setValues({ email: '', password: '' }); setErrors({}); };

  return { values, errors, loading, onChange, submit, reset };
};