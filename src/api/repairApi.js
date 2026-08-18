import { apiGet } from './httpClient';

export async function getPersonalRepairsApi() {
  const response = await apiGet('/api/v1/client/repairs/personal');
  if (!response.ok) throw new Error('Không thể tải trạng thái bảo dưỡng');
  return response.json();
}
