import React from 'react';
import styles from './Styles';
import { Text, View, Image, ScrollView } from 'react-native';
import { CustomTextInput } from '../../components/CustomTextInput';
import { RoundedButton } from '../../components/RoundedButton';
import { CustomModal } from '../../components/CustomModal';
import useViewModel from './ViewModel';

export const RegisterScreen = () => {
  const { 
    name, lastname, phone, email, password, confirmPassword, 
    errors, loading, modalVisible, modalConfig,
    onChange, register, setModalVisible 
  } = useViewModel();

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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.formText}>REGÍSTRATE</Text>
          
          <CustomTextInput
            image={require('../../../../assets/user.png')}
            placeholder='Nombres*'
            keyboardType='default'
            property='name'
            onChangeText={onChange}
            value={name}
            error={errors.name}
            showError={true}
          />
          
          <CustomTextInput
            image={require('../../../../assets/my_user.png')}
            placeholder='Apellidos*'
            keyboardType='default'
            property='lastname'
            onChangeText={onChange}
            value={lastname}
            error={errors.lastname}
            showError={true}
          />
          
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
            image={require('../../../../assets/phone.png')}
            placeholder='Teléfono* (10 dígitos)'
            keyboardType='numeric'
            property='phone'
            onChangeText={onChange}
            value={phone}
            error={errors.phone}
            showError={true}
          />
          
          <CustomTextInput
            image={require('../../../../assets/password.png')}
            placeholder='Contraseña* (mín. 6 caracteres)'
            keyboardType='default'
            property='password'
            onChangeText={onChange}
            value={password}
            secureTextEntry={true}
            error={errors.password}
            showError={true}
          />
          
          <CustomTextInput
            image={require('../../../../assets/confirm_password.png')}
            placeholder='Confirmar Contraseña*'
            keyboardType='default'
            property='confirmPassword'
            onChangeText={onChange}
            value={confirmPassword}
            secureTextEntry={true}
            error={errors.confirmPassword}
            showError={true}
          />
          
     
          <View style={{ marginTop: 20 }}>
            <RoundedButton 
              text={loading ? 'REGISTRANDO...' : 'CONFIRMAR REGISTRO'} 
              onPress={register} 
           
            />
          </View>
        </ScrollView>
      </View>

      {/* Modal para mensajes */}
      <CustomModal
        visible={modalVisible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}