export class GetCustomerVehicleHistory {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async execute(vehicleId) {
    return await this.customerRepository.getVehicleHistory(vehicleId);
  }
}
