export class PurchaseHistoryItem {
  constructor({
    id,
    vehicleId,
    userId,
    purchaseDate,
    invoiceNumber,
    amount,
    sellerName,
    notes,
  }) {
    this.id = id;
    this.vehicleId = vehicleId;
    this.userId = userId;
    this.purchaseDate = purchaseDate;
    this.invoiceNumber = invoiceNumber;
    this.amount = amount;
    this.sellerName = sellerName;
    this.notes = notes;
  }
}
