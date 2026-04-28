import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNotificationsViewModel } from './NotificationsViewModel';
import { TopBar } from '../../components/TopBar';
import { AppColors } from '../../theme/AppTheme';
import { NotificationType } from '../../../domain/entities/Notification';

const ICON_MAP: Record<NotificationType, { icon: keyof typeof Feather.glyphMap; bg: string; fg: string }> = {
  PROJECT_JOIN:  { icon: 'user-plus',  bg: AppColors.lavender, fg: AppColors.primary },
  TASK_ASSIGNED: { icon: 'user-check', bg: AppColors.pink,     fg: AppColors.pinkText },
  TASK_CREATED:  { icon: 'plus-square',bg: AppColors.peach,    fg: AppColors.peachText },
  TASK_DUE_SOON: { icon: 'alert-circle', bg: AppColors.yellow, fg: AppColors.yellowText },
  GENERAL:       { icon: 'bell',       bg: AppColors.blue,     fg: AppColors.blueText },
};

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60) return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
}

export const NotificationsScreen: React.FC<any> = ({ navigation }) => {
  const vm = useNotificationsViewModel();

  return (
    <View style={{ flex: 1, backgroundColor: AppColors.background }}>
      <TopBar
        back
        title={`Notificaciones${vm.unreadCount > 0 ? ` (${vm.unreadCount})` : ''}`}
        rightIcon="check-circle"
        onRightPress={vm.markAllRead}
      />

      <View style={styles.filterRow}>
        {(['all', 'unread'] as const).map((f) => (
          <Pressable key={f} onPress={() => vm.setFilter(f)}
            style={[styles.chip, vm.filter === f && { backgroundColor: AppColors.primary }]}>
            <Text style={{ color: vm.filter === f ? '#FFF' : AppColors.primary, fontWeight: '700' }}>
              {f === 'all' ? 'Todas' : 'No leídas'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 60 }}>
        {vm.loading ? (
          <ActivityIndicator color={AppColors.primary} style={{ marginTop: 30 }} />
        ) : vm.notifications.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="bell-off" size={40} color={AppColors.textMuted} />
            <Text style={{ fontWeight: '800', marginTop: 10 }}>Sin notificaciones</Text>
            <Text style={{ color: AppColors.textSecondary, marginTop: 4 }}>Aquí verás avisos de tu equipo.</Text>
          </View>
        ) : (
          vm.notifications.map((n) => {
            const meta = ICON_MAP[n.type] || ICON_MAP.GENERAL;
            return (
              <Pressable
                key={n.id}
                onPress={() => {
                  if (!n.is_read) vm.markRead(n.id);
                  if (n.related_project_id) navigation.navigate('ProjectDetail', { id: n.related_project_id });
                }}
                onLongPress={() => vm.remove(n.id)}
                style={[styles.card, !n.is_read && styles.unread]}
              >
                <View style={[styles.icon, { backgroundColor: meta.bg }]}>
                  <Feather name={meta.icon} size={18} color={meta.fg} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.title} numberOfLines={1}>{n.title}</Text>
                    {!n.is_read && <View style={styles.dot} />}
                  </View>
                  {!!n.message && <Text style={styles.msg} numberOfLines={2}>{n.message}</Text>}
                  <Text style={styles.time}>
                    {n.project_name ? `${n.project_name} · ` : ''}{timeAgo(n.created_at)}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingBottom: 6 },
  chip: { backgroundColor: AppColors.primaryLight, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 999 },
  card: {
    backgroundColor: '#FFF', borderRadius: 18, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: AppColors.primary, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1,
  },
  unread: { borderLeftWidth: 4, borderLeftColor: AppColors.primary, backgroundColor: '#FAFAFF' },
  icon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '800', color: AppColors.text, fontSize: 14, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: AppColors.primary },
  msg: { color: AppColors.textSecondary, fontSize: 13, marginTop: 2 },
  time: { color: AppColors.textMuted, fontSize: 11, marginTop: 4 },
  empty: { alignItems: 'center', padding: 40 },
});