import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProjectFormNavigationProp = StackNavigationProp<RootStackParamList>;

export const useProjectFormViewModel = () => {
  const [values, setValues] = useState({
    name: '',
    team: '',
    progress: '0',
  });

  const [errors, setErrors] = useState({
    name: '',
    team: '',
    progress: '',
  });

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
  });

  const navigation = useNavigation<ProjectFormNavigationProp>();

  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'name':
        if (!value.trim()) error = 'El nombre del proyecto es requerido';
        else if (value.length < 3) error = 'El nombre debe tener al menos 3 caracteres';
        break;
      case 'team':
        if (!value.trim()) error = 'El equipo es requerido';
        break;
      case 'progress': {
        const progressNum = Number.parseInt(value);
        if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
          error = 'El progreso debe ser entre 0 y 100';
        }
        break;
      }
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const validateAllFields = () => {
    const newErrors = {
      name: !values.name.trim() ? 'El nombre del proyecto es requerido' : '',
      team: !values.team.trim() ? 'El equipo es requerido' : '',
      progress: '',
    };

    // Validar progreso
    const progressNum = parseInt(values.progress);
    if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
      newErrors.progress = 'El progreso debe ser entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const onChange = (property: string, value: any) => {
    setValues({
      ...values,
      [property]: value
    });
    validateField(property, value);
  };

  const showModal = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setModalConfig({ type, title, message });
    setModalVisible(true);
  };

  const createProject = async () => {
    if (!validateAllFields()) {
      showModal('error', 'Error de validación', 'Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://tu-api/projects', {
        method: 'POST',
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: values.name,
          team: values.team,
          progress: parseInt(values.progress),
          status: 'In Progress'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showModal('success', '¡Éxito!', 'Proyecto creado correctamente');
        setTimeout(() => {
          navigation.navigate('DashboardScreen' as any);
        }, 1500);
      } else {
        showModal('error', 'Error', data.message || 'No se pudo crear el proyecto');
      }
    } catch (error) {
      showModal('error', 'Error de conexión', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return {
    ...values,
    errors,
    loading,
    modalVisible,
    modalConfig,
    onChange,
    createProject,
    setModalVisible
  };
};