export class Order {
  constructor({
    id,
    orderCode,          // e.g. "#AEM-9982"
    vehicleName,        // e.g. "Honda SH 160i Thể Thao"
    financialStatus,    // e.g. "Đã cọc: 10.000.000đ" or "✓ Đã duyệt trả góp (HD Saison)"
    currentStage,       // 1: Received, 2: Registration, 3: Ready to Deliver, 4: In Transport
    stagesData,         // e.g. [{ name: "Đã nhận cọc", time: "10:00 15/05" }, ...]
    isBottlenecked,     // true or false
    bottleneckMessage,  // e.g. "Tắc nghẽn: Chậm 12 tiếng tại phòng thuế"
    isTransporting,     // true if currently in transit, triggers GPS map
    driverName,         // e.g. "Nguyễn Văn H."
    driverPhone,        // e.g. "0901122334"
    etaMinutes,         // e.g. 25
    routePolyline,      // coordinates for the tracking line
    driverCoordinates,  // current coordinates of driver
  }) {
    this.id = id;
    this.orderCode = orderCode;
    this.vehicleName = vehicleName;
    this.financialStatus = financialStatus;
    this.currentStage = currentStage;
    this.stagesData = stagesData;
    this.isBottlenecked = isBottlenecked;
    this.bottleneckMessage = bottleneckMessage;
    this.isTransporting = isTransporting;
    this.driverName = driverName;
    this.driverPhone = driverPhone;
    this.etaMinutes = etaMinutes;
    this.routePolyline = routePolyline;
    this.driverCoordinates = driverCoordinates;
  }

  /**
   * Returns a friendly status text based on currentStage.
   * @returns {string}
   */
  getStageStatusText() {
    switch (this.currentStage) {
      case 1: return "Đã nhận cọc";
      case 2: return "Đăng ký biển số";
      case 3: return "Sẵn sàng bàn giao";
      case 4: return "Đang vận chuyển";
      default: return "Đang xử lý";
    }
  }
}
