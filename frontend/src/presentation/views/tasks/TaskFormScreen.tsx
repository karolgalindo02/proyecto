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
import { useTaskFormViewModel } from './ViewModel';
import styles from './Styles';

type TaskFormNavigationProp = StackNavigationProp<RootStackParamList>;

export const TaskFormScreen = () => {
  const navigation = useNavigation<TaskFormNavigationProp>();
  const {
    name,
    description,
    projectId,
    assignedTo,
    progress,
    priority,
    dueDate,
    projects,
    users,
    errors,
    loading,
    modalVisible,
    modalConfig,
    onChange,
    createTask,
    setModalVisible
  } = useTaskFormViewModel();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/chef.jpg')}
        style={styles.imageBackground}
      />
      
      <View style={styles.headerContainer}>
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logoImage}
        />
        <Text style={styles.headerTitle}>NUEVA TAREA</Text>
      </View>

      <View style={styles.formContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.formTitle}>CREAR TAREA</Text>
          
          <CustomTextInput
            image={require('../../../../assets/task.png')}
            placeholder='Nombre de la Tarea*'
            keyboardType='default'
            property='name'
            onChangeText={onChange}
            value={name}
            error={errors.name}
            showError={true}
          />
          
          <CustomTextInput
            image={require('../../../../assets/description.png')}
            placeholder='Descripción*'
            keyboardType='default'
            property='description'
            onChangeText={onChange}
            value={description}
            error={errors.description}
            showError={true}
          />

          {/* Selector de Proyecto */}
          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Proyecto*</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {projects.map(project => (
                  <TouchableOpacity
                    key={project.id}
                    style={[
                      styles.option,
                      projectId === project.id.toString() && styles.optionSelected
                    ]}
                    onPress={() => onChange('projectId', project.id.toString())}
                  >
                    <Text style={[
                      styles.optionText,
                      projectId === project.id.toString() && styles.optionTextSelected
                    ]}>
                      {project.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {errors.projectId ? <Text style={styles.errorText}>{errors.projectId}</Text> : null}
          </View>

          {/* Selector de Usuario Asignado */}
          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Asignar a*</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {users.map(user => (
                  <TouchableOpacity
                    key={user.id}
                    style={[
                      styles.option,
                      assignedTo === user.id.toString() && styles.optionSelected
                    ]}
                    onPress={() => onChange('assignedTo', user.id.toString())}
                  >
                    <Text style={[
                      styles.optionText,
                      assignedTo === user.id.toString() && styles.optionTextSelected
                    ]}>
                      {user.name} {user.lastname}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {errors.assignedTo ? <Text style={styles.errorText}>{errors.assignedTo}</Text> : null}
          </View>

          {/* Selector de Prioridad */}
          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>Prioridad</Text>
            <View style={styles.optionsContainer}>
              {['Low', 'Medium', 'High'].map(priorityOption => (
                <TouchableOpacity
                  key={priorityOption}
                  style={[
                    styles.option,
                    priority === priorityOption && styles.optionSelected
                  ]}
                  onPress={() => onChange('priority', priorityOption)}
                >
                  <Text style={[
                    styles.optionText,
                    priority === priorityOption && styles.optionTextSelected
                  ]}>
                    {priorityOption === 'High' ? 'ALTA' : 
                     priorityOption === 'Medium' ? 'MEDIA' : 'BAJA'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

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

          <CustomTextInput
            image={require('../../../../assets/calendar.png')}
            placeholder='Fecha de Vencimiento (YYYY-MM-DD)'
            keyboardType='default'
            property='dueDate'
            onChangeText={onChange}
            value={dueDate}
            error={errors.dueDate}
            showError={true}
          />

          <View style={styles.buttonContainer}>
            <RoundedButton 
              text={loading ? 'CREANDO...' : 'CREAR TAREA'} 
              onPress={createTask}
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