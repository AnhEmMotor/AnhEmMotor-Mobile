export class UpdateCustomerVehicle {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async execute(vehicleId, vehicleData) {
    return await this.customerRepository.updateVehicle(vehicleId, vehicleData);
  }
}
