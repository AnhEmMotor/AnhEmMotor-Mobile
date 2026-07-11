import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenService = {
 async getAccessToken() {
 return await AsyncStorage.getItem(TOKEN_KEY);
 },

 async getRefreshToken() {
 return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
 },

 async saveTokens(accessToken, refreshToken) {
 await AsyncStorage.setItem(TOKEN_KEY, accessToken);
 if (refreshToken) {
 await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
 }
 },

 async clearTokens() {
 await AsyncStorage.removeItem(TOKEN_KEY);
 await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
 },

 async isAuthenticated() {
 const token = await AsyncStorage.getItem(TOKEN_KEY);
 return !!token;
 },
};

function getAuthHeader() {
 return tokenService.getAccessToken().then(
 token => token ? { Authorization: `Bearer ${token}` } : {}
 );
}

function buildUrl(path) {
 return `${API_BASE_URL}${path}`;
}

async function sendRequest(path, options = {}, retryOnAuth = true, timeoutMs = 30000) {
 const url = buildUrl(path);
 const authHeaders = await getAuthHeader();

 const controller = new AbortController();
 const timer = setTimeout(() => controller.abort(), timeoutMs || 30000);

 try {
 const response = await fetch(url, {
 ...options,
 headers: {
 'Content-Type': 'application/json',
 'Accept': 'application/json',
 ...authHeaders,
 ...options.headers,
 },
 signal: controller.signal,
 });
 clearTimeout(timer);

 if (response.status === 401 && retryOnAuth) {
 const refreshed = await tryRefreshToken();
 if (refreshed) {
 return sendRequest(path, options, false, timeoutMs);
 }
 await tokenService.clearTokens();
 throw new Error('SESSION_EXPIRED');
 }

 if (response.status === 403) {
 throw new Error('FORBIDDEN');
 }

 return response;
 } catch (error) {
 clearTimeout(timer);
 if (error.name === 'AbortError') {
 throw new Error('NETWORK_TIMEOUT');
 }
 throw error;
 }
}

async function tryRefreshToken() {
 try {
 const refreshToken = await tokenService.getRefreshToken();
 if (!refreshToken) return false;

 const response = await fetch(buildUrl('/api/v1/Auth/refresh-token'), {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'Accept': 'application/json',
 'Cookie': `refreshToken=${refreshToken}`,
 },
 });

 if (!response.ok) return false;

 const data = await response.json();
 const payload = data.value || data;
 const newAccessToken = payload?.accessToken || payload?.AccessToken;
 const refreshedToken = payload?.refreshToken || payload?.RefreshToken || refreshToken;
 if (newAccessToken) {
 await tokenService.saveTokens(newAccessToken, refreshedToken);
 return true;
 }
 return false;
 } catch {
 return false;
 }
}

export async function apiGet(path, timeoutMs) {
 return sendRequest(path, { method: 'GET' }, true, timeoutMs);
}

export async function apiPost(path, body, timeoutMs) {
 return sendRequest(path, { method: 'POST', body: JSON.stringify(body) }, true, timeoutMs);
}

export async function apiPut(path, body, timeoutMs) {
 return sendRequest(path, { method: 'PUT', body: JSON.stringify(body) }, true, timeoutMs);
}

export async function apiPatch(path, body, timeoutMs) {
 return sendRequest(path, { method: 'PATCH', body: JSON.stringify(body) }, true, timeoutMs);
}

export async function apiDelete(path, timeoutMs) {
 return sendRequest(path, { method: 'DELETE' }, true, timeoutMs);
}

export async function apiPostFormData(path, formData, timeoutMs) {
 const url = buildUrl(path);
 const authHeaders = await getAuthHeader();

 const controller = new AbortController();
 const timer = setTimeout(() => controller.abort(), timeoutMs || 10000);

 try {
 const response = await fetch(url, {
 method: 'POST',
 headers: { ...authHeaders },
 body: formData,
 signal: controller.signal,
 });
 clearTimeout(timer);

 if (response.status === 401) {
 const refreshed = await tryRefreshToken();
 if (refreshed) {
 return apiPostFormData(path, formData, timeoutMs);
 }
 await tokenService.clearTokens();
 throw new Error('SESSION_EXPIRED');
 }

 return response;
 } catch (error) {
 clearTimeout(timer);
 if (error.name === 'AbortError') throw new Error('NETWORK_TIMEOUT');
 throw error;
 }
}
