import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../../../../domain/entities/Task';
import { User } from '../../../../domain/entities/User';
import { DeleteTaskUseCase } from '../../../../domain/useCases/task/DeleteTask';
import { UpdateTaskUseCase } from '../../../../domain/useCases/task/UpdateTask';
import { GetAllTasksUseCase } from '../../../../domain/useCases/task/GetAllTask';

export const useTasksViewModel = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'In Progress' | 'Completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'Low' | 'Medium' | 'High'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, filterStatus, filterPriority]);

  const loadInitialData = async () => {
    await loadUserData();
    await loadTasks();
  };

  const loadUserData = async () => {

      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const userObj: User = JSON.parse(userData);
        setUser(userObj);
      }

  };

  const loadTasks = async () => {

      const response = await GetAllTasksUseCase();
      setTasks(response.data || []);

  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.project_name?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    if (user?.role === 'user') {
      filtered = filtered.filter(task => task.assigned_to === user.id);
    }

    setFilteredTasks(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };

  const onChangeFilterStatus = (status: 'all' | 'In Progress' | 'Completed') => {
    setFilterStatus(status);
  };

  const onChangeFilterPriority = (priority: 'all' | 'Low' | 'Medium' | 'High') => {
    setFilterPriority(priority);
  };

  const showModal = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setModalConfig({ type, title, message });
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const deleteTask = async (taskId: number) => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            (async () => {
              try {
                await DeleteTaskUseCase(taskId);
                await loadTasks();
                showModal('success', 'Éxito', 'Tarea eliminada correctamente');
              } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message || 'No se pudo eliminar la tarea';
                showModal('error', 'Error', errorMessage);
              }
            })();
          }
        }
      ]
    );
  };

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'In Progress' ? 'Completed' : 'In Progress';
    const newProgress = newStatus === 'Completed' ? 100 : 0;
    
    try {
      await UpdateTaskUseCase(task.id!, {
        ...task,
        status: newStatus,
        progress: newProgress
      });
      
      await loadTasks();
      showModal('success', 'Éxito', `Tarea marcada como ${newStatus === 'Completed' ? 'completada' : 'en progreso'}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'No se pudo actualizar la tarea';
      showModal('error', 'Error', errorMessage);
    }
  };

  return {
    tasks,
    filteredTasks,
    searchQuery,
    filterStatus,
    filterPriority,
    refreshing,
    modalVisible,
    modalConfig,
    user,
    onChangeSearch,
    onChangeFilterStatus,
    onChangeFilterPriority,
    onRefresh,
    deleteTask,
    toggleTaskStatus,
    hideModal
  };
};