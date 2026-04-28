import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AppColors } from '../../theme/AppTheme';
import { TopBar } from '../../components/TopBar';
import { BottomNav } from '../../components/BottomNav';
import { TaskRepository } from '../../../data/repositories/TaskRepository';
import { Task, TaskStatus } from '../../../domain/entities/Task';

const FILTERS: Array<{ id: 'ALL' | TaskStatus; label: string }> = [
  { id: 'ALL', label: 'All' },
  { id: 'PENDING', label: 'To do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'DONE', label: 'Completed' },
];

const STATUS_STYLE: Record<TaskStatus, { bg: string; fg: string; label: string }> = {
  DONE: { bg: AppColors.lavender, fg: AppColors.primary, label: 'Done' },
  IN_PROGRESS: { bg: AppColors.peach, fg: AppColors.peachText, label: 'In Progress' },
  PENDING: { bg: AppColors.blue, fg: AppColors.blueText, label: 'To-do' },
};

function daysRow() {
  const base = new Date();
  const arr: Date[] = [];
  for (let i = -2; i <= 4; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    arr.push(d);
  }
  return arr;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKS  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const fmtIso = (d: Date) => d.toISOString().slice(0, 10);

export const TasksScreen: React.FC<any> = ({ navigation }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await TaskRepository.list({ date: fmtIso(date) });
      setTasks(filter === 'ALL' ? list : list.filter((t:any) => t.status === filter));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [date, filter]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const toggleStatus = async (t: Task) => {
    const next: TaskStatus = t.status === 'DONE' ? 'PENDING' : t.status === 'PENDING' ? 'IN_PROGRESS' : 'DONE';
    const progress = next === 'DONE' ? 100 : next === 'IN_PROGRESS' ? 50 : 0;
    try {
      await TaskRepository.update(t.id, { status: next, progress });
      load();
    } catch (e) { console.log(e); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: AppColors.background }}>
      <TopBar title="Today's Tasks" back />

      {/* Fecha row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
        {daysRow().map((d) => {
          const active = fmtIso(d) === fmtIso(date);
          return (
            <Pressable
              key={fmtIso(d)}
              onPress={() => setDate(d)}
              style={[styles.dateCell, active && { backgroundColor: AppColors.primary }]}
            >
              <Text style={[styles.dateMonth, active && { color: '#FFF' }]}>{MONTHS[d.getMonth()]}</Text>
              <Text style={[styles.dateDay, active && { color: '#FFF' }]}>{d.getDate()}</Text>
              <Text style={[styles.dateWd, active && { color: '#FFF' }]}>{WEEKS[d.getDay()]}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <Pressable key={f.id} onPress={() => setFilter(f.id)} style={[styles.chip, active && { backgroundColor: AppColors.primary }]}>
              <Text style={[styles.chipText, { color: active ? '#FFF' : AppColors.primary }]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Lista */}
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 140 }}>
        {loading ? (
          <ActivityIndicator color={AppColors.primary} style={{ marginTop: 20 }} />
        ) : tasks.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 40 }}>📝</Text>
            <Text style={{ fontWeight: '800', fontSize: 16, marginTop: 6 }}>Sin tareas para este día</Text>
            <Text style={{ color: AppColors.textSecondary, marginTop: 4 }}>Crea una tarea para empezar</Text>
            <Pressable style={styles.newBtn} onPress={() => navigation.navigate('CreateTask', { date: fmtIso(date) })}>
              <Feather name="plus" size={14} color="#FFF" />
              <Text style={{ color: '#FFF', fontWeight: '700' }}>Nueva tarea</Text>
            </Pressable>
          </View>
        ) : (
          tasks.map((t) => {
            const st = STATUS_STYLE[t.status] || STATUS_STYLE.PENDING;
            return (
              <View key={t.id} style={styles.taskCard}>
                <Pressable style={styles.taskIcon} onPress={() => toggleStatus(t)}>
                  <Feather
                    name={t.status === 'DONE' ? 'check-circle' : 'circle'}
                    size={22}
                    color={AppColors.primary}
                  />
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskCat}>{t.project_name || 'Personal'}</Text>
                  <Text style={[styles.taskTitle, t.status === 'DONE' && styles.taskDone]} numberOfLines={2}>
                    {t.title}
                  </Text>
                  {t.due_time ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                      <Feather name="clock" size={12} color={AppColors.textSecondary} />
                      <Text style={{ color: AppColors.textSecondary, fontSize: 11 }}>{t.due_time}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                  <Text style={{ color: st.fg, fontSize: 11, fontWeight: '800' }}>{st.label}</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <BottomNav onAdd={() => navigation.navigate('CreateTask', { date: fmtIso(date) })} />
    </View>
  );
};

const styles = StyleSheet.create({
  dateRow: { paddingHorizontal: 20, paddingVertical: 8, gap: 10 },
  dateCell: {
    width: 64, paddingVertical: 10, paddingHorizontal: 6, borderRadius: 18,
    alignItems: 'center', backgroundColor: '#FFF',
    shadowColor: AppColors.primary, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
  },
  dateMonth: { fontSize: 10, color: AppColors.textSecondary, fontWeight: '700', textTransform: 'uppercase' },
  dateDay: { fontSize: 22, fontWeight: '800', color: AppColors.text },
  dateWd: { fontSize: 10, color: AppColors.textSecondary },

  filterRow: { paddingHorizontal: 20, paddingVertical: 10, gap: 10 },
  chip: { backgroundColor: AppColors.primaryLight, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999 },
  chipText: { fontWeight: '700', fontSize: 13 },

  empty: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, alignItems: 'center', marginTop: 20 },
  newBtn: { marginTop: 14, backgroundColor: AppColors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, flexDirection: 'row', gap: 6, alignItems: 'center' },

  taskCard: {
    backgroundColor: '#FFF', borderRadius: 22, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: AppColors.primary, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  taskIcon: {
    width: 44, height: 44, borderRadius: 16, backgroundColor: AppColors.lavender,
    alignItems: 'center', justifyContent: 'center',
  },
  taskCat: { fontSize: 11, color: AppColors.textSecondary, marginBottom: 2 },
  taskTitle: { fontWeight: '800', color: AppColors.text, fontSize: 15 },
  taskDone: { textDecorationLine: 'line-through', opacity: 0.6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
});