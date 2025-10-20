import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';
import { useNavigation } from '@react-navigation/native';
import { CustomModal } from '../../components/CustomModal';
import { useDashboardViewModel } from './ViewModel';
import styles from './Styles';

type DashboardNavigationProp = StackNavigationProp<RootStackParamList>;

export const DashboardScreen = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const {
    user,
    projects,
    tasks,
    refreshing,
    modalVisible,
    modalConfig,
    getTasksByStatus,
    getMyPendingTasks,
    getUrgentTasks,
    isAdmin,
    onRefresh,
    hideModal
  } = useDashboardViewModel();

  const myPendingTasks = getMyPendingTasks();
  const urgentTasks = getUrgentTasks();
  const completedTasks = getTasksByStatus('Completed');

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/equipo.jpg')}
        style={styles.imageBackground}
      />
      
      <View style={styles.headerContainer}>
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logoImage}
        />
        <Text style={styles.headerTitle}>TAKIO APP</Text>
        <Text style={styles.welcomeText}>
          Hola, {user?.name} ({user?.role})
        </Text>
      </View>

      <View style={styles.dashboardContent}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{projects.length}</Text>
              <Text style={styles.statLabel}>Proyectos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{tasks.length}</Text>
              <Text style={styles.statLabel}>Total Tareas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {completedTasks.length}
              </Text>
              <Text style={styles.statLabel}>Completadas</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>ACCIONES RÁPIDAS</Text>
            <View style={styles.actionsGrid}>
              {isAdmin && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('ProjectCreateScreen' as any)}
                >
                  <Text style={styles.actionButtonText}>Nuevo Proyecto</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('TaskCreateScreen' as any)}
              >
                <Text style={styles.actionButtonText}>Nueva Tarea</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('TasksScreen' as any)}
              >
                <Text style={styles.actionButtonText}>Ver Tareas</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Active Projects Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROYECTOS ACTIVOS</Text>
            {projects.length === 0 ? (
              <Text style={styles.emptyText}>No hay proyectos activos</Text>
            ) : (
              projects
                .filter(project => project.status === 'In Progress')
                .slice(0, 3)
                .map(project => (
                  <TouchableOpacity
                    key={project.id}
                    style={styles.projectCard}
                    onPress={() => navigation.navigate('ProjectDetailScreen' as any, { projectId: project.id })}
                  >
                    <View style={styles.projectHeader}>
                      <Text style={styles.projectName}>{project.name}</Text>
                      <Text style={[
                        styles.projectStatus,
                        project.status === 'Completed' ? styles.statusCompleted : styles.statusInProgress
                      ]}>
                        {project.status === 'Completed' ? 'COMPLETADO' : 'EN PROGRESO'}
                      </Text>
                    </View>
                    <Text style={styles.projectTeam}>Equipo: {project.team}</Text>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${project.progress}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>{project.progress}%</Text>
                    </View>
                  </TouchableOpacity>
                ))
            )}
          </View>

          {/* Pending Tasks Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isAdmin ? 'TAREAS PENDIENTES' : 'MIS TAREAS PENDIENTES'}
            </Text>
            {myPendingTasks.length === 0 ? (
              <Text style={styles.emptyText}>
                {isAdmin ? 'No hay tareas pendientes' : 'No tienes tareas pendientes'}
              </Text>
            ) : (
              myPendingTasks.map(task => (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.taskCard,
                    task.priority === 'High' ? styles.priorityHigh :
                    task.priority === 'Medium' ? styles.priorityMedium :
                    styles.priorityLow
                  ]}
                  onPress={() => navigation.navigate('TaskDetailScreen' as any, { taskId: task.id })}
                >
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskName}>{task.name}</Text>
                    <Text style={styles.taskPriority}>
                      {task.priority === 'High' ? 'ALTA' : 
                       task.priority === 'Medium' ? 'MEDIA' : 'BAJA'}
                    </Text>
                  </View>
                  <Text style={styles.taskDescription} numberOfLines={2}>
                    {task.description}
                  </Text>
                  {task.due_date && (
                    <Text style={styles.dueDate}>
                      Vence: {new Date(task.due_date).toLocaleDateString()}
                    </Text>
                  )}
                  <View style={styles.taskProgress}>
                    <Text style={styles.taskProgressText}>
                      Progreso: {task.progress}%
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Recent Activity Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACTIVIDAD RECIENTE</Text>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>
                {isAdmin 
                  ? `Total de tareas: ${tasks.length}` 
                  : `Tus tareas pendientes: ${getTasksByStatus('In Progress').filter(task => task.assigned_to === user?.id).length}`
                }
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>
                {isAdmin
                  ? `Tareas completadas: ${completedTasks.length}`
                  : `Tus tareas completadas: ${completedTasks.filter(task => task.assigned_to === user?.id).length}`
                }
              </Text>
            </View>
            {urgentTasks.length > 0 && (
              <View style={[styles.activityItem, styles.urgentActivity]}>
                <Text style={styles.urgentText}>
                  ⚠ {isAdmin ? 'Hay' : 'Tienes'} {urgentTasks.length} tarea(s) que vencen pronto
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <CustomModal
        visible={modalVisible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={hideModal}
      />
    </View>
  );
};