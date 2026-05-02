import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Platform, Alert, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { TopBar } from '../../components/TopBar';
import { AppColors } from '../../theme/AppTheme';
import { TaskRepository } from '../../../data/repositories/TaskRepository';
import { ProjectRepository } from '../../../data/repositories/ProjectRepository';
import { Project } from '../../../domain/entities/Project';
import { formatApiError } from '../../../data/sources/remote/api/ApiDelivery';
import { BackgroundBlobs } from '../../components/BackgroundBlobs';

export const CreateTaskScreen: React.FC<any> = ({ navigation, route }) => {
  const initialDate = route.params?.date ? new Date(route.params.date) : new Date();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [dueDate, setDueDate] = useState<Date>(initialDate);
  const [showCal, setShowCal] = useState(false);
  const [dueTime, setDueTime] = useState<Date>(new Date());
  const [showTime, setShowTime] = useState(false);
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProjectPicker, setShowProjectPicker] = useState(false);

  // Si está como MEMBER en todos los proyectos visibles, ocultamos assigned_to (no relevante para MEMBER)
  const canAssign = projects.some((p) => p.role === 'ADMIN');

  useEffect(() => {
    ProjectRepository.list().then(setProjects).catch(() => {});
  }, []);

  const fmtDate = (d: Date) => d.toISOString().slice(0, 10);
  const fmtTime = (d: Date) => d.toTimeString().slice(0, 5);

  const submit = async () => {
    if (!title.trim()) return Alert.alert('Falta el título');
    setLoading(true);
    try {
      await TaskRepository.create({
        title: title.trim(),
        description,
        project_id: projectId as any,
        progress,
        priority,
        due_date: fmtDate(dueDate),
        due_time: fmtTime(dueTime),
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const selectedProject = projects.find((p) => p.id === projectId);

  return (
        <View style={{ flex: 1 }}>
          <BackgroundBlobs />
      <TopBar back title="Nueva Tarea" />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }}>
        {/* Título */}
        <View style={styles.card}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ej: Diseñar wireframe"
            placeholderTextColor={AppColors.textMuted}
            style={styles.titleInput}
          />
        </View>

        {/* Descripción */}
        <View style={styles.card}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe tu tarea..."
            placeholderTextColor={AppColors.textMuted}
            multiline
            style={styles.textArea}
          />
        </View>

        {/* Fecha + Hora */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable style={[styles.card, { flex: 1 }]} onPress={() => setShowCal(true)}>
            <Text style={styles.label}><Feather name="calendar" size={12}/> Fecha</Text>
            <Text style={styles.value}>{fmtDate(dueDate)}</Text>
          </Pressable>
          <Pressable style={[styles.card, { flex: 1 }]} onPress={() => setShowTime(true)}>
            <Text style={styles.label}><Feather name="clock" size={12}/> Hora</Text>
            <Text style={styles.value}>{fmtTime(dueTime)}</Text>
          </Pressable>
        </View>

        {showCal && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={(_e, d) => { setShowCal(false); if (d) setDueDate(d); }}
          />
        )}
        {showTime && (
          <DateTimePicker
            value={dueTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
            onChange={(_e, d) => { setShowTime(false); if (d) setDueTime(d); }}
          />
        )}

        {/* Progreso (slider) */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.label}>Progreso</Text>
            <Text style={{ color: AppColors.primary, fontFamily: 'LexendDeca-SemiBold', fontSize: 18 }}>{progress}%</Text>
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.microLabel}>To do</Text>
            <Text style={styles.microLabel}>In progress</Text>
            <Text style={styles.microLabel}>Done</Text>
          </View>
        </View>

        {/* Prioridad */}
        <View style={styles.card}>
          <Text style={styles.label}>Prioridad</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            {(['LOW','MEDIUM','HIGH'] as const).map((p) => {
              const active = priority === p;
              const color = p === 'HIGH' ? AppColors.pinkText : p === 'MEDIUM' ? AppColors.primary : AppColors.greenText;
              const bg    = p === 'HIGH' ? AppColors.pink     : p === 'MEDIUM' ? AppColors.primaryLight : AppColors.green;
              return (
                <Pressable
                  key={p}
                  onPress={() => setPriority(p)}
                  style={{
                    flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: 'center',
                    backgroundColor: active ? color : bg,
                  }}
                >
                  <Text style={{ color: active ? '#FFF' : color, fontFamily: 'LexendDeca-SemiBold' }}>{p}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable style={[styles.submit, loading && { opacity: 0.6 }]} onPress={submit} disabled={loading}>
          <Text style={styles.submitText}>{loading ? 'Creando...' : 'Crear Tarea'}</Text>
        </Pressable>
      </ScrollView>

      {/* Modal picker de proyecto */}
      <Modal visible={showProjectPicker} transparent animationType="slide" onRequestClose={() => setShowProjectPicker(false)}>
        <Pressable style={styles.modalBg} onPress={() => setShowProjectPicker(false)}>
          <View style={styles.modalSheet}>
            <Text style={[styles.label, { textAlign: 'center', marginBottom: 8 }]}>Selecciona un proyecto</Text>
            <Picker selectedValue={projectId ?? ''} onValueChange={(v) => { setProjectId(v === '' ? null : Number(v)); setShowProjectPicker(false); }}>
              <Picker.Item label="— Personal (sin proyecto) —" value="" />
              {projects.map((p) => (
                <Picker.Item key={p.id} label={`${p.name} (${p.role})`} value={p.id} />
              ))}
            </Picker>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF', borderRadius: 22, padding: 16,
    shadowColor: AppColors.primary, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  label: { fontSize: 11, color: AppColors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'LexendDeca' },
  titleInput: { fontSize: 17, fontFamily: 'LexendDeca-SemiBold', color: AppColors.text, paddingVertical: 6 },
  textArea: { fontFamily: 'LexendDeca',fontSize: 14, color: AppColors.text, minHeight: 60, paddingVertical: 6, textAlignVertical: 'top' },
  value: { fontFamily: 'LexendDeca-SemiBold', color: AppColors.text, fontSize: 14, marginTop: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  microLabel: { fontFamily: 'LexendDeca',color: AppColors.textMuted, fontSize: 10 },
  submit: {
    backgroundColor: AppColors.primary, paddingVertical: 16, borderRadius: 999, alignItems: 'center', marginTop: 10,
    shadowColor: AppColors.primary, shadowOpacity: 0.3, shadowRadius: 14,
  },
  submitText: { color: '#FFF', fontSize: 16, fontFamily: 'LexendDeca-SemiBold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 16, paddingBottom: 30 },
});