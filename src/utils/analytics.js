import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from '../config';

const CLIENT_ID_KEY = '@ga4_client_id';

let cachedClientId = null;

function makeUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function getClientId() {
  if (cachedClientId) return cachedClientId;
  try {
    let stored = await AsyncStorage.getItem(CLIENT_ID_KEY);
    if (!stored) {
      stored = makeUuid();
      await AsyncStorage.setItem(CLIENT_ID_KEY, stored);
    }
    cachedClientId = stored;
    return stored;
  } catch (_e) {
    return 'anonymous-device';
  }
}

export async function trackEvent(name, params = {}) {
  try {
    if (typeof fetch !== 'function' || !API_BASE_URL) return;
    const clientId = await getClientId();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    await fetch(`${API_BASE_URL}/api/v1/analytics/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        events: [
          {
            name,
            timestamp: new Date().toISOString(),
            params,
          },
        ],
      }),
      signal: controller.signal,
    }).catch(() => {});
    clearTimeout(timeout);
  } catch (_e) {}
}

export function initScreenTracking(navRef) {
  let lastRouteName = null;
  const send = () => {
    try {
      const route = navRef.getCurrentRoute ? navRef.getCurrentRoute() : null;
      if (!route || !route.name || route.name === lastRouteName) return;
      lastRouteName = route.name;
      trackEvent('screen_view', {
        screen_name: route.name,
        screen_class: route.name,
        platform: 'android',
      });
    } catch (_e) {}
  };

  let unsubscribe;
  try {
    unsubscribe = navRef.addListener ? navRef.addListener('state', send) : null;
  } catch (_e) {
    unsubscribe = null;
  }
  const timer = setTimeout(send, 2500);

  trackEvent('app_open');

  return () => {
    if (typeof unsubscribe === 'function') unsubscribe();
    clearTimeout(timer);
  };
}
