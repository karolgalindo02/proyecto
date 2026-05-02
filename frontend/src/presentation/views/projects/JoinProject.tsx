import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TopBar } from '../../components/TopBar';
import { AppColors } from '../../theme/AppTheme';
import { ProjectRepository } from '../../../data/repositories/ProjectRepository';
import { formatApiError } from '../../../data/sources/remote/api/ApiDelivery';

export const JoinProjectScreen: React.FC<any> = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const clean = code.toUpperCase().trim();
    if (clean.length < 4) return Alert.alert('Código inválido', 'Escribe el código completo');
    setLoading(true);
    try {
      const project = await ProjectRepository.joinByCode(clean);
      Alert.alert(
        '✅ ¡Te uniste!',
        `Proyecto: ${project.name}
Rol: ${project.role}`,
        [{ text: 'Ir al proyecto', onPress: () => navigation.replace('ProjectDetail', { id: project.id }) }]
      );
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: AppColors.background }}>
      <TopBar back title="Unirme a proyecto" />
      <View style={{ padding: 24, gap: 20 }}>
        <View style={[styles.card, { alignItems: 'center', paddingVertical: 28 }]}>
          <View style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: AppColors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Feather name="key" size={36} color={AppColors.primary} />
          </View>
          <Text style={{ fontFamily: 'LexendDeca-Bold', fontSize: 20, color: AppColors.text }}>Ingresa el código</Text>
          <Text style={{ fontFamily: 'LexendDeca', color: AppColors.textSecondary, marginTop: 6, textAlign: 'center' }}>
            Pídele al admin el código de 6 caracteres de su proyecto
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Código del proyecto</Text>
          <TextInput
            value={code}
            onChangeText={(v) => setCode(v.toUpperCase())}
            placeholder="Ej: AB3K9P"
            placeholderTextColor={AppColors.textMuted}
            autoCapitalize="characters"
            maxLength={10}
            style={styles.codeInput}
          />
        </View>

        <Pressable style={[styles.submit, loading && { opacity: 0.6 }]} onPress={submit} disabled={loading}>
          <Text style={styles.submitText}>{loading ? 'Uniendo...' : 'Unirme al Proyecto'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF', borderRadius: 22, padding: 20,
    shadowColor: AppColors.primary, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  label: { fontFamily: 'LexendDeca-SemiBold', fontSize: 11, color: AppColors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  codeInput: {
    fontSize: 32, fontWeight: '800', color: AppColors.text,
    textAlign: 'center', letterSpacing: 8, marginTop: 14, paddingVertical: 6,
  },
  submit: {
    backgroundColor: AppColors.primary, paddingVertical: 18, borderRadius: 999, alignItems: 'center',
    shadowColor: AppColors.primary, shadowOpacity: 0.3, shadowRadius: 14,
  },
  submitText: { color: '#FFF', fontSize: 17, fontFamily: 'LexendDeca-SemiBold' },
});