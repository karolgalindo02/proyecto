import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ProjectRepository } from '../../../data/repositories/ProjectRepository';
import { TaskRepository } from '../../../data/repositories/TaskRepository';
import { Project } from '../../../domain/entities/Project';
import { formatApiError } from '../../../data/sources/remote/api/ApiDelivery';

export interface DashboardSummary {
  total: number;
  done: number;
  in_progress: number;
  completion_percent: number;
  project_count: number;
}

export const useDashboardViewModel = () => {
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Carga combinada: usuario + summary + proyectos (con role + progreso por proyecto).
   * GET /api/tasks/dashboard/summary
   * GET /api/projects (incluye JOIN con project_members → role + tasks_count)
   */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem('takio_user');
      setUser(raw ? JSON.parse(raw) : null);
      const [s, p] = await Promise.all([
        TaskRepository.dashboardSummary(),
        ProjectRepository.list(),
      ]);
      setSummary(s);
      setProjects(p);
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const logout = async () => {
    await AsyncStorage.multiRemove(['takio_token', 'takio_user']);
  };

  return { user, summary, projects, loading, reload: load, logout };
};