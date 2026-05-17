export class AssignSaleToAppointment {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  /**
   * Executes the assignment of a salesperson to a specific appointment.
   * @param {string} appointmentId
   * @param {string} saleId
   * @param {string} saleName
   * @returns {Promise<Appointment>}
   */
  async execute(appointmentId, saleId, saleName) {
    if (!appointmentId) throw new Error("Mã lịch hẹn là bắt buộc");
    if (!saleId || !saleName) throw new Error("Thông tin nhân viên Sale là bắt buộc");
    return await this.adminRepository.assignSaleToAppointment(appointmentId, saleId, saleName);
  }
}
