import { apiPost, apiGet } from './httpClient';

export async function getProvincesApi() {
  const response = await apiGet('/api/v1/SalesOrders/provinces');
  if (!response.ok) throw new Error('Không thể tải danh sách Tỉnh/Thành phố');
  return response.json();
}

export async function getWardsApi(provinceId) {
  const response = await apiGet(`/api/v1/SalesOrders/wards/${provinceId}`);
  if (!response.ok) throw new Error('Không thể tải danh sách Phường/Xã');
  return response.json();
}

/**
 * Call POST /api/v1/SalesOrders to create an order
 * Payload format:
 * {
 *   BuyerId: Guid (backend sets this from token, optional to send),
 *   Notes: string,
 *   CustomerName: string,
 *   CustomerAddress: string,
 *   CustomerPhone: string,
 *   PaymentMethod: string,
 *   ProvinceId: number,
 *   WardCode: string,
 *   products: [
 *     {
 *       ProductVariantId: number,
 *       ProductVariantColorId: number,
 *       Count: number
 *     }
 *   ]
 * }
 */
export async function createSalesOrderApi(payload) {
  const response = await apiPost('/api/v1/SalesOrders', payload);
  if (!response.ok) {
    let errorMsg = 'Có lỗi xảy ra khi tạo đơn hàng';
    try {
      const data = await response.json();
      if (data.errors && typeof data.errors === 'object') {
        const firstError = Array.isArray(data.errors) ? data.errors[0] : Object.values(data.errors)[0];
        
        if (typeof firstError === 'string') {
          errorMsg = firstError;
        } else if (Array.isArray(firstError)) {
          errorMsg = firstError[0];
        } else if (firstError && firstError.message) {
          errorMsg = firstError.message;
        } else {
          errorMsg = JSON.stringify(firstError);
        }
      } else if (data.error?.message) {
        errorMsg = data.error.message;
      } else if (data.message) {
        errorMsg = data.message;
      } else if (data.title) {
        errorMsg = data.title;
      }
    } catch (e) {}
    throw new Error(errorMsg);
  }
  return response.json();
}
