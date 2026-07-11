export class GetCustomerVehicleDetail {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async execute(vehicleId) {
    return await this.customerRepository.getVehicleDetail(vehicleId);
  }
}
