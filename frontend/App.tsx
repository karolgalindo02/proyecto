import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./src/presentation/views/home/Home";
import { RegisterScreen } from "./src/presentation/views/register/Register";
import { DashboardScreen } from "./src/presentation/views/dashboard/Dashboard";
import { ProjectFormScreen } from "./src/presentation/views/projects/ProjectFormScreen";
import { TaskFormScreen } from "./src/presentation/views/tasks/form/TaskFormScreen";
import { TasksScreen } from "./src/presentation/views/tasks/view/TasksScreen";

export type RootStackParamList = {
  HomeScreen: undefined;
  RegisterScreen: undefined;
  DashboardScreen: undefined;
  TasksScreen: undefined;
  TaskCreateScreen: undefined;
  TaskEditScreen: { taskId: number };
  TaskDetailScreen: { taskId: number };
  ProjectCreateScreen: undefined;
  ProjectDetailScreen: { projectId: number };
  ProfileScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{
            headerShown: true,
            title: "Registro",
          }}
        />
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen
          name="ProjectCreateScreen"
          component={ProjectFormScreen}
        />
        <Stack.Screen name="TaskCreateScreen" component={TaskFormScreen} />
        <Stack.Screen name="TasksScreen" component={TasksScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
