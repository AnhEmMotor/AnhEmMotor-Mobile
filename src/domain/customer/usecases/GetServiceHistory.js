export class GetServiceHistory {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async execute(vehicleId) {
    return await this.customerRepository.getServiceHistory(vehicleId);
  }
}
