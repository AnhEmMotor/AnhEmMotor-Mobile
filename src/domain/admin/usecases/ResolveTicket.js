/**
 * @file ResolveTicket.js
 * @layer Domain - Use Cases
 * @description Use case for approving and closing/resolving a ticket.
 */
export class ResolveTicket {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  /**
   * Executes the usecase
   * @param {string} ticketId
   * @returns {Promise<SupportTicket>}
   */
  async execute(ticketId) {
    if (!ticketId) throw new Error("Mã yêu cầu không được trống");
    
    return await this.adminRepository.resolveTicket(ticketId);
  }
}
