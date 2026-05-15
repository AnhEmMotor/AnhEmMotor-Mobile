import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GlobalStateProvider } from './src/context/GlobalState';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GlobalStateProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </GlobalStateProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}