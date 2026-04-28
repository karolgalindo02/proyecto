// Inserta directamente en MySQL `users` (vía /api/auth/register en backend Node).
import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiDelivery, formatApiError } from '../../../data/sources/remote/api/ApiDelivery';

export interface RegisterValues {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export type RegisterErrors = Partial<Record<keyof RegisterValues, string>>;

const initial: RegisterValues = { name: '', lastname: '', email: '', phone: '', password: '', confirmPassword: '' };

export const useRegisterViewModel = (onSuccess?: () => void) => {
  const [values, setValues] = useState<RegisterValues>(initial);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const onChange = (field: keyof RegisterValues, value: string) => {
    setValues((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: RegisterErrors = {};
    const emailRx = /^[\w.+-]+@[\w-]+\.[\w.-]+$/;
    const phoneRx = /^[0-9+\-()\s]{0,20}$/;

    // 'users.name' en MySQL es VARCHAR(90) NOT NULL
    if (!values.name.trim()) e.name = 'El nombre es requerido';
    else if (values.name.length > 90) e.name = 'Máximo 90 caracteres';

    // 'users.lastname' VARCHAR(90) NOT NULL
    if (!values.lastname.trim()) e.lastname = 'El apellido es requerido';
    else if (values.lastname.length > 90) e.lastname = 'Máximo 90 caracteres';

    // 'users.email' VARCHAR(180) UNIQUE
    if (!values.email.trim()) e.email = 'El email es requerido';
    else if (!emailRx.test(values.email.trim())) e.email = 'Email no válido';
    else if (values.email.length > 180) e.email = 'Email demasiado largo';

    // 'users.phone' VARCHAR(20) UNIQUE NULLABLE
    if (values.phone && !phoneRx.test(values.phone)) e.phone = 'Teléfono no válido';

    // 'users.password' VARCHAR(255) NOT NULL — almacenado con bcrypt
    if (!values.password) e.password = 'La contraseña es requerida';
    else if (values.password.length < 6) e.password = 'Mínimo 6 caracteres';

    if (values.confirmPassword !== values.password) e.confirmPassword = 'Las contraseñas no coinciden';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /**
   * POST /api/auth/register → inserta en `users`:
   *   INSERT INTO users (email, name, lastname, phone, password) VALUES (?, ?, ?, ?, bcrypt(?))
   * El backend devuelve { token, user } y persistimos en AsyncStorage.
   * NOTA: NO se asigna rol aquí. El rol va en `project_members` cuando crea/se une a un proyecto.
   */
  const submit = async (): Promise<boolean> => {
    if (!validate()) return false;
    setLoading(true);
    try {
      const payload = {
        name: values.name.trim(),
        lastname: values.lastname.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim() || null,
        password: values.password,
      };
      const { data } = await ApiDelivery.post('/auth/register', payload);
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

  const reset = () => { setValues(initial); setErrors({}); };

  return { values, errors, loading, onChange, submit, reset };
};