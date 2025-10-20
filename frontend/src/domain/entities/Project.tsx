export interface Project {
  id?: number;
  name: string;
  team: string;
  progress: number;
  status: 'In Progress' | 'Completed';
  created_at?: string;
  updated_at?: string;
}