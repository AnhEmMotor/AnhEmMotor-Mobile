import { apiGet } from './httpClient';

export const getPersonalVouchers = async () => {
  try {
    const response = await apiGet('/api/v1/client/vouchers/personal');
    if (response.ok) {
      const data = await response.json();
      return data.value || data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching personal vouchers:', error);
    return [];
  }
};
