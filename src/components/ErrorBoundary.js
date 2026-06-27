import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In development, log to console but don't show UI
    if (__DEV__) {
      console.log('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // In production, show fallback UI
      if (!__DEV__) {
        return (
          <View style={styles.fallback}>
            <Text style={styles.fallbackText}>Đã xảy ra lỗi</Text>
          </View>
        );
      }
      // In development, render children to allow other errors to show
      return this.props.children;
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  fallbackText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ErrorBoundary;
