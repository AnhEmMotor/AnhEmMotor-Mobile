export class ICustomerRepository {
  async getVehicles() {
    throw new Error('getVehicles method not implemented');
  }

  async registerVehicle(_vehicleData) {
    throw new Error('registerVehicle method not implemented');
  }

  async updateVehicle(_vehicleId, _vehicleData) {
    throw new Error('updateVehicle method not implemented');
  }

  async getServiceHistory(_vehicleId) {
    throw new Error('getServiceHistory method not implemented');
  }

  async getVehicleDetail(_vehicleId) {
    throw new Error('getVehicleDetail method not implemented');
  }

  async getUpcomingReminders(_vehicleId) {
    throw new Error('getUpcomingReminders method not implemented');
  }
}
