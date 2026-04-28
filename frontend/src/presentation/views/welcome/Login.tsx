import React, { useState } from 'react';
import { View, Text, Image, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';
import { AppColors } from '../../theme/AppTheme';

const HERO = 'https://images.pexels.com/photos/7674843/pexels-photo-7674843.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';

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
        
        <View style={styles.heroWrap}>
          <Image source={{ uri: HERO }} style={styles.hero} />
          <View style={styles.logoFloat}>
            <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: AppColors.primary, marginRight: 8 }} />
            <Text style={styles.logo}>Takio</Text>
          </View>
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
  heroWrap: { height: 280, position: 'relative' },
  hero: { width: '100%', height: '100%' },

  logoFloat: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFFEE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },

  logo: { fontSize: 20, fontWeight: '800', color: AppColors.text },

  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    marginTop: -32,
    gap: 8,
    flex: 1,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },

  title: { fontSize: 28, fontWeight: '800', color: AppColors.text, marginBottom: 16 },

  label: { fontSize: 13, color: AppColors.textSecondary, marginTop: 8, fontWeight: '600' },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 4,
  },

  input: { flex: 1, fontSize: 15, color: AppColors.text, paddingVertical: 10 },

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

  ctaText: { color: '#FFF', fontWeight: '700', fontSize: 17 },

  helper: { textAlign: 'center', color: AppColors.textSecondary, marginTop: 14 },
});