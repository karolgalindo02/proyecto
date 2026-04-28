import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppColors } from '../theme/AppTheme';

interface Props {
  value?: number; // 0..100
  color?: string;
  bg?: string;
  height?: number;
}

export const LinearProgress: React.FC<Props> = ({
  value = 0,
  color = AppColors.primary,
  bg = '#F1EEFF',
  height = 8,
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.track, { backgroundColor: bg, height, borderRadius: height }]}>
      <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: color, borderRadius: height }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
});