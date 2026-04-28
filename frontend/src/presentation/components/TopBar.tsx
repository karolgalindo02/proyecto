import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppColors } from '../theme/AppTheme';

interface Props {
  title?: string;
  back?: boolean;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightPress?: () => void;
}

export const TopBar: React.FC<Props> = ({ title = '', back = false, rightIcon = 'bell', onRightPress }) => {
  const nav = useNavigation<any>();
  return (
    <View style={styles.row}>
      {back ? (
        <Pressable onPress={() => nav.goBack()} style={styles.iconBtn}>
          <Feather name="arrow-left" size={20} color={AppColors.text} />
        </Pressable>
      ) : (
        <View style={styles.iconBtn} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={onRightPress} style={styles.iconBtn}>
        <Feather name={rightIcon} size={18} color={AppColors.text} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: '700', color: AppColors.text },
});