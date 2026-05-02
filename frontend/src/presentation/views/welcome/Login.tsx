import React, { useState } from 'react';
import { View, Text, Image, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';
import { AppColors } from '../../theme/AppTheme';

const HERO = require('../../../../assets/hero.jpg');

export const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔍 validaciones
  const validate = () => {
    if (!email || !password) {
      Alert.alert('Faltan datos', 'Email y contraseña son requeridos');
      return false;
    }

    // validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Email inválido', 'Ingresa un correo válido');
      return false;
    }

    // validar password
    if (password.length < 6) {
      Alert.alert('Contraseña inválida', 'Debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await ApiDelivery.post('auth/login', { email, password });

      const token = data?.data?.token;
      const user = data?.data?.user;

      await AsyncStorage.setItem('takio_token', token);
      await AsyncStorage.setItem('takio_user', JSON.stringify(user));

      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    } catch (err) {
      Alert.alert('Error', 'Credenciales incorrectas o problema de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: AppColors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        
     
          <Image source={HERO} style={styles.hero} />
          <View style={styles.logoFloat}>
                      <Image
                      source={require ('../../../../assets/Takio-Logo2.png')}
                      style={{ width: 400, height: 50, marginBottom: 24 }}
                      resizeMode="contain"
                    />
          </View>
  

        <View style={styles.sheet}>
          <Text style={styles.title}>Ingresar</Text>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Feather name="mail" size={18} color={AppColors.textMuted} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Ingresa tu email"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={AppColors.textMuted}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color={AppColors.textMuted} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Ingresa tu contraseña"
              secureTextEntry
              style={styles.input}
              placeholderTextColor={AppColors.textMuted}
            />
          </View>

          <Pressable
            style={[styles.cta, loading && { opacity: 0.6 }]}
            onPress={submit}
            disabled={loading}
          >
            <Text style={styles.ctaText}>
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.helper}>
              ¿No tienes cuenta?{' '}
              <Text style={{ color: AppColors.primary, fontWeight: '700' }}>
                Regístrate
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  hero: { width: '100%', height: '80%' },

  logoFloat: {
    position: 'absolute',
    top: 250,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },

  sheet: {
    width: '100%',
    height: '50%',
    backgroundColor: '#F5F5F6',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  title: { fontFamily: 'LexendDeca-Bold', fontSize: 28, color: AppColors.text, marginBottom: 12 },

  label: { fontFamily: 'LexendDeca', fontSize: 16, color: AppColors.textSecondary, marginTop: 10, marginBottom: 10, fontWeight: '600' },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#CAB8FF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 4,
  },

  input: { fontFamily: 'LexendDeca', flex: 1, fontSize: 15, color: AppColors.text, paddingVertical: 10 },

  cta: {
    marginTop: 20,
    backgroundColor: AppColors.primary,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: AppColors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },

  ctaText: { color: '#FFF', fontFamily: 'LexendDeca-SemiBold', fontSize: 17 },

  helper: { textAlign: 'center', fontFamily: 'LexendDeca', color: AppColors.textSecondary, marginTop: 14 },
});