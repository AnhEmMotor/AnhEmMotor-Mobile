import {
  getMyVehiclesApi,
  getCustomerVehicleDetailApi,
  getCustomerVehicleHistoryApi,
  registerVehicleApi,
  updateVehicleApi,
  getBookingHistoryApi,
  getInvoicesApi,
  getLatestNewsApi,
  getActiveShipmentsApi,
  getFaqsApi,
  getProfileApi,
} from '../../../api/customerApi';
import { API_BASE_URL } from '../../../config';

export function mapBackendVehicleToMobile(b) {
  if (!b) return null;
  const formatOdo = (value) => {
    if (value == null || value === '') return '';
    if (typeof value === 'number') return `${value.toLocaleString()} km`;
    return String(value);
  };

    const name =
      b.productName ??
      b.ProductName ??
      b.name ??
      b.Name ??
      b.variantName ??
      b.VariantName ??
      (b.brandName || b.BrandName ? `${b.brandName || b.BrandName} ${b.variantName || b.VariantName || ''}`.trim() : null) ??
      b.fullName ??
      b.FullName ??
      'Xe của tôi';

  return {
    id: String(b.id ?? b.Id ?? b.vehicleId ?? b.VehicleId ?? Math.random()),
    name,
    plate:
      b.licensePlate ??
      b.LicensePlate ??
      b.plate ??
      b.Plate ??
      b.plateNumber ??
      b.PlateNumber ??
      '',
    vin:
      b.vinNumber ??
      b.VinNumber ??
      b.vin ??
      b.Vin ??
      '',
    engine:
      b.engineNumber ??
      b.EngineNumber ??
      b.engine ??
      b.Engine ??
      '',
    color: b.colorName ?? b.ColorName ?? b.color ?? b.Color ?? '',
    type: b.categoryName ?? b.CategoryName ?? b.type ?? b.Type ?? b.vehicleType ?? b.VehicleType ?? b.brandName ?? b.BrandName ?? 'Xe máy',
    version:
      b.variantName ??
      b.VariantName ??
      b.version ??
      b.Version ??
      b.warrantyPeriod ??
      b.WarrantyPeriod ??
      '',
    capacity: b.capacity ?? b.Capacity ?? '',
    regDate:
      b.purchaseDate ??
      b.PurchaseDate ??
      b.regDate ??
      b.RegDate ??
      b.registrationDate ??
      b.RegistrationDate ??
      '',
    status: b.status ?? b.Status ?? (b.isActive !== false ? 'Hoạt động tốt' : 'Ngưng hoạt động'),
    currentOdo: b.currentOdo ?? b.CurrentOdo ?? b.odo ?? b.Odo ?? 0,
    odo: formatOdo(b.currentOdo ?? b.CurrentOdo ?? b.odo ?? b.Odo ?? ''),
    warrantyUntil: b.warrantyUntil ?? b.WarrantyUntil ?? b.warrantyDate ?? b.WarrantyDate ?? '',
    warrantyFrom: b.warrantyFrom ?? b.WarrantyFrom ?? '',
    insuranceUntil: b.insuranceUntil ?? b.InsuranceUntil ?? '',
    timeline: Array.isArray(b.timeline) ? b.timeline : (Array.isArray(b.Timeline) ? b.Timeline : []),
    image: (b.imageUrl || b.ImageUrl || b.image || b.Image) 
      ? ((b.imageUrl || b.ImageUrl || b.image || b.Image).startsWith('http') 
          ? (b.imageUrl || b.ImageUrl || b.image || b.Image) 
          : `${API_BASE_URL}${b.imageUrl || b.ImageUrl || b.image || b.Image}`)
      : null,
  };
}

export class ApiCustomerDataSource {
  async getVehicles() {
    const raw = await getMyVehiclesApi();
    return raw.map(mapBackendVehicleToMobile);
  }

  async registerVehicle(vehicleData) {
    const raw = await registerVehicleApi(vehicleData);
    return mapBackendVehicleToMobile(raw);
  }

  async getVehicleDetail(vehicleId) {
    return await getCustomerVehicleDetailApi(vehicleId);
  }

  async updateVehicle(vehicleId, vehicleData) {
    const raw = await updateVehicleApi(vehicleId, vehicleData);
    return mapBackendVehicleToMobile(raw);
  }

  async getServiceHistory(vehicleId) {
    const raw = await getCustomerVehicleHistoryApi(vehicleId);
    const purchaseHistory = Array.isArray(raw.purchaseHistory)
      ? raw.purchaseHistory
      : [];
    const warrantyHistory = Array.isArray(raw.warrantyHistory)
      ? raw.warrantyHistory
      : [];

    const mappedPurchaseHistory = purchaseHistory.map((entry) => ({
      id: String(entry.id),
      date: entry.purchaseDate ? new Date(entry.purchaseDate).toLocaleDateString() : '',
      title: `Mua xe - ${entry.invoiceNumber}`,
      items: [
        `Người bán: ${entry.sellerName}`,
        `Số tiền: ${entry.amount?.toLocaleString?.() ?? entry.amount} đ`,
        entry.notes || 'Không có ghi chú',
      ],
      cost: entry.amount ? `${entry.amount.toLocaleString()} đ` : '',
      technician: entry.sellerName,
      status: 'completed',
    }));

    const mappedWarrantyHistory = warrantyHistory.map((entry) => ({
      id: String(entry.id),
      date: entry.startDate ? new Date(entry.startDate).toLocaleDateString() : '',
      title: `Bảo hành - ${entry.providerName}`,
      items: [
        `Số hợp đồng: ${entry.policyNumber}`,
        entry.description || 'Không có mô tả',
        `Mức bảo hiểm: ${entry.coverageAmount?.toLocaleString?.() ?? entry.coverageAmount} đ`,
      ],
      cost: entry.coverageAmount ? `${entry.coverageAmount.toLocaleString()} đ` : '',
      technician: entry.providerName,
      status: entry.status || 'completed',
    }));

    return [...mappedPurchaseHistory, ...mappedWarrantyHistory].sort((a, b) => {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return bDate - aDate;
    });
  }

  async getUpcomingReminders(vehicleId) {
    /* TODO: backend endpoint GET /api/v1/client/vehicles/{id}/reminders */
    return [];
  }
}
