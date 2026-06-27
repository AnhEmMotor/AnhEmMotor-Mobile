import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { Platform, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { GlobalStateProvider } from './src/context/GlobalState';
import { DependencyProvider } from './src/di/DependencyContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

// Ignore development warnings from third-party libraries
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  'Failed to execute \'removeChild\' on \'Node\'',
  'An iframe which has both allow-scripts and allow-same-origin',
]);

export default function App() {
  const RootContent = (
    <DependencyProvider>
      <GlobalStateProvider>
        <StatusBar style="light" />
        <ErrorBoundary>
          <AppNavigator />
        </ErrorBoundary>
      </GlobalStateProvider>
    </DependencyProvider>
  );

  // For web: use initialMetrics to prevent removeChild errors
  if (Platform.OS === 'web') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          {RootContent}
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {RootContent}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
