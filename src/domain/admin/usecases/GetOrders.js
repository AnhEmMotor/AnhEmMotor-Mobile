export class GetOrders {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  /**
   * Executes the retrieval of all showroom orders.
   * @returns {Promise<Array<Order>>}
   */
  async execute() {
    return await this.adminRepository.getOrders();
  }
}
