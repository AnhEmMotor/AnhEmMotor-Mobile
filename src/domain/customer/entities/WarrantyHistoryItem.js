export class WarrantyHistoryItem {
  constructor({
    id,
    vehicleId,
    userId,
    startDate,
    endDate,
    providerName,
    policyNumber,
    description,
    status,
    coverageAmount,
  }) {
    this.id = id;
    this.vehicleId = vehicleId;
    this.userId = userId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.providerName = providerName;
    this.policyNumber = policyNumber;
    this.description = description;
    this.status = status;
    this.coverageAmount = coverageAmount;
  }
}
