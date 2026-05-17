/**
 * @file AssignStaffToTicket.js
 * @layer Domain - Use Cases
 * @description Use case for assigning a staff member to handle a support ticket.
 */
export class AssignStaffToTicket {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  /**
   * Executes the usecase
   * @param {string} ticketId
   * @param {string} staffId
   * @param {string} staffName
   * @returns {Promise<SupportTicket>}
   */
  async execute(ticketId, staffId, staffName) {
    if (!ticketId) throw new Error("Mã yêu cầu không được trống");
    if (!staffId || !staffName) throw new Error("Thông tin nhân viên gán không được trống");
    
    return await this.adminRepository.assignStaffToTicket(ticketId, staffId, staffName);
  }
}
