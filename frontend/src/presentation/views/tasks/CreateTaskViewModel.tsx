// Inserta en MySQL `tasks`. project_id y assigned_to son OPCIONALES.
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskRepository } from '../../../data/repositories/TaskRepository';
import { ProjectRepository } from '../../../data/repositories/ProjectRepository';
import { Project } from '../../../domain/entities/Project';
import { Task, TaskPriority, TaskStatus } from '../../../domain/entities/Task';
import { formatApiError } from '../../../data/sources/remote/api/ApiDelivery';

export interface CreateTaskValues {
  title: string;            // tasks.title VARCHAR(100) NOT NULL
  description: string;      // tasks.description TEXT
  projectId: number | null; // tasks.project_id BIGINT NULLABLE
  assignedTo: number | null;// tasks.assigned_to BIGINT NULLABLE (solo si admin)
  progress: number;         // tasks.progress INT DEFAULT 0
  priority: TaskPriority;   // tasks.priority ENUM('LOW','MEDIUM','HIGH')
  dueDate: Date;            // tasks.due_date DATE
  dueTime: Date;            // tasks.due_time TIME
}

export type CreateTaskErrors = Partial<Record<'title' | 'description', string>>;

const initial = (date: Date = new Date()): CreateTaskValues => ({
  title: '', description: '',
  projectId: null, assignedTo: null,
  progress: 0, priority: 'MEDIUM',
  dueDate: date, dueTime: new Date(),
});

const fmtDate = (d: Date) => d.toISOString().slice(0, 10);
const fmtTime = (d: Date) => d.toTimeString().slice(0, 5); // HH:MM

const deriveStatus = (progress: number): TaskStatus => {
  if (progress >= 100) return 'DONE';
  if (progress > 0) return 'IN_PROGRESS';
  return 'PENDING';
};

export const useCreateTaskViewModel = (
  defaultDate?: Date,
  defaultProjectId?: number,
  onSuccess?: (task: Task) => void
) => {
  const [values, setValues] = useState<CreateTaskValues>(() => ({
    ...initial(defaultDate || new Date()),
    projectId: defaultProjectId ?? null,
  }));
  const [errors, setErrors] = useState<CreateTaskErrors>({});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Cargar proyectos del usuario y el id propio
  useEffect(() => {
    (async () => {
      try {
        const list = await ProjectRepository.list();
        setProjects(list);
      } catch { /* sin red, dejar vacío */ }
      const raw = await AsyncStorage.getItem('takio_user');
      if (raw) setCurrentUserId(JSON.parse(raw).id);
    })();
  }, []);

  const selectedProject = projects.find((p) => p.id === values.projectId) || null;

  /**
   * Solo los ADMIN del proyecto pueden asignar tareas a OTROS miembros.
   * Para usuarios MEMBER, el form de asignar se oculta y por defecto la tarea queda
   * con assigned_to=null (se la asigna a sí mismo en el backend si no se pasa).
   */
  const canAssignToOthers = selectedProject?.role === 'ADMIN';

  const onChange = <K extends keyof CreateTaskValues>(field: K, value: CreateTaskValues[K]) => {
    setValues((p) => ({ ...p, [field]: value }));
    if (errors[field as keyof CreateTaskErrors]) {
      setErrors((p) => ({ ...p, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const e: CreateTaskErrors = {};
    if (!values.title.trim()) e.title = 'El título es requerido';
    else if (values.title.length > 100) e.title = 'Máximo 100 caracteres';
    if (values.description.length > 2000) e.description = 'Descripción demasiado larga';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /**
   * POST /api/tasks → inserta en MySQL:
   *   INSERT INTO tasks (title, description, project_id, created_by, assigned_to,
   *                      progress, priority, status, due_date, due_time)
   *   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   *
   * - `created_by` lo asigna el backend con el JWT (req.user.id)
   * - `project_id` y `assigned_to` van NULL si no se eligen
   */
  const submit = async (): Promise<Task | null> => {
    if (!validate()) return null;
    setLoading(true);
    try {
      const payload: any = {
        title: values.title.trim(),
        description: values.description.trim(),
        project_id: values.projectId,         // nullable
        assigned_to: canAssignToOthers ? values.assignedTo : null,
        progress: Math.max(0, Math.min(100, Math.round(values.progress))),
        priority: values.priority,
        status: deriveStatus(values.progress),
        due_date: fmtDate(values.dueDate),
        due_time: fmtTime(values.dueTime),
      };
      const task = await TaskRepository.create(payload);
      onSuccess?.(task);
      return task;
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    values, errors, loading, projects, selectedProject,
    canAssignToOthers, currentUserId,
    onChange, submit, fmtDate, fmtTime,
  };
};