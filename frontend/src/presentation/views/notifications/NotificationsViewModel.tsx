import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { NotificationRepository } from '../../../data/repositories/NotificationRepository';
import { AppNotification } from '../../../domain/entities/Notification';
import { formatApiError } from '../../../data/sources/remote/api/ApiDelivery';

export const useNotificationsViewModel = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await NotificationRepository.list(filter === 'unread');
      setNotifications(r.notifications);
      setUnreadCount(r.unread_count);
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: 1 as 1 } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try { await NotificationRepository.markRead(id); }
    catch (err) { Alert.alert('Error', formatApiError(err)); load(); }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 as 1 })));
    setUnreadCount(0);
    try { await NotificationRepository.markAllRead(); }
    catch (err) { Alert.alert('Error', formatApiError(err)); load(); }
  };

  const remove = async (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try { await NotificationRepository.remove(id); }
    catch (err) { Alert.alert('Error', formatApiError(err)); load(); }
  };

  return { notifications, unreadCount, loading, filter, setFilter, reload: load, markRead, markAllRead, remove };
};

/** Hook ligero solo para el badge en la TopBar/Dashboard */
export const useUnreadBadge = (pollMs = 30000) => {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try { setCount(await NotificationRepository.unreadCount()); } catch { /* silencio */ }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, pollMs);
    return () => clearInterval(id);
  }, [refresh, pollMs]);

  return { count, refresh };
};