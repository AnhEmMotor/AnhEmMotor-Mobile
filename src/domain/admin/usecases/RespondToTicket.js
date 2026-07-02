/**
 * @file RespondToTicket.js
 * @layer Domain - Use Cases
 * @description Use case for sending a response to a customer's ticket.
 */
export class RespondToTicket {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  /**
   * Executes the usecase
   * @param {string} ticketId
   * @param {string} replyText
   * @returns {Promise<SupportTicket>}
   */
  async execute(ticketId, replyText) {
    if (!ticketId) throw new Error("Mã yêu cầu không được trống");
    if (!replyText || replyText.trim() === '') throw new Error("Nội dung phản hồi không được trống");
    
    return await this.adminRepository.respondToTicket(ticketId, replyText);
  }
}
