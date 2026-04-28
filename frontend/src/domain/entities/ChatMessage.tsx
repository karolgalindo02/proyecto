export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id?: number;
  session_id?: number;
  role: ChatRole;
  content: string;
  created_at?: string;
}

export interface ProjectStructure {
  project_name: string;
  description: string;
  tasks: Array<{
    title: string;
    description: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
}