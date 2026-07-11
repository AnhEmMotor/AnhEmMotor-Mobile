/**
 * Interface for Customer repository operations.
 * This contract must be implemented by the Data layer.
 */
export class ICustomerRepository {
  async getVehicles() {
    throw new Error('getVehicles method not implemented');
  }

  async registerVehicle(vehicleData) {
    throw new Error('registerVehicle method not implemented');
  }

  async updateVehicle(vehicleId, vehicleData) {
    throw new Error('updateVehicle method not implemented');
  }

  async getServiceHistory(vehicleId) {
    throw new Error('getServiceHistory method not implemented');
  }

  async getVehicleDetail(vehicleId) {
    throw new Error('getVehicleDetail method not implemented');
  }

  async getUpcomingReminders(vehicleId) {
    throw new Error('getUpcomingReminders method not implemented');
  }
}
