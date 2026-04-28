import React, { useState } from 'react';
import { View, Text, Image, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';
import { AppColors } from '../../theme/AppTheme';

const HERO = 'https://images.pexels.com/photos/7674843/pexels-photo-7674843.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';

const Field = ({ icon, placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default' }: any) => (
  <View style={styles.inputWrap}>
    <Feather name={icon} size={18} color={AppColors.textMuted} />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
      style={styles.input}
      placeholderTextColor={AppColors.textMuted}
      blurOnSubmit={false}
    />
  </View>
);

export const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '', // ✅ nuevo
  });

  const [loading, setLoading] = useState(false);

  const validate = () => {
    const { name, lastname, email, phone, password, confirmPassword } = form;

    if (!name || !lastname || !email || !password || !confirmPassword) {
      Alert.alert('Faltan datos', 'Completa todos los campos obligatorios');
      return false;
    }

    if (name.length < 3) {
      Alert.alert('Nombre inválido', 'Debe tener al menos 3 caracteres');
      return false;
    }

    if (lastname.length < 3) {
      Alert.alert('Apellido inválido', 'Debe tener al menos 3 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Email inválido', 'Ingresa un correo válido');
      return false;
    }

    if (phone) {
      const phoneRegex = /^[0-9]{7,15}$/;
      if (!phoneRegex.test(phone)) {
        Alert.alert('Teléfono inválido', 'Debe tener entre 7 y 15 números');
        return false;
      }
    }

    // ✅ MISMA REGLA QUE LOGIN
    if (password.length < 6) {
      Alert.alert('Contraseña inválida', 'Debe tener al menos 6 caracteres');
      return false;
    }

    // ✅ NUEVA VALIDACIÓN
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await ApiDelivery.post('/auth/register', {
        name: form.name,
        lastname: form.lastname,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      await AsyncStorage.setItem('takio_token', data.data.token);
      await AsyncStorage.setItem('takio_user', JSON.stringify(data.data.user));

      navigation.reset({ index: 0, routes: [{ name: 'RoleChoose' }] });

    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el usuario');
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
          <Text style={styles.title}>Regístrate</Text>

          <Field icon="user" placeholder="Nombre" value={form.name} onChangeText={(v: string) => setForm(prev => ({ ...prev, name: v }))} />
          <Field icon="user" placeholder="Apellido" value={form.lastname} onChangeText={(v: string) => setForm(prev => ({ ...prev, lastname: v }))} />
          <Field icon="mail" placeholder="Email" value={form.email} onChangeText={(v: string) => setForm(prev => ({ ...prev, email: v }))} keyboardType="email-address" />
          <Field icon="phone" placeholder="Teléfono" value={form.phone} onChangeText={(v: string) => setForm(prev => ({ ...prev, phone: v }))} keyboardType="phone-pad" />
          
          <Field icon="lock" placeholder="Contraseña" value={form.password} onChangeText={(v: string) => setForm(prev => ({ ...prev, password: v }))} secureTextEntry />
          
         
          <Pressable style={[styles.cta, loading && { opacity: 0.6 }]} onPress={submit} disabled={loading}>
            <Text style={styles.ctaText}>{loading ? 'Creando...' : 'Confirmar Registro'}</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.helper}>
              ¿Ya tienes cuenta? <Text style={{ color: AppColors.primary, fontWeight: '700' }}>Ingresa</Text>
            </Text>
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  heroWrap: { height: 210 },
  hero: { width: '100%', height: '100%' },

  logoFloat: {
    position: 'absolute',
    top: 36,
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
    padding: 24,
    marginTop: -24,
    gap: 10,
    flex: 1,
  },

  title: { fontSize: 26, fontWeight: '800', color: AppColors.text },

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
    marginTop: 12,
    backgroundColor: AppColors.primary,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },

  ctaText: { color: '#FFF', fontWeight: '700', fontSize: 17 },

  helper: { textAlign: 'center', color: AppColors.textSecondary, marginTop: 12 },
});