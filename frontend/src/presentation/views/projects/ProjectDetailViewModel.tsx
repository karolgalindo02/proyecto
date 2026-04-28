import { useCallback, useEffect, useState } from 'react';
import { Alert, Share } from 'react-native';
import { ProjectRepository } from '../../../data/repositories/ProjectRepository';
import { TaskRepository } from '../../../data/repositories/TaskRepository';
import { Project } from '../../../domain/entities/Project';
import { Task } from '../../../domain/entities/Task';
import { formatApiError } from '../../../data/sources/remote/api/ApiDelivery';

export const useProjectDetailViewModel = (projectId: number) => {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const p = await ProjectRepository.getById(projectId);
      setProject(p);
      const t = await TaskRepository.list({ project_id: projectId });
      setTasks(t);
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  // Métricas derivadas (no van a la BD, solo para la UI)
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'DONE').length;
  const progress = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const isAdmin = project?.role === 'ADMIN';

  const shareCode = async () => {
    if (!project) return;
    try {
      await Share.share({
        message: `Únete a mi proyecto \"${project.name}\" en Takio con el código: ${project.invite_code}`,
        title: 'Invitación a Takio',
      });
    } catch (e) { /* user cancelled */ }
  };

  /**
   * DELETE /api/projects/:id — solo el owner (ADMIN) puede eliminar.
   * Cascada: elimina automáticamente `project_members` y `tasks` por FK ON DELETE CASCADE.
   */
  const remove = async (): Promise<boolean> => {
    if (!project) return false;
    return new Promise((resolve) => {
      Alert.alert(
        'Eliminar proyecto',
        `¿Seguro que deseas eliminar \"${project.name}\"? Se eliminarán todas las tareas y miembros.`,
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Eliminar', style: 'destructive', onPress: async () => {
              try {
                await ProjectRepository.remove(project.id);
                resolve(true);
              } catch (err) {
                Alert.alert('Error', formatApiError(err));
                resolve(false);
              }
            }
          },
        ]
      );
    });
  };

  return {
    project, tasks, loading,
    totalTasks, doneTasks, progress, isAdmin,
    reload: load, shareCode, remove,
  };
};