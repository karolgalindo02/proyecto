import React, { useState } from 'react';
import { View, Text, Image, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';
// Importamos FontFamily junto a AppColors
import { AppColors, FontFamily } from '../../theme/AppTheme'; 

const HERO = require('../../../../assets/hero.jpg');

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
      style={styles.input} // Aplicamos la fuente en el estilo input
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
    confirmPassword: '', 
  });

  const [loading, setLoading] = useState(false);

  const validate = () => {
    const { name, lastname, email, password, confirmPassword } = form;
    if (!name || !lastname || !email || !password || !confirmPassword) {
      Alert.alert('Faltan datos', 'Completa todos los campos obligatorios');
      return false;
    }
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
      const { data } = await ApiDelivery.post('/auth/register', form);
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

    
          <Image source={HERO} style={styles.hero} />
                    <View style={styles.logoFloat}>
                                <Image
                                source={require ('../../../../assets/Takio-Logo2.png')}
                                style={{ width: 400, height: 50, marginBottom: 24 }}
                                resizeMode="contain"
                              />
                    </View>
     

        <View style={styles.sheet}>
          <Text style={styles.title}>Regístrate</Text>

          <Field icon="user" placeholder="Nombre" value={form.name} onChangeText={(v: string) => setForm(prev => ({ ...prev, name: v }))} />
          <Field icon="user" placeholder="Apellido" value={form.lastname} onChangeText={(v: string) => setForm(prev => ({ ...prev, lastname: v }))} />
          <Field icon="mail" placeholder="Email" value={form.email} onChangeText={(v: string) => setForm(prev => ({ ...prev, email: v }))} keyboardType="email-address" />
          <Field icon="phone" placeholder="Teléfono" value={form.phone} onChangeText={(v: string) => setForm(prev => ({ ...prev, phone: v }))} keyboardType="phone-pad" />
          <Field icon="lock" placeholder="Contraseña" value={form.password} onChangeText={(v: string) => setForm(prev => ({ ...prev, password: v }))} secureTextEntry />
          <Field icon="lock" placeholder="Confirmar Contraseña" value={form.confirmPassword} onChangeText={(v: string) => setForm(prev => ({ ...prev, confirmPassword: v }))} secureTextEntry />
          
          <Pressable style={[styles.cta, loading && { opacity: 0.6 }]} onPress={submit} disabled={loading}>
            <Text style={styles.ctaText}>{loading ? 'Creando...' : 'Confirmar Registro'}</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.helper}>
              ¿Ya tienes cuenta? <Text style={{ color: AppColors.primary, fontFamily: FontFamily.heading }}>Ingresa</Text>
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
    top: 110,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },

sheet: {
    width: '100%',
    height: '70%',
    backgroundColor: '#F5F5F6',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    gap : 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
},
  title: { 
    fontFamily: FontFamily.heading,
    fontSize: 26, 
    color: AppColors.text 
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#CAB8FF',
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  input: { 
    fontFamily: FontFamily.body,
    flex: 1, 
    fontSize: 15, 
    color: AppColors.text, 
    paddingVertical: 10 
  },
  cta: {
    marginTop: 12,
    backgroundColor: AppColors.primary,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  ctaText: { 
    fontFamily: FontFamily.heading,
    color: '#FFF', 
    fontSize: 17 
  },
  helper: { 
    fontFamily: FontFamily.body,
    textAlign: 'center', 
    color: AppColors.textSecondary, 
    marginTop: 12 
  },
});