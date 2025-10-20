import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetAllProjectsUseCase } from '../../../domain/useCases/project/GetAllProjects';
import { GetAllTasksUseCase } from '../../../domain/useCases/task/GetAllTask';
import { User } from '../../../domain/entities/User';
import { Project } from '../../../domain/entities/Project';
import { Task } from '../../../domain/entities/Task';

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

      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const userObj: User = JSON.parse(userData);
        setUser(userObj);
      }
  };

  const loadProjects = async () => {

      const response = await GetAllProjectsUseCase();
      if (response.success) {
        setProjects(response.data || []);
      } else {
        throw new Error(response.message || 'Error al cargar proyectos');
      }
  };

  const loadTasks = async () => {
    try {
      const response = await GetAllTasksUseCase();
      
      if (response.success) {
        // Filtrar tareas según el rol del usuario
        let tasksData = response.data || [];
        
        if (user?.role === 'user') {
          tasksData = tasksData.filter((task: Task) => task.assigned_to === user.id);
        }
        
        setTasks(tasksData);
      } else {
        throw new Error(response.message || 'Error al cargar tareas');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'No se pudieron cargar las tareas';
      showModal('error', 'Error', errorMessage);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
      await Promise.all([loadProjects(), loadTasks()]);
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

  const getMyPendingTasks = (): Task[] => {
    if (user?.role === 'admin') {
      return tasks.filter(task => task.status === 'In Progress').slice(0, 5);
    } else {
      return tasks
        .filter(task => task.status === 'In Progress' && task.assigned_to === user?.id)
        .slice(0, 5);
    }
  };

  const getUrgentTasks = (): Task[] => {
    const today = new Date();
    return tasks.filter(task => {
      if (!task.due_date || task.status === 'Completed') return false;
      
      const dueDate = new Date(task.due_date);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    });
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
    getMyPendingTasks,
    getUrgentTasks,
    isAdmin,
    
    // Actions
    onRefresh,
    hideModal
  };
};
