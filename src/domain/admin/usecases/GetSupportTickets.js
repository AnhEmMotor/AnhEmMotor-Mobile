/**
 * @file GetSupportTickets.js
 * @layer Domain - Use Cases
 * @description Use case for fetching all support & complaints tickets.
 */
export class GetSupportTickets {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  /**
   * Executes the usecase
   * @returns {Promise<Array<SupportTicket>>}
   */
  async execute() {
    return await this.adminRepository.getSupportTickets();
  }
}
