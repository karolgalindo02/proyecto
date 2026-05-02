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
      <View style={styles.center}>
        <Image
          source={require ('../../../../assets/Welcome.png')}
          style={{ width: 500, height: 300, marginBottom: 24 }}
          resizeMode="contain"
        />
          <Image
          source={require ('../../../../assets/Takio-Logo.png')}
          style={{ width: 400, height: 50, marginBottom: 24 }}
          resizeMode="contain"
        />

        <Text style={styles.title}>Gestión de Tareas &{'      '}To-Do List</Text>
        <Text style={styles.subtitle}>
          Herramienta de productividad {'                                      '}para gestionar mejor tus tareas{'                                      '} por proyectos de forma cómoda.
        </Text>
      </View>

      <View style={styles.bottom}>
        <Pressable style={styles.cta} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.ctaText}>Empezar</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupText}>
            ¿No tienes cuenta? <Text style={{ fontFamily: 'LexendDeca', color: AppColors.primary}}>Regístrate</Text>
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
  logoText: { fontSize: 24, marginLeft: 10, color: AppColors.text },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  illustration: { width: 220, height: 220, marginBottom: 24 },
  title: { fontFamily: 'LexendDeca-Bold',fontSize: 28, textAlign: 'center', color: AppColors.text, lineHeight: 36 },
  subtitle: { fontFamily: 'LexendDeca',textAlign: 'center', color: AppColors.textSecondary, marginTop: 20, lineHeight: 22, paddingHorizontal: 20 },
  bottom: { gap: 16 },
  cta: {
    backgroundColor: AppColors.primary, borderRadius: 999, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: AppColors.primary, shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  ctaText: { fontFamily: 'LexendDeca-SemiBold',color: '#FFF', fontSize: 18 },
  signupText: { fontFamily: 'LexendDeca', textAlign: 'center', color: AppColors.textSecondary },
});