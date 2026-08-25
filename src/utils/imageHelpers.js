import { API_BASE_URL } from '../config';

const MEDIA_ROUTE_PREFIX = 'api/v1/MediaFile/view-image/';

const LOOPBACK_BACKEND_PATTERN =
  /^(https?):\/\/(?:localhost|127(?:\.\d+){3}|\[::1\]|0\.0\.0\.0|10\.0\.2\.2)(?::\d+)?(?=[/?#]|$)/i;

const cleanBaseUrl = () => (API_BASE_URL || '').replace(/\/+$/, '');

const ensurePngPlaceholder = (url) =>
  url.includes('placehold.co') && !url.includes('/png') && !url.includes('/jpg')
    ? url.replace('placehold.co/', 'placehold.co/png/')
    : url;

export const getFullImageUrl = (rawUrl, { basePath } = {}) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const url = rawUrl.trim().replace(/\\/g, '/');
  if (!url) return '';
  if (/^(data:|blob:)/i.test(url)) return url;

  if (/^https?:\/\//i.test(url)) {
    let resolved = url;
    if (resolved.includes('/articles/covers/') && !resolved.includes('/uploads/articles/covers/')) {
      resolved = resolved.replace('/articles/covers/', '/uploads/articles/covers/');
    }
    return resolved.replace(LOOPBACK_BACKEND_PATTERN, () => cleanBaseUrl());
  }

  let cleanUrl = url.replace(/^\/+/, '');
  if (basePath && !cleanUrl.startsWith(basePath)) {
    cleanUrl = `${basePath}${cleanUrl}`;
  }
  return `${cleanBaseUrl()}/${cleanUrl}`;
};

export const resolveMediaUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const url = rawUrl.trim().replace(/\\/g, '/');
  if (!url) return '';
  if (/^(data:|blob:)/i.test(url)) return url;

  if (/^https?:\/\//i.test(url)) {
    return ensurePngPlaceholder(getFullImageUrl(url));
  }

  let normalizedUrl = url.replace(/^\/+/, '');
  if (!normalizedUrl.startsWith(MEDIA_ROUTE_PREFIX)) {
    normalizedUrl = `${MEDIA_ROUTE_PREFIX}${normalizedUrl}`;
  }
  return ensurePngPlaceholder(`${cleanBaseUrl()}/${normalizedUrl}`);
};
