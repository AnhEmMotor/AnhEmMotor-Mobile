import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GlobalStateProvider } from './src/context/GlobalState';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const RootContent = (
    <GlobalStateProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </GlobalStateProvider>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {Platform.OS === 'web' ? (
        <View style={styles.root}>{RootContent}</View>
      ) : (
        <SafeAreaProvider>{RootContent}</SafeAreaProvider>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 }
});