import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalStateProvider } from './src/context/GlobalState';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <GlobalStateProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </GlobalStateProvider>
    </SafeAreaProvider>
  );
}