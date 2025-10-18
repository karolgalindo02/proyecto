import React from 'react';
import styles from './Styles';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { RoundedButton } from '../../components/RoundedButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomModal } from '../../components/CustomModal';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../App';
import useViewModel from './ViewModel';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const { email, password, errors, loading, modalVisible, modalConfig, onChange, login, setModalVisible } = useViewModel();
  const navigation = useNavigation<HomeNavigationProp>();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/chef.jpg')}
        style={styles.imageBackground}
      />
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logoImage}
        />
        <Text style={styles.logoText}>FOOD APP</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.formText}>INGRESAR</Text>
        
        <CustomTextInput
          image={require('../../../../assets/email.png')}
          placeholder='Correo Electrónico*'
          keyboardType='email-address'
          property='email'
          onChangeText={onChange}
          value={email}
          error={errors.email}
          showError={true}
        />
        
        <CustomTextInput
          image={require('../../../../assets/password.png')}
          placeholder='Contraseña*'
          keyboardType='default'
          property='password'
          onChangeText={onChange}
          value={password}
          secureTextEntry={true}
          error={errors.password}
          showError={true}
        />
        
        <View style={{ marginTop: 30 }}>
          <RoundedButton 
            text={loading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'} 
            onPress={login}
          />
        </View>
        
        <View style={styles.formRegister}>
          <Text>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.formRegisterText}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomModal
        visible={modalVisible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};