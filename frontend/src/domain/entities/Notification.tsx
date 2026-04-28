export type NotificationType =
  | 'PROJECT_JOIN'
  | 'TASK_ASSIGNED'
  | 'TASK_CREATED'
  | 'TASK_DUE_SOON'
  | 'GENERAL';

export interface AppNotification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  related_project_id: number | null;
  related_task_id: number | null;
  actor_id: number | null;
  actor_name?: string | null;
  actor_lastname?: string | null;
  actor_image?: string | null;
  project_name?: string | null;
  task_title?: string | null;
  is_read: 0 | 1;
  created_at: string;
}