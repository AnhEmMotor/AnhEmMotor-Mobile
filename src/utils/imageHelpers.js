export const getFullImageUrl = (url, baseUrl) => {
  if (!url) return '';
  
  const cleanBase = baseUrl.replace(/\/$/, '');

  if (url.includes('localhost:5000')) {
    return url.replace(/http:\/\/localhost:5000\/?/, `${cleanBase}/`);
  }

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image')) {
    return url;
  }

  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${cleanBase}${cleanUrl}`;
};
