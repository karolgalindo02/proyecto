import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/presentation/views/home/Home';
import { RegisterScreen } from './src/presentation/views/register/Register';
import { DashboardAdminScreen } from './src/presentation/views/dashboard/admin/DashboardAdmin';
import { DashboardUserScreen } from './src/presentation/views/dashboard/user/DashboardUser';

export type RootStackParamList = {
  HomeScreen: undefined;
  RegisterScreen: undefined;
  DashboardAdminScreen: undefined;
  DashboardUserScreen: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{
            headerShown: true,
            title: "Registro",
          }}
        />
        <Stack.Screen
          name="DashboardAdminScreen"
          component={DashboardAdminScreen}
        />
        <Stack.Screen
          name="DashboardUserScreen"
          component={DashboardUserScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;