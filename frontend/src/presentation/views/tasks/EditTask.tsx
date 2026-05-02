import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';

import { TopBar } from '../../components/TopBar';
import { AppColors } from '../../theme/AppTheme';
import { TaskRepository } from '../../../data/repositories/TaskRepository';
import { BackgroundBlobs } from '../../components/BackgroundBlobs';

export const EditTaskScreen: React.FC<any> = ({ navigation, route }) => {
  const { task, project } = route.params;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority || 'MEDIUM');
  const [progress, setProgress] = useState(task.progress || 0);

  const [dueDate, setDueDate] = useState(
    task.due_date ? new Date(task.due_date) : new Date()
  );
  const [dueTime, setDueTime] = useState(new Date());

  const [showCal, setShowCal] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const [assignedTo, setAssignedTo] = useState(task.assigned_to || null);

  const fmtDate = (d: Date) => d.toISOString().slice(0, 10);
  const fmtTime = (d: Date) => d.toTimeString().slice(0, 5);

  const submit = async () => {
    try {
      await TaskRepository.update(task.id, {
        title,
        description,
        priority,
        progress,
        due_date: fmtDate(dueDate),
        due_time: fmtTime(dueTime),
        assigned_to: assignedTo,
      });

      navigation.goBack();
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <BackgroundBlobs />

      <TopBar back title="Editar Tarea" />

      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }}>

        {/* Título */}
        <View style={styles.card}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
          />
        </View>

        {/* Descripción */}
        <View style={styles.card}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.textArea}
          />
        </View>

        {/* Fecha + Hora */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable style={[styles.card, { flex: 1 }]} onPress={() => setShowCal(true)}>
            <Text style={styles.label}>
              <Feather name="calendar" size={12}/> Fecha
            </Text>
            <Text style={styles.value}>{fmtDate(dueDate)}</Text>
          </Pressable>

          <Pressable style={[styles.card, { flex: 1 }]} onPress={() => setShowTime(true)}>
            <Text style={styles.label}>
              <Feather name="clock" size={12}/> Hora
            </Text>
            <Text style={styles.value}>{fmtTime(dueTime)}</Text>
          </Pressable>
        </View>

        {showCal && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={(_, d) => {
              setShowCal(false);
              if (d) setDueDate(d);
            }}
          />
        )}

        {showTime && (
          <DateTimePicker
            value={dueTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
            onChange={(_, d) => {
              setShowTime(false);
              if (d) setDueTime(d);
            }}
          />
        )}

        {/* Progreso */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.label}>Progreso</Text>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>

          <Slider
            minimumValue={0}
            maximumValue={100}
            step={5}
            value={progress}
            minimumTrackTintColor={AppColors.primary}
            maximumTrackTintColor={AppColors.primaryLight}
            thumbTintColor={AppColors.primary}
            onValueChange={(v) => setProgress(Math.round(v))}
          />
        </View>

        {/* Prioridad */}
        <View style={styles.card}>
          <Text style={styles.label}>Prioridad</Text>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            {(['LOW','MEDIUM','HIGH'] as const).map((p) => {
              const active = priority === p;
              const color =
                p === 'HIGH'
                  ? AppColors.pinkText
                  : p === 'MEDIUM'
                  ? AppColors.primary
                  : AppColors.greenText;

              const bg =
                p === 'HIGH'
                  ? AppColors.pink
                  : p === 'MEDIUM'
                  ? AppColors.primaryLight
                  : AppColors.green;

              return (
                <Pressable
                  key={p}
                  onPress={() => setPriority(p)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 14,
                    alignItems: 'center',
                    backgroundColor: active ? color : bg,
                  }}
                >
                  <Text style={{ color: active ? '#FFF' : color }}>
                    {p}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Asignar */}
        {project.role === 'ADMIN' && (
          <View style={styles.card}>
            <Text style={styles.label}>Asignar a</Text>

            {project.members.map((m: any) => (
              <Pressable
                key={m.id}
                onPress={() => setAssignedTo(m.id)}
                style={[
                  styles.memberBtn,
                  assignedTo === m.id && {
                    backgroundColor: AppColors.primaryLight,
                  },
                ]}
              >
                <Text style={{ fontFamily: 'LexendDeca-SemiBold' }}>
                  {m.name} {m.lastname}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Guardar */}
        <Pressable style={styles.submit} onPress={submit}>
          <Text style={styles.submitText}>Guardar cambios</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 16,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  label: {
    fontSize: 11,
    color: AppColors.textSecondary,
    textTransform: 'uppercase',
    fontFamily: 'LexendDeca',
  },

  titleInput: {
    fontSize: 17,
    fontFamily: 'LexendDeca-SemiBold',
    color: AppColors.text,
  },

  textArea: {
    fontFamily: 'LexendDeca',
    minHeight: 60,
  },

  value: {
    fontFamily: 'LexendDeca-SemiBold',
    color: AppColors.text,
    marginTop: 6,
  },

  progressText: {
    color: AppColors.primary,
    fontFamily: 'LexendDeca-SemiBold',
    fontSize: 18,
  },

  memberBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginTop: 6,
  },

  submit: {
    backgroundColor: AppColors.primary,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },

  submitText: {
    color: '#FFF',
    fontFamily: 'LexendDeca-SemiBold',
    fontSize: 16,
  },
});