export class GetAppointments {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  /**
   * Orchestrates the retrieval of appointments, optionally filtering by type ('test_drive' or 'service').
   * @param {string} [type]
   * @returns {Promise<Array<Appointment>>}
   */
  async execute(type) {
    const appointments = await this.adminRepository.getAppointments();
    if (type) {
      return appointments.filter(app => app.type === type);
    }
    return appointments;
  }
}
