import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useProfileViewModel } from './ProfileViewModel';
import { TopBar } from '../../components/TopBar';
import { BottomNav } from '../../components/BottomNav';
import { AppColors } from '../../theme/AppTheme';

export const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const vm = useProfileViewModel();

  useFocusEffect(React.useCallback(() => { vm.refreshFromStorage(); }, [vm.refreshFromStorage]));

  const initial = vm.user?.name?.[0]?.toUpperCase() || 'U';

  const onLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar', style: 'destructive', onPress: async () => {
          await vm.logout();
          navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        } },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: AppColors.background }}>
      <TopBar back title="Perfil" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140, gap: 12 }}>
        <View style={[styles.card, { alignItems: 'center', paddingVertical: 30 }]}>
          <Pressable onPress={vm.showAvatarOptions} style={styles.avatarWrap}>
            {vm.avatarUrl ? (
              <Image source={{ uri: vm.avatarUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarLetter}>{initial}</Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              {vm.uploading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Feather name="camera" size={16} color="#FFF" />
              )}
            </View>
          </Pressable>
          <Text style={styles.name}>{vm.user?.name} {vm.user?.lastname}</Text>
          <Text style={styles.email}>{vm.user?.email}</Text>
          {!!vm.user?.phone && <Text style={styles.phone}>📱 {vm.user.phone}</Text>}
          <Text style={styles.hint}>Toca tu foto para cambiarla</Text>
        </View>

        <Pressable style={styles.row} onPress={() => navigation.navigate('Notifications')}>
          <Feather name="bell" size={22} color={AppColors.primary} />
          <Text style={styles.rowLabel}>Notificaciones</Text>
          <Feather name="chevron-right" size={18} color={AppColors.textMuted} />
        </Pressable>
        <Pressable style={styles.row} onPress={() => navigation.navigate('CreateProject')}>
          <Feather name="plus-circle" size={22} color={AppColors.primary} />
          <Text style={styles.rowLabel}>Crear nuevo proyecto</Text>
          <Feather name="chevron-right" size={18} color={AppColors.textMuted} />
        </Pressable>
        <Pressable style={styles.row} onPress={() => navigation.navigate('JoinProject')}>
          <Feather name="user-plus" size={22} color={AppColors.primary} />
          <Text style={styles.rowLabel}>Unirme con código</Text>
          <Feather name="chevron-right" size={18} color={AppColors.textMuted} />
        </Pressable>
        <Pressable style={styles.row} onPress={() => navigation.navigate('Chatbot')}>
          <Feather name="cpu" size={22} color={AppColors.primary} />
          <Text style={styles.rowLabel}>Asistente IA Takio</Text>
          <Feather name="chevron-right" size={18} color={AppColors.textMuted} />
        </Pressable>

        <Pressable style={[styles.row, { marginTop: 10 }]} onPress={onLogout}>
          <Feather name="log-out" size={22} color={AppColors.pinkText} />
          <Text style={[styles.rowLabel, { color: AppColors.pinkText }]}>Cerrar sesión</Text>
          <View />
        </Pressable>
      </ScrollView>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 18,
    shadowColor: AppColors.primary, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  avatarWrap: {
    width: 100, height: 100, borderRadius: 50, position: 'relative',
    shadowColor: AppColors.primary, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4,
  },
  avatarImg: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#FFF' },
  avatarFallback: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: AppColors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: { color: '#FFF', fontSize: 38, fontWeight: '800' },
  cameraBadge: {
    position: 'absolute', right: -2, bottom: -2,
    width: 32, height: 32, borderRadius: 16, backgroundColor: AppColors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#FFF',
  },
  name: { fontSize: 20, fontWeight: '800', color: AppColors.text, marginTop: 16 },
  email: { color: AppColors.textSecondary, marginTop: 4 },
  phone: { color: AppColors.textSecondary, marginTop: 2 },
  hint: { color: AppColors.textMuted, fontSize: 11, marginTop: 8 },
  row: {
    backgroundColor: '#FFF', borderRadius: 18, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: AppColors.primary, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  rowLabel: { flex: 1, fontWeight: '700', color: AppColors.text },
});
