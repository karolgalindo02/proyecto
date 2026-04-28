import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { BackgroundBlobs } from '../../components/BackgroundBlobs';
import { AppColors } from '../../theme/AppTheme';

export const WelcomeScreen: React.FC<any> = ({ navigation }) => {
  return (
    <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.container}>
  
  <BackgroundBlobs />
      <View style={styles.topRow}>
        <View style={styles.logoBadge}>
          <Feather name="bell" size={16} color="#FFF" />
        </View>
        <Text style={styles.logoText}>Takio</Text>
      </View>

      <View style={styles.center}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3529/3529829.png' }}
          style={styles.illustration}
          resizeMode="contain"
        />
        <Text style={styles.title}>Gestión de Tareas &{''}To-Do List</Text>
        <Text style={styles.subtitle}>
          Herramienta de productividad para gestionar mejor tus tareas por proyectos de forma cómoda.
        </Text>
      </View>

      <View style={styles.bottom}>
        <Pressable style={styles.cta} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.ctaText}>Empezar</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupText}>
            ¿No tienes cuenta? <Text style={{ color: AppColors.primary, fontWeight: '700' }}>Regístrate</Text>
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBadge: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: AppColors.primary,
  },
  logoText: { fontSize: 24, fontWeight: '800', marginLeft: 10, color: AppColors.text },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  illustration: { width: 220, height: 220, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', color: AppColors.text, lineHeight: 36 },
  subtitle: { textAlign: 'center', color: AppColors.textSecondary, marginTop: 14, lineHeight: 22, paddingHorizontal: 20 },
  bottom: { gap: 16 },
  cta: {
    backgroundColor: AppColors.primary, borderRadius: 999, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: AppColors.primary, shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  ctaText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  signupText: { textAlign: 'center', color: AppColors.textSecondary },
});