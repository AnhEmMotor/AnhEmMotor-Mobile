export class GetDashboardStats {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  /**
   * Orchestrates the action of retrieving Dashboard Stats.
   * @returns {Promise<DashboardStats>}
   */
  async execute() {
    return await this.adminRepository.getDashboardStats();
  }
}
