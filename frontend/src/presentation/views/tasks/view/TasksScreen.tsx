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

type TaskItemProps = {
  item: any;
  navigation: TasksNavigationProp;
  toggleTaskStatus: (t: any) => void;
  deleteTask: (id: any) => void;
  user?: any;
};

const TaskItem: React.FC<TaskItemProps> = ({ item, navigation, toggleTaskStatus, deleteTask, user }) => {
  const isOverdue = item.due_date && new Date(item.due_date) < new Date() && item.status !== 'Completed';

  const getPriority = () => {
    if (item.priority === 'High') return { style: styles.highPriority, label: 'ALTA' };
    if (item.priority === 'Medium') return { style: styles.mediumPriority, label: 'MEDIA' };
    return { style: styles.lowPriority, label: 'BAJA' };
  };

  const priority = getPriority();

  return (
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
        <Text style={[styles.priorityBadge, priority.style]}>
          {priority.label}
        </Text>

        <Text style={styles.progressText}>
          Progreso: {item.progress}%
        </Text>

        {item.due_date && (
          <Text style={[styles.dueDate, isOverdue && styles.overdue]}>
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
};

type FilterGroupProps<V extends string> = {
  label: string;
  options: { value: V; label: string }[];
  current: V;
  onChange: (v: V) => void;
};

function FilterGroup<V extends string>({ label, options, current, onChange }: Readonly<FilterGroupProps<V>>) {
  return (
    <View style={styles.filtersRow}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterButtons}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.filterButton, current === opt.value && styles.filterButtonActive]}
              onPress={() => onChange(opt.value)}
            >
              <Text style={[styles.filterButtonText, current === opt.value && styles.filterButtonTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

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

          <FilterGroup<'all' | 'In Progress' | 'Completed'>
            label="Estado:"
            options={[
              { value: 'all', label: 'TODAS' },
              { value: 'In Progress', label: 'EN PROGRESO' },
              { value: 'Completed', label: 'COMPLETADAS' },
            ]}
            current={filterStatus}
            onChange={onChangeFilterStatus}
          />

          <FilterGroup<'all' | 'High' | 'Medium' | 'Low'>
            label="Prioridad:"
            options={[
              { value: 'all', label: 'TODAS' },
              { value: 'High', label: 'ALTA' },
              { value: 'Medium', label: 'MEDIA' },
              { value: 'Low', label: 'BAJA' },
            ]}
            current={filterPriority}
            onChange={onChangeFilterPriority}
          />
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
              renderItem={({ item }) => (
                <TaskItem
                  item={item}
                  navigation={navigation}
                  toggleTaskStatus={toggleTaskStatus}
                  deleteTask={deleteTask}
                  user={user}
                />
              )}
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