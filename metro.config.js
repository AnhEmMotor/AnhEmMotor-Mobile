const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support for web platform
config.resolver.platforms = ['ios', 'android', 'web'];

module.exports = config;
