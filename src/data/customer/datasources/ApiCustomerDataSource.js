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
  getCustomerProfileApi,
} from '../../../api/customerApi';

export function mapBackendVehicleToMobile(b) {
  const formatOdo = (value) => {
    if (value == null || value === '') return '';
    if (typeof value === 'number') return `${value.toLocaleString()} km`;
    return String(value);
  };

  return {
    id: String(b.id ?? b.VehicleId ?? Math.random()),
    name:
      b.name ??
      b.FullName ??
      b.VehicleName ??
      b.VariantName ??
      b.BrandName ??
      'Xe không tên',
    plate:
      b.plate ??
      b.LicensePlate ??
      b.PlateNumber ??
      b.licensePlate ??
      '',
    vin:
      b.vin ??
      b.VinNumber ??
      b.Vin ??
      b.vinNumber ??
      '',
    engine:
      b.engine ??
      b.EngineNumber ??
      b.Engine ??
      b.engineNumber ??
      '',
    color: b.color ?? b.Color ?? b.colorName ?? '',
    type: b.type ?? b.VehicleType ?? b.variantName ?? b.BrandName ?? '',
    version:
      b.version ??
      b.Version ??
      b.warrantyPeriod ??
      b.variantName ??
      '',
    capacity: b.capacity ?? b.Capacity ?? '',
    regDate:
      b.regDate ??
      b.RegistrationDate ??
      b.RegDate ??
      b.purchaseDate ??
      '',
    status: b.status ?? 'Hoạt động tốt',
    currentOdo: b.currentOdo ?? b.odo ?? '',
    odo: formatOdo(b.odo ?? b.currentOdo ?? ''),
    warrantyUntil: b.warrantyUntil ?? b.warrantyDate ?? '',
    warrantyFrom: b.warrantyFrom ?? '',
    insuranceUntil: b.insuranceUntil ?? '',
    operatingSpecs: b.operatingSpecs ?? {},
    nextService: b.nextService ?? {},
    timeline: Array.isArray(b.timeline) ? b.timeline : [],
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
