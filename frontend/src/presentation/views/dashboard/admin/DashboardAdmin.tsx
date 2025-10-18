import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Modal, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProjectService, Project } from '../../../../data/services/ProjectService';
import { TaskService, Task } from '../../../../data/services/TaskService';
import { UserService, User } from '../../../../data/services/UserService';
import { GetUserLocal } from '../../../../domain/useCases/userLocal/GetUserLocal';
import { RemoveUserLocal } from '../../../../domain/useCases/userLocal/RemoveUserLocal';

export const DashboardAdminScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks'>('projects');
  
  // Modales
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  
  // Formularios
  const [newProject, setNewProject] = useState<Project>({
    name: '',
    team: '',
    progress: 0,
    status: 'In Progress'
  });
  
  const [newTask, setNewTask] = useState<Task>({
    name: '',
    description: '',
    project_id: 0,
    assigned_to: 0,
    progress: 0,
    priority: 'Medium',
    due_date: '',
    status: 'In Progress'
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await GetUserLocal();
      if (userData) {
        setUser(userData);
        loadData(userData.session_token);
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' as never }] });
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  };

  const loadData = async (token: string) => {
    try {
      const [projectsRes, tasksRes, usersRes] = await Promise.all([
        ProjectService.getAll(token),
        TaskService.getAll(token),
        UserService.getAll(token)
      ]);

      if (projectsRes.success) setProjects(projectsRes.data || []);
      if (tasksRes.success) setTasks(tasksRes.data || []);
      if (usersRes.success) setUsers(usersRes.data || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(user.session_token);
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await RemoveUserLocal();
    navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' as never }] });
  };

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.team) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const response = await ProjectService.create(newProject, user.session_token);
      if (response.success) {
        Alert.alert('Éxito', 'Proyecto creado correctamente');
        setProjectModalVisible(false);
        setNewProject({ name: '', team: '', progress: 0, status: 'In Progress' });
        await loadData(user.session_token);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el proyecto');
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.name || !newTask.project_id || !newTask.assigned_to) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const response = await TaskService.create(newTask, user.session_token);
      if (response.success) {
        Alert.alert('Éxito', 'Tarea creada correctamente');
        setTaskModalVisible(false);
        setNewTask({
          name: '',
          description: '',
          project_id: 0,
          assigned_to: 0,
          progress: 0,
          priority: 'Medium',
          due_date: '',
          status: 'In Progress'
        });
        await loadData(user.session_token);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la tarea');
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard Admin</Text>
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
            Tareas ({tasks.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'projects' ? (
          <View>
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
            {tasks.map((task) => (
              <View key={task.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{task.name}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                    <Text style={styles.priorityText}>{task.priority}</Text>
                  </View>
                </View>
                <Text style={styles.cardDescription}>{task.description}</Text>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskInfoText}>Proyecto ID: {task.project_id}</Text>
                  <Text style={styles.taskInfoText}>Asignado a: {task.assigned_to}</Text>
                </View>
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>Progreso: {task.progress}%</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Buttons */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => activeTab === 'projects' ? setProjectModalVisible(true) : setTaskModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal Crear Proyecto */}
      <Modal visible={projectModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear Proyecto</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre del proyecto"
              value={newProject.name}
              onChangeText={(text) => setNewProject({ ...newProject, name: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Equipo"
              value={newProject.team}
              onChangeText={(text) => setNewProject({ ...newProject, team: text })}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setProjectModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateProject}
              >
                <Text style={styles.buttonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Crear Tarea */}
      <Modal visible={taskModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalScrollContent}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Crear Tarea</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Nombre de la tarea"
                value={newTask.name}
                onChangeText={(text) => setNewTask({ ...newTask, name: text })}
              />
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descripción"
                value={newTask.description}
                onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                multiline
                numberOfLines={3}
              />
              
              <Text style={styles.label}>Proyecto:</Text>
              <View style={styles.pickerContainer}>
                {projects.map((project) => (
                  <TouchableOpacity
                    key={project.id}
                    style={[
                      styles.pickerItem,
                      newTask.project_id === project.id && styles.pickerItemSelected
                    ]}
                    onPress={() => setNewTask({ ...newTask, project_id: project.id! })}
                  >
                    <Text style={styles.pickerText}>{project.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.label}>Asignar a:</Text>
              <View style={styles.pickerContainer}>
                {users.filter(u => u.role === 'user').map((u) => (
                  <TouchableOpacity
                    key={u.id}
                    style={[
                      styles.pickerItem,
                      newTask.assigned_to === u.id && styles.pickerItemSelected
                    ]}
                    onPress={() => setNewTask({ ...newTask, assigned_to: u.id })}
                  >
                    <Text style={styles.pickerText}>{u.name} {u.lastname}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.label}>Prioridad:</Text>
              <View style={styles.priorityContainer}>
                {['Low', 'Medium', 'High'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      newTask.priority === priority && styles.priorityButtonSelected,
                      { backgroundColor: getPriorityColor(priority) }
                    ]}
                    onPress={() => setNewTask({ ...newTask, priority: priority as any })}
                  >
                    <Text style={styles.priorityButtonText}>{priority}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TextInput
                style={styles.input}
                placeholder="Fecha límite (YYYY-MM-DD)"
                value={newTask.due_date}
                onChangeText={(text) => setNewTask({ ...newTask, due_date: text })}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setTaskModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.createButton]}
                  onPress={handleCreateTask}
                >
                  <Text style={styles.buttonText}>Crear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContent: {
    flex: 1,
    width: '100%',
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
    marginBottom: 20,
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 8,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginBottom: 8,
  },
  pickerItemSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  pickerText: {
    fontSize: 14,
    color: '#374151',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityButtonSelected: {
    opacity: 1,
  },
  priorityButtonText: {
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
  createButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
