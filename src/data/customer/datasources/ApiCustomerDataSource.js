import {
  getMyVehiclesApi,
  getCustomerVehicleDetailApi,
  getCustomerVehicleHistoryApi,
  registerVehicleApi,
  updateVehicleApi,
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
    (b.brandName || b.BrandName
      ? `${b.brandName || b.BrandName} ${b.variantName || b.VariantName || ''}`.trim()
      : null) ??
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
    vin: b.vinNumber ?? b.VinNumber ?? b.vin ?? b.Vin ?? '',
    engine: b.engineNumber ?? b.EngineNumber ?? b.engine ?? b.Engine ?? '',
    color: b.colorName ?? b.ColorName ?? b.color ?? b.Color ?? '',
    type:
      b.categoryName ??
      b.CategoryName ??
      b.type ??
      b.Type ??
      b.vehicleType ??
      b.VehicleType ??
      b.brandName ??
      b.BrandName ??
      'Xe máy',
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
    timeline: (Array.isArray(b.timeline) ? b.timeline : Array.isArray(b.Timeline) ? b.Timeline : []).map((t) => ({
      ...t,
      id: t.id ?? t.Id ?? Math.random().toString(),
      date: t.date ?? t.Date ?? '',
      type: t.type ?? t.Type ?? t.title ?? t.Title ?? 'Bảo dưỡng',
      desc: t.desc ?? t.Desc ?? t.description ?? t.Description ?? (t.items || t.Items)?.[2] ?? '',
      km: t.km ?? t.Km ?? (t.items || t.Items)?.[0]?.replace('Số km: ', '') ?? '0 km',
      price: t.price ?? t.Price ?? t.cost ?? t.Cost ?? (t.items || t.Items)?.[1]?.replace('Chi phí: ', '') ?? '0 đ',
    })),
    image:
      b.imageUrl || b.ImageUrl || b.image || b.Image
        ? (b.imageUrl || b.ImageUrl || b.image || b.Image).startsWith('http')
          ? b.imageUrl || b.ImageUrl || b.image || b.Image
          : `${API_BASE_URL}${b.imageUrl || b.ImageUrl || b.image || b.Image}`
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
    const purchaseHistory = Array.isArray(raw.purchaseHistory) ? raw.purchaseHistory : (Array.isArray(raw.PurchaseHistory) ? raw.PurchaseHistory : []);
    const warrantyHistory = Array.isArray(raw.warrantyHistory) ? raw.warrantyHistory : (Array.isArray(raw.WarrantyHistory) ? raw.WarrantyHistory : []);

    const safeFormatDate = (dateStr) => {
      if (!dateStr) return '';
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return String(dateStr).split('T')[0];
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      } catch (e) {
        return String(dateStr).split('T')[0];
      }
    };

    const mappedPurchaseHistory = purchaseHistory.map((entry) => ({
      id: String(entry.id || entry.Id),
      date: (entry.purchaseDate || entry.PurchaseDate) ? safeFormatDate(entry.purchaseDate || entry.PurchaseDate) : '',
      title: `Mua xe - ${entry.invoiceNumber || entry.InvoiceNumber || ''}`,
      items: [
        `Người bán: ${entry.sellerName || entry.SellerName || 'AnhEmMotor Showroom'}`,
        `Số tiền: ${(entry.amount || entry.Amount)?.toLocaleString?.() ?? (entry.amount || entry.Amount)} đ`,
        entry.notes || entry.Notes || 'Không có ghi chú',
      ],
      cost: (entry.amount || entry.Amount) ? `${(entry.amount || entry.Amount).toLocaleString()} đ` : '',
      technician: entry.sellerName || entry.SellerName,
      status: 'completed',
    }));

    const mappedWarrantyHistory = warrantyHistory.map((entry) => ({
      id: String(entry.id || entry.Id),
      date: (entry.startDate || entry.StartDate) ? safeFormatDate(entry.startDate || entry.StartDate) : '',
      title: `Bảo dưỡng - ${entry.providerName || entry.ProviderName || ''}`,
      items: [
        `Mã phiếu: ${entry.policyNumber || entry.PolicyNumber || ''}`,
        entry.description || entry.Description || 'Không có mô tả',
        `Chi phí: ${(entry.coverageAmount || entry.CoverageAmount)?.toLocaleString?.() ?? (entry.coverageAmount || entry.CoverageAmount)} đ`,
      ],
      cost: (entry.coverageAmount || entry.CoverageAmount) ? `${(entry.coverageAmount || entry.CoverageAmount).toLocaleString()} đ` : '',
      technician: entry.providerName || entry.ProviderName,
      status: entry.status || entry.Status || 'completed',
    }));

    return [...mappedPurchaseHistory, ...mappedWarrantyHistory].sort((a, b) => {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      return bDate - aDate;
    });
  }

  async getUpcomingReminders(_vehicleId) {
        return [];
  }
}
