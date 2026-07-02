export class DashboardStats {
  constructor({
    salesRevenue,      // e.g. "12.4 Tỷ"
    salesCount,        // e.g. 18
    salesGrowth,       // e.g. 15 (representing +15% growth)
    newLeadsCount,     // e.g. 12
    testDriveCount,    // e.g. 8
    testDriveRate,     // e.g. 68 (representing 68% occupancy rate)
    pendingPipeline,   // e.g. "4.2 Tỷ"
    targetCount,       // e.g. 25 (monthly target)
  }) {
    this.salesRevenue = salesRevenue;
    this.salesCount = salesCount;
    this.salesGrowth = salesGrowth;
    this.newLeadsCount = newLeadsCount;
    this.testDriveCount = testDriveCount;
    this.testDriveRate = testDriveRate;
    this.pendingPipeline = pendingPipeline;
    this.targetCount = targetCount;
  }

  /**
   * Calculates the percentage progress towards the monthly target.
   * @returns {number}
   */
  getTargetProgress() {
    if (!this.targetCount) return 0;
    return Math.round((this.salesCount / this.targetCount) * 100);
  }
}
