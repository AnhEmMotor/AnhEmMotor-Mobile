import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const UI_V2 = true;

const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost || '';
const inferredHost = debuggerHost ? debuggerHost.split(':').slice(0, -1).join(':') : '';
const webHost = typeof window !== 'undefined' && window.location?.hostname
	? window.location.hostname
	: 'localhost';
const isWeb = Platform.OS === 'web';
const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';

const resolvedHost = isWeb
	? webHost
	: isAndroid
		? (inferredHost && inferredHost !== 'localhost' ? inferredHost : '10.0.2.2')
		: isIOS
			? (inferredHost || '127.0.0.1')
			: (inferredHost || 'localhost');

export const API_BASE_URL =
	process.env.EXPO_PUBLIC_BACKEND_API_URL ||
	`http://${resolvedHost}:5000`;
