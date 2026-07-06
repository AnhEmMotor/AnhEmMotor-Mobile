import {
  getMyVehiclesApi,
  getBookingHistoryApi,
  getInvoicesApi,
  getLatestNewsApi,
  getActiveShipmentsApi,
  getFaqsApi,
  getProfileApi,
  getCustomerProfileApi,
} from '../../../api/customerApi';

function mapBackendVehicleToMobile(b) {
  return {
    id: String(b.id ?? b.VehicleId ?? Math.random()),
    name: b.name ?? b.VehicleName ?? 'Xe không tên',
    plate: b.plate ?? b.PlateNumber ?? '',
    vin: b.vin ?? b.Vin ?? '',
    engine: b.engine ?? b.EngineNumber ?? '',
    color: b.color ?? b.Color ?? '',
    type: b.type ?? b.VehicleType ?? '',
    version: b.version ?? b.Version ?? '',
    capacity: b.capacity ?? b.Capacity ?? '',
    regDate: b.regDate ?? b.RegistrationDate ?? '',
    status: b.status ?? 'Hoạt động tốt',
    odo: b.odo ?? b.OdometerKm?.toString?.() ?? '0 km',
    warrantyUntil: b.warrantyUntil ?? '',
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

  async getServiceHistory(vehicleId) {
    /* TODO: backend endpoint GET /api/v1/client/vehicles/{id}/history */
    return [];
  }

  async getUpcomingReminders(vehicleId) {
    /* TODO: backend endpoint GET /api/v1/client/vehicles/{id}/reminders */
    return [];
  }
}
