import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces TypeScript
interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  image: string;
  role: 'admin' | 'user';
  session_token: string;
}

interface Project {
  id: number;
  name: string;
  team: string;
  progress: number;
  status: 'In Progress' | 'Completed';
  created_at: string;
  updated_at: string;
}

interface Task {
  id: number;
  name: string;
  description: string;
  project_id: number;
  assigned_to: number;
  progress: number;
  priority: 'Low' | 'Medium' | 'High';
  due_date: string;
  status: 'In Progress' | 'Completed';
  created_at: string;
  updated_at: string;
  project_name?: string;
  assigned_user_name?: string;
}

export const useDashboardViewModel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await loadUserData();
    await loadProjects();
    await loadTasks();
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const userObj: User = JSON.parse(userData);
        setUser(userObj);
      }
    } catch (error) {
      showModal('error', 'Error', 'No se pudo cargar la información del usuario');
    }
  };

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
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error: unknown) {
      console.error('Error loading projects:');
      showModal('error', 'Error', 'No se pudieron cargar los proyectos');
    }
  };

  const loadTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://tu-api/tasks', {
        headers: {
          'Authorization': token || '',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data.data || []);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      showModal('error', 'Error', 'No se pudieron cargar las tareas');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadProjects(), loadTasks()]);
    setRefreshing(false);
  };

  const showModal = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setModalConfig({ type, title, message });
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const getTasksByStatus = (status: string): Task[] => {
    return tasks.filter(task => task.status === status);
  };

  const isAdmin = user?.role === 'admin';

  return {
    // State
    user,
    projects,
    tasks,
    refreshing,
    modalVisible,
    modalConfig,
    
    // Getters
    getTasksByStatus,
    isAdmin,
    
    // Actions
    onRefresh,
    hideModal,
    loadTasks,
    loadProjects
  };
}