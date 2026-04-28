// Inserta en MySQL: `projects` + `project_members` (rol ADMIN automático para el creador).
import { useState } from 'react';
import { Alert } from 'react-native';
import { ProjectRepository } from '../../../data/repositories/ProjectRepository';
import { Project } from '../../../domain/entities/Project';
import { formatApiError } from '../../../data/sources/remote/api/ApiDelivery';

export interface CreateProjectValues {
  name: string;
  description: string;
  color: string;     // mapea a `projects.color`
  icon: string;      // mapea a `projects.icon`
  startDate: Date;   // → `projects.start_date` (YYYY-MM-DD)
  endDate: Date;     // → `projects.end_date`
}

export type CreateProjectErrors = Partial<Record<'name' | 'description' | 'dates', string>>;

const today = () => new Date();
const inDays = (n: number) => new Date(Date.now() + n * 24 * 3600 * 1000);

export const useCreateProjectViewModel = (
  onSuccess?: (project: Project) => void
) => {
  const [values, setValues] = useState<CreateProjectValues>({
    name: '', description: '', color: 'lavender', icon: 'briefcase',
    startDate: today(), endDate: inDays(30),
  });
  const [errors, setErrors] = useState<CreateProjectErrors>({});
  const [loading, setLoading] = useState(false);

  const onChange = <K extends keyof CreateProjectValues>(field: K, value: CreateProjectValues[K]) => {
    setValues((p) => ({ ...p, [field]: value }));
    if (errors[field as keyof CreateProjectErrors]) {
      setErrors((p) => ({ ...p, [field]: undefined }));
    }
  };

  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const validate = (): boolean => {
    const e: CreateProjectErrors = {};
    // 'projects.name' VARCHAR(100) NOT NULL
    if (!values.name.trim()) e.name = 'El nombre es requerido';
    else if (values.name.length > 100) e.name = 'Máximo 100 caracteres';
    // 'projects.description' TEXT (libre)
    if (values.endDate < values.startDate) e.dates = 'La fecha de fin debe ser posterior al inicio';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /**
   * POST /api/projects (Node + transacción MySQL):
   *   1. INSERT INTO projects (name, description, color, icon, owner_id, invite_code, start_date, end_date)
   *   2. INSERT INTO project_members (user_id, project_id, role='ADMIN')
   * Devuelve el proyecto recién creado con su `invite_code` único.
   */
  const submit = async (): Promise<Project | null> => {
    if (!validate()) return null;
    setLoading(true);
    try {
      const created = await ProjectRepository.create({
        name: values.name.trim(),
        description: values.description.trim(),
        color: values.color,
        icon: values.icon,
        start_date: fmt(values.startDate),
        end_date: fmt(values.endDate),
      });
      onSuccess?.(created);
      return created;
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { values, errors, loading, onChange, submit, fmt };
};