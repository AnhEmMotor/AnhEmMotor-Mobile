export class GetUpcomingReminders {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async execute(vehicleId) {
    return await this.customerRepository.getUpcomingReminders(vehicleId);
  }
}
