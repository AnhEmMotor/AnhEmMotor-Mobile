export class Appointment {
  constructor({
    id,
    type,               // 'test_drive' or 'service'
    timeSlot,           // e.g. "09:30" or "14:00"
    status,             // 'pending', 'assigned', 'confirmed', 'in_garage', 'done'
    customerName,       // e.g. "ANH NGUYỄN AN KHÔI"
    customerPhone,      // e.g. "0901234567"
    vehicleName,        // e.g. "Honda Winner X 2026"
    licensePlate,       // e.g. "60-A1 555.55" (only for service)
    customerRank,       // e.g. "Silver", "Gold", "Platinum" (only for service)
    serviceRequest,     // e.g. "Thay nhớt máy + Kiểm tra xích" (only for service)
    assignedSaleId,     // e.g. "1" (assigned salesperson ID)
    assignedSaleName,   // e.g. "Minh Tuấn"
    serviceStage,       // 1: Đang kiểm tra, 2: Đang sửa chữa, 3: Đang rửa xe, 4: Sẵn sàng bàn giao
  }) {
    this.id = id;
    this.type = type;
    this.timeSlot = timeSlot;
    this.status = status;
    this.customerName = customerName;
    this.customerPhone = customerPhone;
    this.vehicleName = vehicleName;
    this.licensePlate = licensePlate;
    this.customerRank = customerRank;
    this.serviceRequest = serviceRequest;
    this.assignedSaleId = assignedSaleId;
    this.assignedSaleName = assignedSaleName;
    this.serviceStage = serviceStage || (status === 'in_garage' ? 1 : null);
  }
}

