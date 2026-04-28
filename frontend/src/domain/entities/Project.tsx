export type ProjectRole = 'ADMIN' | 'MEMBER';

export interface Project {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  owner_id: number;
  invite_code: string;
  start_date?: string | null;
  end_date?: string | null;
  role?: ProjectRole;
  tasks_count?: number;
  tasks_done?: number;
  progress?: number;
  members?: Array<{ id: number; name: string; lastname: string; email: string; role: ProjectRole }>;
  created_at?: string;
}