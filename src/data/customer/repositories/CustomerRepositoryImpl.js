import { ICustomerRepository } from '../../../domain/customer/repositories/ICustomerRepository';
import { CustomerVehicle } from '../../../domain/customer/entities/CustomerVehicle';
import { VehicleDetail } from '../../../domain/customer/entities/VehicleDetail';
import { ServiceHistoryEntry } from '../../../domain/customer/entities/ServiceHistoryEntry';
import { ServiceReminder } from '../../../domain/customer/entities/ServiceReminder';
import { resolveImageUrl } from '../../../api/customerApi';

export class CustomerRepositoryImpl extends ICustomerRepository {
  constructor(customerDataSource) {
    super();
    this.customerDataSource = customerDataSource;
  }

  async getVehicles() {
    const rawVehicles = await this.customerDataSource.getVehicles();
    return rawVehicles.map((vehicle) => {
      const img = vehicle.imageUrl || vehicle.ImageUrl || vehicle.image || vehicle.Image;
      const parsedImage = img ? resolveImageUrl(img) : null;

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
      regDate:
        rawVehicle.purchaseDate ||
        rawVehicle.PurchaseDate ||
        rawVehicle.regDate ||
        rawVehicle.RegDate,
      warrantyDate: rawVehicle.warrantyDate || rawVehicle.WarrantyDate,
      warrantyFrom:
        rawVehicle.warrantyFrom ||
        rawVehicle.WarrantyFrom ||
        rawVehicle.purchaseDate ||
        rawVehicle.PurchaseDate,
      warrantyUntil:
        rawVehicle.warrantyDate ||
        rawVehicle.WarrantyDate ||
        rawVehicle.warrantyUntil ||
        rawVehicle.WarrantyUntil,
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
      timeline: (Array.isArray(rawVehicle.timeline)
        ? rawVehicle.timeline
        : Array.isArray(rawVehicle.Timeline)
          ? rawVehicle.Timeline
          : []
      ).map((t) => ({
        ...t,
        id: t.id ?? t.Id ?? Math.random().toString(),
        date: t.date ?? t.Date ?? '',
        type: t.type ?? t.Type ?? t.title ?? t.Title ?? 'Bảo dưỡng',
        desc: t.desc ?? t.Desc ?? t.description ?? t.Description ?? (t.items || t.Items)?.[2] ?? '',
        km: t.km ?? t.Km ?? (t.items || t.Items)?.[0]?.replace('Số km: ', '') ?? '0 km',
        price:
          t.price ??
          t.Price ??
          t.cost ??
          t.Cost ??
          (t.items || t.Items)?.[1]?.replace('Chi phí: ', '') ??
          '0 đ',
      })),
      documents: rawVehicle.documents,
      image:
        rawVehicle.imageUrl || rawVehicle.ImageUrl || rawVehicle.image || rawVehicle.Image
          ? resolveImageUrl(
              rawVehicle.imageUrl || rawVehicle.ImageUrl || rawVehicle.image || rawVehicle.Image
            )
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
