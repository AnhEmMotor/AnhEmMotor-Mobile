export class RegisterCustomerVehicle {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async execute(vehicleData) {
    return await this.customerRepository.registerVehicle(vehicleData);
  }
}
