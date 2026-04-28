import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export const BackgroundBlobs = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">

      {/* Blobs */}
      <LinearGradient
        colors={['rgba(80,255,180,0.6)', 'transparent']}
        style={[styles.blob, styles.green]}
      />

      <LinearGradient
        colors={['rgba(255,230,80,0.6)', 'transparent']}
        style={[styles.blob, styles.yellow]}
      />

      <LinearGradient
        colors={['rgba(80,120,255,0.6)', 'transparent']}
        style={[styles.blob, styles.blue]}
      />

      <LinearGradient
        colors={['rgba(120,220,255,0.6)', 'transparent']}
        style={[styles.blob, styles.cyan]}
      />

      <LinearGradient
        colors={['rgba(255,180,80,0.6)', 'transparent']}
        style={[styles.blob, styles.orange]}
      />

      {/* 🔥 Blur encima de TODO */}
      <BlurView
        intensity={90} // puedes probar entre 70–100
        tint="light"
        style={StyleSheet.absoluteFill}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 140,
  },

  green: {
    top: 80,
    left: -80,
  },

  yellow: {
    top: -60,
    right: -60,
  },

  blue: {
    top: 200,
    right: -80,
  },

  cyan: {
    bottom: 140,
    left: -60,
  },

  orange: {
    bottom: -80,
    right: 40,
  },
});