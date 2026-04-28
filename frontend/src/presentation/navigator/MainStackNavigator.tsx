import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { WelcomeScreen } from '../views/welcome/Welcome';
import { LoginScreen } from '../views/welcome/Login';
import { RegisterScreen } from '../views/welcome/Register';
import { RoleChooseScreen } from '../views/role/RoleChoose';
import { DashboardScreen } from '../views/dashboard/Dashboard';
import { TasksScreen } from '../views/tasks/Tasks';
import { CreateTaskScreen } from '../views/tasks/CreateTask';
import { CreateProjectScreen } from '../views/projects/CreateProject';
import { JoinProjectScreen } from '../views/projects/JoinProject';
import { ProjectDetailScreen } from '../views/projects/ProjectDetail';
import { ChatbotScreen } from '../views/chatbot/Chatbot';
import { ProfileScreen } from '../views/profile/Profile';
import { NotificationsScreen } from '../views/notifications/Notifications';
import { AppColors } from '../theme/AppTheme';

const Stack = createNativeStackNavigator();

export const MainStackNavigator: React.FC = () => {
  const [initial, setInitial] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('takio_token').then((t) => setInitial(t ? 'Dashboard' : 'Welcome'));
  }, []);

  if (!initial) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: AppColors.background }}>
        <ActivityIndicator color={AppColors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initial} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: AppColors.background } }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RoleChoose" component={RoleChooseScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Tasks" component={TasksScreen} />
        <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
        <Stack.Screen name="CreateProject" component={CreateProjectScreen} />
        <Stack.Screen name="JoinProject" component={JoinProjectScreen} />
        <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};