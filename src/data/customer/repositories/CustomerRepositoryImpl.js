import { ICustomerRepository } from '../../../domain/customer/repositories/ICustomerRepository';
import { CustomerVehicle } from '../../../domain/customer/entities/CustomerVehicle';
import { VehicleDetail } from '../../../domain/customer/entities/VehicleDetail';
import { ServiceHistoryEntry } from '../../../domain/customer/entities/ServiceHistoryEntry';
import { ServiceReminder } from '../../../domain/customer/entities/ServiceReminder';
import { API_BASE_URL } from '../../../config';

export class CustomerRepositoryImpl extends ICustomerRepository {
  constructor(customerDataSource) {
    super();
    this.customerDataSource = customerDataSource;
  }

  async getVehicles() {
    const rawVehicles = await this.customerDataSource.getVehicles();
    return rawVehicles.map((vehicle) => {
      const img = vehicle.imageUrl || vehicle.ImageUrl || vehicle.image || vehicle.Image;
      const parsedImage = img ? (img.startsWith('http') ? img : `${API_BASE_URL}${img}`) : null;

      return new CustomerVehicle({
        ...vehicle,
        type: vehicle.type || vehicle.categoryName || vehicle.CategoryName || vehicle.variantName,
        image: parsedImage,
      });
    });
  }

  async registerVehicle(vehicleData) {
    const rawVehicle = await this.customerDataSource.registerVehicle(vehicleData);
    return new CustomerVehicle(rawVehicle);
  }

  async updateVehicle(vehicleId, vehicleData) {
    const rawVehicle = await this.customerDataSource.updateVehicle(vehicleId, vehicleData);
    return new VehicleDetail(rawVehicle);
  }

  async getVehicleDetail(vehicleId) {
    const rawVehicle = await this.customerDataSource.getVehicleDetail(vehicleId);
    const plate = rawVehicle.licensePlate ?? rawVehicle.plate ?? '';
    const currentOdo = rawVehicle.currentOdo ?? rawVehicle.odo;
    const nextMaintenanceOdo = rawVehicle.nextMaintenanceOdo ?? rawVehicle.nextService?.odo;

    return new VehicleDetail({
      id: rawVehicle.id,
      name: rawVehicle.name ?? rawVehicle.fullName ?? '',
      fullName: rawVehicle.fullName ?? rawVehicle.name ?? '',
      phoneNumber: rawVehicle.phoneNumber,
      vin: rawVehicle.vinNumber ?? rawVehicle.vin,
      engine: rawVehicle.engineNumber ?? rawVehicle.engine,
      plate,
      color: rawVehicle.color ?? rawVehicle.colorName ?? '',
      type: rawVehicle.type ?? rawVehicle.variantName ?? '',
      version: rawVehicle.version ?? rawVehicle.warrantyPeriod ?? rawVehicle.variantName ?? '',
      capacity: rawVehicle.capacity,
      purchaseDate: rawVehicle.purchaseDate || rawVehicle.PurchaseDate,
      regDate: rawVehicle.purchaseDate || rawVehicle.PurchaseDate || rawVehicle.regDate || rawVehicle.RegDate,
      warrantyDate: rawVehicle.warrantyDate || rawVehicle.WarrantyDate,
      warrantyFrom: rawVehicle.warrantyFrom || rawVehicle.WarrantyFrom || rawVehicle.purchaseDate || rawVehicle.PurchaseDate,
      warrantyUntil: rawVehicle.warrantyDate || rawVehicle.WarrantyDate || rawVehicle.warrantyUntil || rawVehicle.WarrantyUntil,
      warrantyRemainingDays: rawVehicle.warrantyRemainingDays || rawVehicle.WarrantyRemainingDays,
      warrantyPeriod: rawVehicle.warrantyPeriod || rawVehicle.WarrantyPeriod,
      insuranceUntil: rawVehicle.insuranceUntil,
      currentOdo: currentOdo,
      odo:
        currentOdo != null
          ? `${currentOdo.toLocaleString?.() ?? currentOdo} km`
          : (rawVehicle.odo ?? ''),
      status: rawVehicle.maintenanceStatus ?? rawVehicle.status ?? '',
      maintenanceStatus: rawVehicle.maintenanceStatus,
      lastMaintenanceDate: rawVehicle.lastMaintenanceDate,
      nextMaintenanceDate: rawVehicle.nextMaintenanceDate,
      nextMaintenanceOdo: nextMaintenanceOdo,
      nextService:
        rawVehicle.nextService ??
        (nextMaintenanceOdo || rawVehicle.nextMaintenanceDate
          ? {
              odo: nextMaintenanceOdo
                ? `${nextMaintenanceOdo.toLocaleString?.() ?? nextMaintenanceOdo} km`
                : '',
              date: rawVehicle.nextMaintenanceDate,
              items: [],
            }
          : {}),
      operatingSpecs: rawVehicle.operatingSpecs,
      timeline: rawVehicle.timeline,
      documents: rawVehicle.documents,
      image:
        rawVehicle.imageUrl || rawVehicle.ImageUrl || rawVehicle.image || rawVehicle.Image
          ? (
              rawVehicle.imageUrl ||
              rawVehicle.ImageUrl ||
              rawVehicle.image ||
              rawVehicle.Image
            ).startsWith('http')
            ? rawVehicle.imageUrl || rawVehicle.ImageUrl || rawVehicle.image || rawVehicle.Image
            : `${API_BASE_URL}${rawVehicle.imageUrl || rawVehicle.ImageUrl || rawVehicle.image || rawVehicle.Image}`
          : null,
    });
  }

  async getServiceHistory(vehicleId) {
    const rawHistory = await this.customerDataSource.getServiceHistory(vehicleId);
    return rawHistory.map(
      (h) =>
        new ServiceHistoryEntry({
          id: h.id,
          date: h.date,
          title: h.title,
          items: h.items,
          cost: h.cost,
          technician: h.technician,
          status: h.status,
        })
    );
  }

  async getUpcomingReminders(vehicleId) {
    const rawReminders = await this.customerDataSource.getUpcomingReminders(vehicleId);
    return rawReminders.map(
      (r) =>
        new ServiceReminder({
          km: r.km,
          task: r.task,
          dueDate: r.dueDate,
        })
    );
  }
}
