import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { LogBox } from 'react-native';


import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GlobalStateProvider } from './src/context/GlobalState';
import { DependencyProvider } from './src/di/DependencyContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';


LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  'Failed to execute \'removeChild\' on \'Node\'',
  'An error occurred in the <div> component',
  'An error occurred in the <NativeSafeAreaProvider> component',
  'An error occurred in the <ModalPortal> component',
  '[Reanimated] Failed to create CSS stylesheet',
  'An iframe which has both allow-scripts and allow-same-origin',
]);

export default function App() {
  const { StatusBar } = require("expo-status-bar");
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {RootContent}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
