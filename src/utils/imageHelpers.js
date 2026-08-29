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
    return ensurePngPlaceholder(url.replace(LOOPBACK_BACKEND_PATTERN, () => cleanBaseUrl()));
  }

  let cleanUrl = url.replace(/^\/+/, '');
  if (basePath && !cleanUrl.startsWith(basePath) && !cleanUrl.startsWith('api/')) {
    cleanUrl = `${basePath}${cleanUrl}`;
  }
  return ensurePngPlaceholder(`${cleanBaseUrl()}/${cleanUrl}`);
};

export const resolveMediaUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const url = rawUrl.trim().replace(/\\/g, '/');
  if (!url) return '';
  if (/^(data:|blob:)/i.test(url)) return url;

  if (/^https?:\/\//i.test(url)) {
    return ensurePngPlaceholder(url.replace(LOOPBACK_BACKEND_PATTERN, () => cleanBaseUrl()));
  }

  let normalizedUrl = url.replace(/^\/+/, '');
  if (!normalizedUrl.startsWith(MEDIA_ROUTE_PREFIX)) {
    if (normalizedUrl.startsWith('uploads/')) {
      normalizedUrl = `${MEDIA_ROUTE_PREFIX}${normalizedUrl.replace(/^uploads\//, '')}`;
    } else if (normalizedUrl.startsWith('api/')) {
    } else {
      normalizedUrl = `${MEDIA_ROUTE_PREFIX}${normalizedUrl}`;
    }
  }
  return ensurePngPlaceholder(`${cleanBaseUrl()}/${normalizedUrl}`);
};

export const processHtmlImages = (html) => {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi, (match, src) => {
    const resolvedSrc = resolveMediaUrl(src) || getFullImageUrl(src);
    return match
      .replace(`src="${src}"`, `src="${resolvedSrc}"`)
      .replace(`src='${src}'`, `src='${resolvedSrc}'`);
  });
};
