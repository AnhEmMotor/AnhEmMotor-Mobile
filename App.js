import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalStateProvider } from './src/context/GlobalState';
import { DependencyProvider } from './src/di/DependencyContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const RootContent = (
    <DependencyProvider>
      <GlobalStateProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </GlobalStateProvider>
    </DependencyProvider>
  );


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {RootContent}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 }
});