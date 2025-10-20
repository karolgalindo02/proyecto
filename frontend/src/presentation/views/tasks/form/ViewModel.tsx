import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../../App';
import { CreateTaskUseCase } from '../../../../domain/useCases/task/CreateTask';
import { GetAllProjectsUseCase } from '../../../../domain/useCases/project/GetAllProjects';
import { GetAllUsersUseCase } from '../../../../domain/useCases/user/GetAllUsers';
import { Task} from '../../../../domain/entities/Task';
import { Project } from '../../../../domain/entities/Project';
import { User } from '../../../../domain/entities/User';

type TaskFormNavigationProp = StackNavigationProp<RootStackParamList>;

export const useTaskFormViewModel = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    projectId: '',
    assignedTo: '',
    progress: '0',
    priority: 'Medium' as 'Medium' | 'Low' | 'High',
    dueDate: '',
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    projectId: '',
    assignedTo: '',
    progress: '',
    dueDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
  });

  const navigation = useNavigation<TaskFormNavigationProp>();

  useEffect(() => {
    loadProjects();
    loadUsers();
  }, []);

  const loadProjects = async () => {
      const response = await GetAllProjectsUseCase();
      setProjects(response.data || []);
  };

  const loadUsers = async () => {
      const response = await GetAllUsersUseCase();
      setUsers(response.data || []);
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'name':
        if (!value.trim()) error = 'El nombre de la tarea es requerido';
        else if (value.length < 3) error = 'El nombre debe tener al menos 3 caracteres';
        break;
      case 'description':
        if (!value.trim()) error = 'La descripción es requerida';
        break;
      case 'projectId':
        if (!value) error = 'Debes seleccionar un proyecto';
        break;
      case 'assignedTo':
        if (!value) error = 'Debes asignar la tarea a un usuario';
        break;
      case 'progress': {
        const progressNum = Number.parseInt(value);
        if (Number.isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
          error = 'El progreso debe ser entre 0 y 100';
        }
        break;
      }
      case 'dueDate':
        if (value && !isValidDate(value)) {
          error = 'La fecha debe tener el formato YYYY-MM-DD';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const isValidDate = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.exec(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !Number.isNaN(date.getTime());
  };

  const validateAllFields = () => {
    const newErrors = {
      name: values.name.trim() === '' ? 'El nombre de la tarea es requerido' : '',
      description: values.description.trim() === '' ? 'La descripción es requerida' : '',
      projectId: values.projectId ? '' : 'Debes seleccionar un proyecto',
      assignedTo: values.assignedTo === '' ? 'Debes asignar la tarea a un usuario' : '',
      progress: '',
      dueDate: '',
    };

    const progressNum = Number.parseInt(values.progress);
    if (Number.isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
      newErrors.progress = 'El progreso debe ser entre 0 y 100';
    }

    if (values.dueDate && !isValidDate(values.dueDate)) {
      newErrors.dueDate = 'La fecha debe tener el formato YYYY-MM-DD';
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

  const createTask = async () => {
    if (!validateAllFields()) {
      showModal('error', 'Error de validación', 'Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      const taskData: Task = {
        name: values.name,
        description: values.description,
        project_id: Number.parseInt(values.projectId),
        assigned_to: Number.parseInt(values.assignedTo),
        progress: Number.parseInt(values.progress),
        priority: values.priority,
        due_date: values.dueDate || null,
        status: 'In Progress'
      };

      const response = await CreateTaskUseCase(taskData);

      if (response.success) {
        showModal('success', '¡Éxito!', 'Tarea creada correctamente');
        setTimeout(() => {
          navigation.navigate('DashboardScreen' as any);
        }, 1500);
      } else {
        showModal('error', 'Error', response.message || 'No se pudo crear la tarea');
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
    projects,
    users,
    errors,
    loading,
    modalVisible,
    modalConfig,
    onChange,
    createTask,
    setModalVisible
  };
};