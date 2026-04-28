// Lista de tareas con filtros por fecha y estado.
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { TaskRepository } from '../../../data/repositories/TaskRepository';
import { Task, TaskStatus } from '../../../domain/entities/Task';
import { formatApiError } from '../../../data/sources/remote/api/ApiDelivery';

export type TaskFilter = 'ALL' | TaskStatus;

const fmtIso = (d: Date) => d.toISOString().slice(0, 10);

export const useTasksViewModel = (initialDate: Date = new Date()) => {
  const [date, setDate] = useState<Date>(initialDate);
  const [filter, setFilter] = useState<TaskFilter>('ALL');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * GET /api/tasks?date=YYYY-MM-DD
   * El backend filtra por:
   *   t.created_by = userId OR t.assigned_to = userId OR t.project_id IN (mis proyectos)
   *   AND t.due_date = ?
   */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await TaskRepository.list({ date: fmtIso(date) });
      setTasks(filter === 'ALL' ? list : list.filter((t) => t.status === filter));
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, [date, filter]);

  useEffect(() => { load(); }, [load]);

  /**
   * Cicla el estado: PENDING → IN_PROGRESS → DONE → PENDING
   * UPDATE tasks SET status=?, progress=?, updated_at=NOW() WHERE id=?
   */
  const cycleStatus = async (task: Task) => {
    const next: TaskStatus =
      task.status === 'DONE'        ? 'PENDING'
      : task.status === 'PENDING'   ? 'IN_PROGRESS'
      : /* IN_PROGRESS */             'DONE';
    const progress = next === 'DONE' ? 100 : next === 'IN_PROGRESS' ? 50 : 0;
    try {
      // optimistic update
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next, progress } : t)));
      await TaskRepository.update(task.id, { status: next, progress });
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
      load(); // rollback recargando
    }
  };

  /**
   * DELETE /api/tasks/:id (solo creador, asignado o admin del proyecto)
   */
  const remove = async (taskId: number) => {
    try {
      await TaskRepository.remove(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
    }
  };

  return {
    date, setDate,
    filter, setFilter,
    tasks, loading,
    reload: load,
    cycleStatus, remove,
  };}