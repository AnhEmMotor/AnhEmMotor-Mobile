import { Platform } from 'react-native';

export const UI_V2 = true;
// Change this to your local IP address if testing on a real device, or localhost/127.0.0.1 for iOS simulator
export const API_BASE_URL = Platform.OS === 'web' ? 'http://localhost:5000' : 'http://172.16.45.188:5000';
