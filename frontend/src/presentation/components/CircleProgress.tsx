import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { AppColors } from '../theme/AppTheme';

interface Props {
  value?: number; // 0..100
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  textColor?: string;
}

export const CircleProgress: React.FC<Props> = ({
  value = 0,
  size = 56,
  stroke = 6,
  color = AppColors.primary,
  trackColor = '#F1EEFF',
  label,
  textColor = AppColors.text,
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const dashoffset = circumference - (clamped / 100) * circumference;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={dashoffset}
          fill="none"
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.label, { color: textColor, fontSize: size * 0.22 }]}>
          {label ?? `${Math.round(clamped)}%`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  label: { fontWeight: '800' },
});