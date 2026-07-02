import { ICustomerRepository } from '../../../domain/customer/repositories/ICustomerRepository';
import { CustomerVehicle } from '../../../domain/customer/entities/CustomerVehicle';
import { ServiceHistoryEntry } from '../../../domain/customer/entities/ServiceHistoryEntry';
import { ServiceReminder } from '../../../domain/customer/entities/ServiceReminder';

export class CustomerRepositoryImpl extends ICustomerRepository {
  constructor(customerDataSource) {
    super();
    this.customerDataSource = customerDataSource;
  }

  async getVehicles() {
    const rawVehicles = await this.customerDataSource.getVehicles();
    return rawVehicles.map(
      (v) =>
        new CustomerVehicle({
          id: v.id,
          name: v.name,
          plate: v.plate,
          vin: v.vin,
          engine: v.engine,
          color: v.color,
          type: v.type,
          version: v.version,
          capacity: v.capacity,
          regDate: v.regDate,
          status: v.status,
          odo: v.odo,
          warrantyUntil: v.warrantyUntil,
          warrantyFrom: v.warrantyFrom,
          insuranceUntil: v.insuranceUntil,
          operatingSpecs: v.operatingSpecs,
          nextService: v.nextService,
          timeline: v.timeline,
        })
    );
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
