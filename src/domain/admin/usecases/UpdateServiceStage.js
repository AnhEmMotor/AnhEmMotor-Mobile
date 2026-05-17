/**
 * @file UpdateServiceStage.js
 * @layer Domain - Use Cases
 * @description Use case for advancing a service repair's live workshop queue stage.
 */
export class UpdateServiceStage {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  /**
   * Executes the usecase
   * @param {string} appointmentId
   * @param {number} stage
   * @returns {Promise<Appointment>}
   */
  async execute(appointmentId, stage) {
    if (!appointmentId) throw new Error("Mã lịch hẹn dịch vụ không được trống");
    if (stage < 1 || stage > 5) throw new Error("Chặng dịch vụ không hợp lệ");
    
    return await this.adminRepository.updateServiceStage(appointmentId, stage);
  }
}
