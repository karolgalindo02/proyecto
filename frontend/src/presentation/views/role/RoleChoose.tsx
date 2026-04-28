import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppColors } from '../../theme/AppTheme';
import { TopBar } from '../../components/TopBar';

export const RoleChooseScreen: React.FC<any> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: AppColors.background }}>
      <TopBar back title="¡Bienvenido!" />
      <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
        <Text style={styles.title}>¿Qué quieres hacer hoy?</Text>
        <Text style={styles.subtitle}>
          Elige cómo quieres usar Takio. Puedes cambiar de rol en cualquier proyecto.
        </Text>

        <Pressable style={styles.card} onPress={() => navigation.navigate('CreateProject')}>
          <View style={[styles.iconBox, { backgroundColor: AppColors.primaryLight }]}>
            <Feather name="award" size={24} color={AppColors.primary} />
          </View>
          <Text style={styles.cardTitle}>Crear un proyecto</Text>
          <Text style={styles.cardDesc}>Sé admin, genera un código único e invita colaboradores para gestionar tareas juntos.</Text>
        </Pressable>

        <Pressable style={styles.card} onPress={() => navigation.navigate('JoinProject')}>
          <View style={[styles.iconBox, { backgroundColor: AppColors.pink }]}>
            <Feather name="user-plus" size={24} color={AppColors.pinkText} />
          </View>
          <Text style={styles.cardTitle}>Unirme con un código</Text>
          <Text style={styles.cardDesc}>Ingresa el código que te compartió un admin para colaborar en su proyecto.</Text>
        </Pressable>

        <Pressable onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] })}>
          <Text style={{ textAlign: 'center', color: AppColors.primary, fontWeight: '700', marginTop: 12 }}>
            Explorar sin proyecto →
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', color: AppColors.text },
  subtitle: { color: AppColors.textSecondary, marginBottom: 10 },
  card: {
    backgroundColor: AppColors.white, borderRadius: 24, padding: 22,
    shadowColor: AppColors.primary, shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  iconBox: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: '800', color: AppColors.text },
  cardDesc: { color: AppColors.textSecondary, marginTop: 4, lineHeight: 20 },
});