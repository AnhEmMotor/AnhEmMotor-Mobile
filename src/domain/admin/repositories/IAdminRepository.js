export class IAdminRepository {
  /**
   * Fetches dashboard statistics.
   * @returns {Promise<DashboardStats>}
   */
  async getDashboardStats() {
    throw new Error("Method getDashboardStats() must be implemented");
  }

  /**
   * Fetches all appointments (both test drives and service).
   * @returns {Promise<Array<Appointment>>}
   */
  async getAppointments() {
    throw new Error("Method getAppointments() must be implemented");
  }

  /**
   * Assigns a salesperson to a test drive appointment.
   * @param {string} appointmentId
   * @param {string} saleId
   * @param {string} saleName
   * @returns {Promise<Appointment>}
   */
  async assignSaleToAppointment(appointmentId, saleId, saleName) {
    throw new Error("Method assignSaleToAppointment() must be implemented");
  }

  /**
   * Pushes a service appointment into the workshop queue (status 'in_garage').
   * @param {string} appointmentId
   * @returns {Promise<Appointment>}
   */
  async startServiceRepair(appointmentId) {
    throw new Error("Method startServiceRepair() must be implemented");
  }

  /**
   * Fetches the available sales staff members.
   * @returns {Promise<Array<{id: string, name: string, status: string, avatar: string, active: boolean}>>}
   */
  async getSalesStaff() {
    throw new Error("Method getSalesStaff() must be implemented");
  }

  /**
   * Fetches all orders with their administrative & logistics statuses.
   * @returns {Promise<Array<Order>>}
   */
  async getOrders() {
    throw new Error("Method getOrders() must be implemented");
  }

  /**
   * Updates the workshop queue stage of a service appointment.
   * @param {string} appointmentId
   * @param {number} stage
   * @returns {Promise<Appointment>}
   */
  async updateServiceStage(appointmentId, stage) {
    throw new Error("Method updateServiceStage() must be implemented");
  }

  /**
   * Fetches all support, complaints and feedback tickets.
   * @returns {Promise<Array<SupportTicket>>}
   */
  async getSupportTickets() {
    throw new Error("Method getSupportTickets() must be implemented");
  }

  /**
   * Assigns a staff member to handle a ticket.
   * @param {string} ticketId
   * @param {string} staffId
   * @param {string} staffName
   * @returns {Promise<SupportTicket>}
   */
  async assignStaffToTicket(ticketId, staffId, staffName) {
    throw new Error("Method assignStaffToTicket() must be implemented");
  }

  /**
   * Responds to a support ticket.
   * @param {string} ticketId
   * @param {string} replyText
   * @returns {Promise<SupportTicket>}
   */
  async respondToTicket(ticketId, replyText) {
    throw new Error("Method respondToTicket() must be implemented");
  }

  /**
   * Approves and resolves a ticket.
   * @param {string} ticketId
   * @returns {Promise<SupportTicket>}
   */
  async resolveTicket(ticketId) {
    throw new Error("Method resolveTicket() must be implemented");
  }
}

