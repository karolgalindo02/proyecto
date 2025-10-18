import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Modal, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProjectService, Project } from '../../../../data/services/ProjectService';
import { TaskService, Task } from '../../../../data/services/TaskService';
import { GetUserLocal } from '../../../../domain/useCases/userLocal/GetUserLocal';
import { RemoveUserLocal } from '../../../../domain/useCases/userLocal/RemoveUserLocal';

export const DashboardUserScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks'>('projects');
  
  // Modal para editar tarea
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await GetUserLocal();
      if (userData) {
        setUser(userData);
        loadData(userData.session_token, userData.id);
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' as never }] });
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  };

  const loadData = async (token: string, userId: number) => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        ProjectService.getAll(token),
        TaskService.getAll(token)
      ]);

      if (projectsRes.success) setProjects(projectsRes.data || []);
      if (tasksRes.success) {
        const allTasks = tasksRes.data || [];
        setTasks(allTasks);
        // Filtrar solo las tareas asignadas al usuario actual
        setMyTasks(allTasks.filter((task: Task) => task.assigned_to === userId));
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(user.session_token, user.id);
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await RemoveUserLocal();
    navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' as never }] });
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditModalVisible(true);
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;

    try {
      const response = await TaskService.update(
        selectedTask.id!,
        {
          progress: selectedTask.progress,
          status: selectedTask.status
        },
        user.session_token
      );

      if (response.success) {
        Alert.alert('Éxito', 'Tarea actualizada correctamente');
        setEditModalVisible(false);
        setSelectedTask(null);
        await loadData(user.session_token, user.id);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Completed' ? '#10b981' : '#3b82f6';
  };

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || `Proyecto #${projectId}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard Usuario</Text>
          <Text style={styles.headerSubtitle}>Bienvenido, {user?.name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'projects' && styles.activeTab]}
          onPress={() => setActiveTab('projects')}
        >
          <Text style={[styles.tabText, activeTab === 'projects' && styles.activeTabText]}>
            Proyectos ({projects.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tasks' && styles.activeTab]}
          onPress={() => setActiveTab('tasks')}
        >
          <Text style={[styles.tabText, activeTab === 'tasks' && styles.activeTabText]}>
            Mis Tareas ({myTasks.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'projects' ? (
          <View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>📋 Vista de solo lectura - Solo puedes ver proyectos</Text>
            </View>
            {projects.map((project) => (
              <View key={project.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{project.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                    <Text style={styles.statusText}>{project.status}</Text>
                  </View>
                </View>
                <Text style={styles.cardSubtitle}>Equipo: {project.team}</Text>
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>Progreso: {project.progress}%</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${project.progress}%` }]} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>✏️ Puedes editar el progreso y estado de tus tareas</Text>
            </View>
            {myTasks.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No tienes tareas asignadas</Text>
              </View>
            ) : (
              myTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.card}
                  onPress={() => handleEditTask(task)}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{task.name}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                      <Text style={styles.priorityText}>{task.priority}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardDescription}>{task.description}</Text>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskInfoText}>📁 {getProjectName(task.project_id)}</Text>
                    {task.due_date && (
                      <Text style={styles.taskInfoText}>📅 {task.due_date}</Text>
                    )}
                  </View>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressText}>Progreso: {task.progress}%</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                        <Text style={styles.statusText}>{task.status}</Text>
                      </View>
                    </View>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
                    </View>
                  </View>
                  <Text style={styles.editHint}>Toca para editar</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal Editar Tarea */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Tarea</Text>
            
            {selectedTask && (
              <>
                <Text style={styles.taskName}>{selectedTask.name}</Text>
                <Text style={styles.taskDescription}>{selectedTask.description}</Text>
                
                <Text style={styles.label}>Progreso: {selectedTask.progress}%</Text>
                <View style={styles.sliderContainer}>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => setSelectedTask({
                      ...selectedTask,
                      progress: Math.max(0, selectedTask.progress - 10)
                    })}
                  >
                    <Text style={styles.sliderButtonText}>-</Text>
                  </TouchableOpacity>
                  <View style={styles.sliderValue}>
                    <Text style={styles.sliderValueText}>{selectedTask.progress}%</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => setSelectedTask({
                      ...selectedTask,
                      progress: Math.min(100, selectedTask.progress + 10)
                    })}
                  >
                    <Text style={styles.sliderButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.label}>Estado:</Text>
                <View style={styles.statusContainer}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      selectedTask.status === 'In Progress' && styles.statusButtonSelected
                    ]}
                    onPress={() => setSelectedTask({ ...selectedTask, status: 'In Progress' })}
                  >
                    <Text style={styles.statusButtonText}>En Progreso</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      styles.statusButtonCompleted,
                      selectedTask.status === 'Completed' && styles.statusButtonSelected
                    ]}
                    onPress={() => setSelectedTask({ ...selectedTask, status: 'Completed' })}
                  >
                    <Text style={styles.statusButtonText}>Completado</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setEditModalVisible(false);
                  setSelectedTask(null);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.updateButton]}
                onPress={handleUpdateTask}
              >
                <Text style={styles.buttonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#1f2937',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 16,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoBox: {
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoText: {
    color: '#1e40af',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  taskInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskInfoText: {
    fontSize: 12,
    color: '#6b7280',
  },
  editHint: {
    fontSize: 12,
    color: '#3b82f6',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 24,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sliderButton: {
    width: 40,
    height: 40,
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sliderValue: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  sliderValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#3b82f6',
  },
  statusButtonCompleted: {
    backgroundColor: '#10b981',
  },
  statusButtonSelected: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#1f2937',
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6b7280',
  },
  updateButton: {
    backgroundColor: '#10b981',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
