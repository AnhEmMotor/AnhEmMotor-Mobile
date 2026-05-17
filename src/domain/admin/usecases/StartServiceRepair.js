export class StartServiceRepair {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  /**
   * Pushes a service appointment into the workshop queue.
   * @param {string} appointmentId
   * @returns {Promise<Appointment>}
   */
  async execute(appointmentId) {
    if (!appointmentId) throw new Error("Mã lịch hẹn dịch vụ là bắt buộc");
    return await this.adminRepository.startServiceRepair(appointmentId);
  }
}
