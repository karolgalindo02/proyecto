import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../App';
import { useNavigation } from '@react-navigation/native';
import { CustomModal } from '../../components/CustomModal';
import { CustomTextInput } from '../../components/CustomTextInput';
import { RoundedButton } from '../../components/RoundedButton';
import { useProjectFormViewModel } from './ViewModel';
import styles from './Styles';

type ProjectFormNavigationProp = StackNavigationProp<RootStackParamList>;

export const ProjectFormScreen = () => {
  const navigation = useNavigation<ProjectFormNavigationProp>();
  const {
    name,
    team,
    progress,
    errors,
    loading,
    modalVisible,
    modalConfig,
    onChange,
    createProject,
    setModalVisible
  } = useProjectFormViewModel();

  return (
    <View style={styles.container}>
      <Image
   //     source={require('../../../../assets/chef.jpg')}
        style={styles.imageBackground}
      />
      
      <View style={styles.headerContainer}>
        <Image
       //   source={require('../../../../assets/logo.jpg')}
          style={styles.logoImage}
        />
        <Text style={styles.headerTitle}>NUEVO PROYECTO</Text>
      </View>

      <View style={styles.formContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.formTitle}>CREAR PROYECTO</Text>
          
          <CustomTextInput
            image={require('../../../../assets/project.png')}
            placeholder='Nombre del Proyecto*'
            keyboardType='default'
            property='name'
            onChangeText={onChange}
            value={name}
            error={errors.name}
            showError={true}
          />
          
          <CustomTextInput
            image={require('../../../../assets/team.png')}
            placeholder='Equipo (separado por comas)*'
            keyboardType='default'
            property='team'
            onChangeText={onChange}
            value={team}
            error={errors.team}
            showError={true}
          />
          
          <CustomTextInput
            image={require('../../../../assets/progress.png')}
            placeholder='Progreso (%)'
            keyboardType='numeric'
            property='progress'
            onChangeText={onChange}
            value={progress}
            error={errors.progress}
            showError={true}
          />

          <View style={styles.buttonContainer}>
            <RoundedButton 
              text={loading ? 'CREANDO...' : 'CREAR PROYECTO'} 
              onPress={createProject}
            />
          </View>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>CANCELAR</Text>
          </TouchableOpacity>
        </ScrollView>
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