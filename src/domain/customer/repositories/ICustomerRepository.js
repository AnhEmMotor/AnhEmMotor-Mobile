/**
 * Interface for Customer repository operations.
 * This contract must be implemented by the Data layer.
 */
export class ICustomerRepository {
  async getVehicles() {
    throw new Error('getVehicles method not implemented');
  }

  async getServiceHistory(vehicleId) {
    throw new Error('getServiceHistory method not implemented');
  }

  async getUpcomingReminders(vehicleId) {
    throw new Error('getUpcomingReminders method not implemented');
  }
}
