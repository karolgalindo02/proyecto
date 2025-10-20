import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';
import { CreateProjectUseCase } from '../../../domain/useCases/project/CreateProject';
import { Project } from '../../../domain/entities/Project';

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
        if (Number.isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
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
 'El equipo es requerido' : '',
      progress: '',
    };

    const progressNum = Number.parseInt(values.progress);
    if (Number.isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
      newErrors.progress = 'El progreso debe ser entre 0 y 100';
    }

  
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
      const projectData: Project = {
        name: values.name,
        team: values.team,
        progress: Number.parseInt(values.progress),
        status: 'In Progress'
      };

      const response = await CreateProjectUseCase(projectData);

      if (response.success) {
        showModal('success', '¡Éxito!', 'Proyecto creado correctamente');
        setTimeout(() => {
          navigation.navigate('DashboardScreen' as any);
        }, 1500);
      } else {
        showModal('error', 'Error', response.message || 'No se pudo crear el proyecto');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
      showModal('error', 'Error', errorMessage);
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