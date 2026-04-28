// Inserta una fila en `project_members` con rol MEMBER.
import { useState } from 'react';
import { Alert } from 'react-native';
import { ProjectRepository } from '../../../data/repositories/ProjectRepository';
import { Project } from '../../../domain/entities/Project';
import { formatApiError } from '../../../data/sources/remote/api/ApiDelivery';

export const useJoinProjectViewModel = (onJoined?: (project: Project) => void) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const onChange = (raw: string) => {
    // Acepta solo alfanumérico mayúscula, sin caracteres ambiguos
    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setCode(clean);
    if (error) setError(undefined);
  };

  const validate = (): boolean => {
    if (code.length < 4) { setError('Código demasiado corto'); return false; }
    if (code.length > 10) { setError('Código demasiado largo'); return false; }
    return true;
  };

  /**
   * POST /api/projects/join (Node):
   *   SELECT p FROM projects WHERE invite_code = ?
   *   IF user not member → INSERT INTO project_members (user_id, project_id, role='MEMBER')
   */
  const submit = async (): Promise<Project | null> => {
    if (!validate()) return null;
    setLoading(true);
    try {
      const project = await ProjectRepository.joinByCode(code);
      onJoined?.(project);
      return project;
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { code, error, loading, onChange, submit };
};