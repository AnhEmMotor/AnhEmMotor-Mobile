const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support for web platform
config.resolver.platforms = ['ios', 'android', 'web'];

// Allow resolving .ts/.tsx files in node_modules (expo-status-bar ships TS source)
config.resolver.sourceExts = [...config.resolver.sourceExts, 'ts', 'tsx'];

module.exports = config;
