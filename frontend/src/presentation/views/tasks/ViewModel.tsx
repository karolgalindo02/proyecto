import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TaskFormNavigationProp = StackNavigationProp<RootStackParamList>;

interface Project {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  lastname: string;
}

export const useTaskFormViewModel = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    projectId: '',
    assignedTo: '',
    progress: '0',
    priority: 'Medium',
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
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://tu-api/projects', {
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://tu-api/users', {
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
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
        if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
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
    if (!dateString.match(regex)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const validateAllFields = () => {
    const newErrors = {
      name: !values.name.trim() ? 'El nombre de la tarea es requerido' : '',
      description: !values.description.trim() ? 'La descripción es requerida' : '',
      projectId: !values.projectId ? 'Debes seleccionar un proyecto' : '',
      assignedTo: !values.assignedTo ? 'Debes asignar la tarea a un usuario' : '',
      progress: '',
      dueDate: '',
    };

    // Validar progreso
    const progressNum = parseInt(values.progress);
    if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
      newErrors.progress = 'El progreso debe ser entre 0 y 100';
    }

    // Validar fecha
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
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://tu-api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          project_id: Number.parseInt(values.projectId),
          assigned_to: Number.parseInt(values.assignedTo),
          progress: Number.parseInt(values.progress),
          priority: values.priority,
          due_date: values.dueDate || null,
          status: 'In Progress'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showModal('success', '¡Éxito!', 'Tarea creada correctamente');
        setTimeout(() => {
          navigation.navigate('DashboardScreen' as any);
        }, 1500);
      } else {
        showModal('error', 'Error', data.message || 'No se pudo crear la tarea');
      }
    } catch (error: unknown) {
      console.error('Error creating task:', error);
      let userMessage = 'No se pudo conectar con el servidor';
      if (error instanceof Error && error.message) userMessage = error.message;
      showModal('error', 'Error de conexión', userMessage);
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