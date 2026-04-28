import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppColors } from '../theme/AppTheme';

export const BottomNav: React.FC<{ onAdd?: () => void }> = ({ onAdd }) => {
  const nav = useNavigation<any>();
  const route = useRoute();

  const items: Array<{ name: string; icon: keyof typeof Feather.glyphMap; route: string }> = [
    { name: 'Home',    icon: 'home',     route: 'Dashboard' },
    { name: 'Tasks',   icon: 'calendar', route: 'Tasks' },
    { name: 'Bot',     icon: 'cpu',      route: 'Chatbot' },
    { name: 'Profile', icon: 'user',     route: 'Profile' },
  ];

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={styles.bar}>
        {items.slice(0, 2).map((it) => (
          <Pressable key={it.route} style={styles.tab} onPress={() => nav.navigate(it.route)}>
            <Feather name={it.icon} size={22} color={route.name === it.route ? AppColors.primary : AppColors.textMuted} />
          </Pressable>
        ))}
        <View style={{ width: 70 }} />
        {items.slice(2).map((it) => (
          <Pressable key={it.route} style={styles.tab} onPress={() => nav.navigate(it.route)}>
            <Feather name={it.icon} size={22} color={route.name === it.route ? AppColors.primary : AppColors.textMuted} />
          </Pressable>
        ))}
      </View>
      <Pressable
        style={styles.fab}
        onPress={() => (onAdd ? onAdd() : nav.navigate('CreateTask'))}
      >
        <Feather name="plus" size={28} color="#FFF" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  bar: {
    width: '92%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 10,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 12,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    top: -10,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
});