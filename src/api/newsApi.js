import { apiGet } from './httpClient';

export const getLatestNews = async () => {
  try {
    const response = await apiGet('/api/v1/news/public/latest');
    if (response.ok) {
      const data = await response.json();
      return data.value || data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }
};

export const getNewsBySlug = async (slug) => {
  try {
    const response = await apiGet(`/api/v1/news/public/${slug}`);
    if (response.ok) {
      const data = await response.json();
      return data.value || data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching news with slug ${slug}:`, error);
    return null;
  }
};
