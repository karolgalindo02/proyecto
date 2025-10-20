export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  image: string;
  role: 'admin' | 'user';
  session_token: string;
}

export interface Project {
  id: number;
  name: string;
  team: string;
  progress: number;
  status: 'In Progress' | 'Completed';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  project_id: number;
  assigned_to: number;
  progress: number;
  priority: 'Low' | 'Medium' | 'High';
  due_date: string;
  status: 'In Progress' | 'Completed';
  created_at: string;
  updated_at: string;
  project_name?: string;
  assigned_user_name?: string;
}

export interface DashboardState {
  user: User | null;
  projects: Project[];
  tasks: Task[];
  refreshing: boolean;
  modalVisible: boolean;
  modalConfig: ModalConfig;
}

export interface ModalConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}