import { ApiDelivery } from '../sources/remote/api/ApiDelivery';
import { AppNotification } from '../../domain/entities/Notification';

export const NotificationRepository = {
  async list(onlyUnread = false): Promise<{ notifications: AppNotification[]; unread_count: number }> {
    const { data } = await ApiDelivery.get('/notifications', {
      params: { only_unread: onlyUnread || undefined, limit: 100 },
    });
    return data.data;
  },

  async unreadCount(): Promise<number> {
    const { data } = await ApiDelivery.get('/notifications/unread-count');
    return data?.data?.unread_count || 0;
  },

  async markRead(id: number): Promise<void> {
    await ApiDelivery.patch(`/notifications/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    await ApiDelivery.post('/notifications/read-all');
  },

  async remove(id: number): Promise<void> {
    await ApiDelivery.delete(`/notifications/${id}`);
  },
};