import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { 
  useFonts,
  LexendDeca_400Regular,
  LexendDeca_600SemiBold,
  LexendDeca_700Bold
} from '@expo-google-fonts/lexend-deca';

import { MainStackNavigator } from './src/presentation/navigator/MainStackNavigator';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'LexendDeca': LexendDeca_400Regular,
    'LexendDeca-SemiBold': LexendDeca_600SemiBold,
    'LexendDeca-Bold': LexendDeca_700Bold,
  });


  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <MainStackNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}