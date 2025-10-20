export interface Task {
  id?: number;
  name: string;
  description: string;
  project_id: number;
  assigned_to: number;
  progress: number;
  priority: 'Low' | 'Medium' | 'High';
  due_date: string | null;
  status: 'In Progress' | 'Completed';
  created_at?: string;
  updated_at?: string;
  project_name?: string;
  assigned_user_name?: string;
}