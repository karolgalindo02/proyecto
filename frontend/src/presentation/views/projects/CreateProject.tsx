import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TopBar } from '../../components/TopBar';
import { AppColors, colorToBg } from '../../theme/AppTheme';
import { ProjectRepository } from '../../../data/repositories/ProjectRepository';
import { formatApiError } from '../../../data/sources/remote/api/ApiDelivery';
import  { BackgroundBlobs } from '../../components/BackgroundBlobs';

const COLORS: Array<{ id: string; label: string }> = [
  { id: 'lavender', label: 'Work' },
  { id: 'pink', label: 'Personal' },
  { id: 'peach', label: 'Study' },
  { id: 'yellow', label: 'Daily' },
  { id: 'green', label: 'Health' },
  { id: 'blue', label: 'Client' },
];

export const CreateProjectScreen: React.FC<any> = ({ navigation }) => {
  const [form, setForm] = useState({ name: '', description: '', color: 'lavender' });
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 3600 * 1000));
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [loading, setLoading] = useState(false);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const pretty = (d: Date) => d.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });

  const submit = async () => {
    if (!form.name.trim()) return Alert.alert('Falta el nombre del proyecto');
    setLoading(true);
    try {
      const project = await ProjectRepository.create({
        name: form.name.trim(),
        description: form.description,
        color: form.color,
        start_date: fmt(startDate),
        end_date: fmt(endDate),
      });
      Alert.alert(
        '🎉 Proyecto creado',
        `Código de invitación: ${project.invite_code}
Compártelo para que otros se unan.`,
        [{ text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] }) }]
      );
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const cur = colorToBg[form.color] || colorToBg.lavender;

  return (
           <View style={{ flex: 1 }}>
             <BackgroundBlobs />
      <TopBar back title="Add Project" />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }}>
        {/* Task Group (categoría/color) */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={[styles.iconBox, { backgroundColor: cur.bg }]}>
              <Feather name="briefcase" size={18} color={cur.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Task Group</Text>
              <Text style={styles.value}>{COLORS.find((c) => c.id === form.color)?.label}</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }} contentContainerStyle={{ gap: 8 }}>
            {COLORS.map((c) => {
              const active = form.color === c.id;
              const cb = colorToBg[c.id];
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setForm({ ...form, color: c.id })}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
                    backgroundColor: cb.bg,
                    borderWidth: active ? 2 : 0, borderColor: cb.text,
                  }}
                >
                  <Text style={{ color: cb.text, fontFamily: 'LexendDeca-SemiBold', fontSize: 12 }}>{c.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Nombre */}
        <View style={styles.card}>
          <Text style={styles.label}>Project Name</Text>
          <TextInput
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
            placeholder="Grocery Shopping App"
            placeholderTextColor={AppColors.textMuted}
            style={styles.titleInput}
          />
        </View>

        {/* Descripción */}
        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={form.description}
            onChangeText={(v) => setForm({ ...form, description: v })}
            placeholder="Describe brevemente el alcance del proyecto..."
            placeholderTextColor={AppColors.textMuted}
            multiline
            style={styles.textArea}
          />
        </View>

        {/* Fechas */}
        <Pressable style={styles.card} onPress={() => setShowStart(true)}>
          <Text style={styles.label}>Start Date</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.value}>{pretty(startDate)}</Text>
            <Feather name="calendar" size={18} color={AppColors.primary} />
          </View>
        </Pressable>
        <Pressable style={styles.card} onPress={() => setShowEnd(true)}>
          <Text style={styles.label}>End Date</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.value}>{pretty(endDate)}</Text>
            <Feather name="calendar" size={18} color={AppColors.primary} />
          </View>
        </Pressable>

        {showStart && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={(_e, d) => { setShowStart(false); if (d) setStartDate(d); }}
          />
        )}
        {showEnd && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={(_e, d) => { setShowEnd(false); if (d) setEndDate(d); }}
          />
        )}

        <Pressable style={[styles.submit, loading && { opacity: 0.6 }]} onPress={submit} disabled={loading}>
          <Text style={styles.submitText}>{loading ? 'Creando...' : 'Add Project'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF', borderRadius: 22, padding: 16,
    shadowColor: AppColors.primary, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  iconBox: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, color: AppColors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'LexendDeca-SemiBold' },
  titleInput: { fontSize: 18, fontFamily: 'LexendDeca-SemiBold', color: AppColors.text, paddingVertical: 4 },
  textArea: { fontFamily: 'LexendDeca',fontSize: 14, color: AppColors.text, minHeight: 80, paddingVertical: 6, textAlignVertical: 'top' },
  value: { fontFamily: 'LexendDeca-SemiBold', color: AppColors.text, fontSize: 15, marginTop: 4 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  submit: {
    backgroundColor: AppColors.primary, paddingVertical: 18, borderRadius: 999, alignItems: 'center', marginTop: 10,
    shadowColor: AppColors.primary, shadowOpacity: 0.3, shadowRadius: 14,
  },
  submitText: { color: '#FFF', fontSize: 17, fontFamily: 'LexendDeca-SemiBold' },
});