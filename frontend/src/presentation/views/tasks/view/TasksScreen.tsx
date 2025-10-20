import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../../App';
import { useNavigation } from '@react-navigation/native';
import { CustomModal } from '../../../components/CustomModal';
import { useTasksViewModel } from './ViewModel';
import styles from './Styles';

type TasksNavigationProp = StackNavigationProp<RootStackParamList>;

export const TasksScreen = () => {
  const navigation = useNavigation<TasksNavigationProp>();
  const {
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
  } = useTasksViewModel();

  const renderTaskItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => navigation.navigate('TaskDetailScreen' as any, { taskId: item.id })}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskName}>{item.name}</Text>
        <View style={styles.taskActions}>
          <TouchableOpacity
            onPress={() => toggleTaskStatus(item)}
            style={[
              styles.statusButton,
              item.status === 'Completed' ? styles.completedButton : styles.inProgressButton
            ]}
          >
            <Text style={styles.statusButtonText}>
              {item.status === 'Completed' ? '✓' : '⌛'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('TaskEditScreen' as any, { taskId: item.id })}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>

          {(user?.role === 'admin' || item.assigned_to === user?.id) && (
            <TouchableOpacity
              onPress={() => deleteTask(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.taskDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.taskDetails}>
        <Text style={[
          styles.priorityBadge,
          item.priority === 'High' ? styles.highPriority :
          item.priority === 'Medium' ? styles.mediumPriority :
          styles.lowPriority
        ]}>
          {item.priority === 'High' ? 'ALTA' : 
           item.priority === 'Medium' ? 'MEDIA' : 'BAJA'}
        </Text>
        
        <Text style={styles.progressText}>
          Progreso: {item.progress}%
        </Text>

        {item.due_date && (
          <Text style={[
            styles.dueDate,
            new Date(item.due_date) < new Date() && item.status !== 'Completed' && styles.overdue
          ]}>
            Vence: {new Date(item.due_date).toLocaleDateString()}
          </Text>
        )}
      </View>

      <View style={styles.taskFooter}>
        <Text style={styles.projectText}>
          Proyecto: {item.project_name || `ID: ${item.project_id}`}
        </Text>
        <Text style={styles.assignedText}>
          Asignada a: {item.assigned_user_name || `Usuario ${item.assigned_to}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
     //   source={require('../../../../../assets/equipo.jpg')}
        style={styles.imageBackground}
      />
      
      <View style={styles.headerContainer}>
        <Image
       //   source={require('../../../../../assets/logo.png')}
          style={styles.logoImage}
        />
        <Text style={styles.headerTitle}>GESTIÓN DE TAREAS</Text>
        <Text style={styles.welcomeText}>
          {user?.name} ({user?.role})
        </Text>
      </View>

      <View style={styles.tasksContent}>
        {/* Filtros y Búsqueda */}
        <View style={styles.filtersSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Buscar tareas..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={onChangeSearch}
          />

          <View style={styles.filtersRow}>
            <Text style={styles.filterLabel}>Estado:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterButtons}>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filterStatus === 'all' && styles.filterButtonActive
                  ]}
                  onPress={() => onChangeFilterStatus('all')}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filterStatus === 'all' && styles.filterButtonTextActive
                  ]}>
                    TODAS
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filterStatus === 'In Progress' && styles.filterButtonActive
                  ]}
                  onPress={() => onChangeFilterStatus('In Progress')}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filterStatus === 'In Progress' && styles.filterButtonTextActive
                  ]}>
                    EN PROGRESO
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filterStatus === 'Completed' && styles.filterButtonActive
                  ]}
                  onPress={() => onChangeFilterStatus('Completed')}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filterStatus === 'Completed' && styles.filterButtonTextActive
                  ]}>
                    COMPLETADAS
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          <View style={styles.filtersRow}>
            <Text style={styles.filterLabel}>Prioridad:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterButtons}>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filterPriority === 'all' && styles.filterButtonActive
                  ]}
                  onPress={() => onChangeFilterPriority('all')}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filterPriority === 'all' && styles.filterButtonTextActive
                  ]}>
                    TODAS
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filterPriority === 'High' && styles.filterButtonActive
                  ]}
                  onPress={() => onChangeFilterPriority('High')}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filterPriority === 'High' && styles.filterButtonTextActive
                  ]}>
                    ALTA
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filterPriority === 'Medium' && styles.filterButtonActive
                  ]}
                  onPress={() => onChangeFilterPriority('Medium')}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filterPriority === 'Medium' && styles.filterButtonTextActive
                  ]}>
                    MEDIA
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filterPriority === 'Low' && styles.filterButtonActive
                  ]}
                  onPress={() => onChangeFilterPriority('Low')}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filterPriority === 'Low' && styles.filterButtonTextActive
                  ]}>
                    BAJA
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Estadísticas Rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{filteredTasks.length}</Text>
            <Text style={styles.statLabel}>TOTAL</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredTasks.filter((task: any) => task.status === 'In Progress').length}
            </Text>
            <Text style={styles.statLabel}>PENDIENTES</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredTasks.filter((task: any) => task.status === 'Completed').length}
            </Text>
            <Text style={styles.statLabel}>COMPLETADAS</Text>
          </View>
        </View>

        {/* Lista de Tareas */}
        <View style={styles.tasksListContainer}>
          <Text style={styles.sectionTitle}>
            TAREAS ({filteredTasks.length})
          </Text>
          
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No se encontraron tareas</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' 
                  ? 'Intenta con otros filtros' 
                  : 'Crea tu primera tarea'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredTasks}
              renderItem={renderTaskItem}
              keyExtractor={(item) => (item.id ?? '').toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tasksList}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          )}
        </View>
      </View>

      {/* Botón Flotante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('TaskCreateScreen' as any)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
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