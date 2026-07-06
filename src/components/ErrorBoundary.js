import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ErrorBoundary({ children }) {
  if (!__DEV__) {
    return <ErrorCatcher>{children}</ErrorCatcher>;
  }
  return children;
}

class ErrorCatcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>Đã xảy ra lỗi</Text>
        </View>
      );
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
