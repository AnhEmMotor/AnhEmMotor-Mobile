export class GetCustomerVehicles {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async execute() {
    return await this.customerRepository.getVehicles();
  }
}
