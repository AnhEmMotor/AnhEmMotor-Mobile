import { apiPost } from './httpClient';

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
    let errorMsg = 'Failed to create order';
    try {
      const data = await response.json();
      errorMsg = data.error?.message || errorMsg;
    } catch (e) {}
    throw new Error(errorMsg);
  }
  return response.json();
}
