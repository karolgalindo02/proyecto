export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description: string;
  project_id: number | null;
  project_name?: string | null;
  created_by: number;
  assigned_to: number | null;
  progress: number;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  due_time: string | null;
  created_at?: string;
  updated_at?: string;
}