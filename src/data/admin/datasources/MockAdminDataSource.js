import { DashboardStats } from '../../../domain/admin/entities/DashboardStats';
import { Appointment } from '../../../domain/admin/entities/Appointment';

// In-memory data store to simulate a database
let inMemoryStats = {
  salesRevenue: "12.4 Tỷ",
  salesCount: 18,
  salesGrowth: 15,
  newLeadsCount: 12,
  testDriveCount: 8,
  testDriveRate: 68,
  pendingPipeline: "4.2 Tỷ",
  targetCount: 25,
};

let inMemoryAppointments = [
  {
    id: '1',
    type: 'test_drive',
    date: '10/06/2026',
    timeSlot: '09:30',
    status: 'pending', // 'pending', 'assigned', 'confirmed'
    customerName: 'ANH NGUYỄN AN KHÔI',
    customerPhone: '0901234567',
    vehicleName: 'Honda Winner X 2026',
    assignedSaleId: null,
    assignedSaleName: null,
  },
  {
    id: '2',
    type: 'test_drive',
    date: '10/06/2026',
    timeSlot: '10:30',
    status: 'confirmed',
    customerName: 'ANH TRẦN VĂN NAM',
    customerPhone: '0988776655',
    vehicleName: 'Kawasaki Z1000',
    assignedSaleId: '1',
    assignedSaleName: 'Minh Tuấn',
  },
  {
    id: '3',
    type: 'service',
    date: '10/06/2026',
    timeSlot: '14:00',
    status: 'pending', // 'pending', 'in_garage', 'done'
    customerName: 'ANH NGUYỄN HOÀNG LONG',
    customerPhone: '0912345678',
    vehicleName: 'Honda Winner X 2026',
    licensePlate: '60-A1 555.55',
    customerRank: 'Silver',
    serviceRequest: 'Thay nhớt máy + Kiểm tra xích',
  },
  {
    id: '4',
    type: 'service',
    date: '11/06/2026',
    timeSlot: '15:30',
    status: 'pending',
    customerName: 'ANH PHẠM QUỐC ANH',
    customerPhone: '0977665544',
    vehicleName: 'Honda SH 160i Thể Thao',
    licensePlate: '60-F4 999.99',
    customerRank: 'Gold',
    serviceRequest: 'Thay má phanh trước + Vệ sinh nồi',
  },
];

let inMemoryStaff = [
  { id: '1', name: 'Minh Tuấn', status: 'Đang tiếp khách', avatar: 'https://i.pravatar.cc/150?u=1', active: true },
  { id: '2', name: 'Thanh Hằng', status: 'Showroom', avatar: 'https://i.pravatar.cc/150?u=2', active: true },
  { id: '3', name: 'Quốc Bảo', status: 'Lái thử', avatar: 'https://i.pravatar.cc/150?u=3', active: false },
];

let inMemoryOrders = [
  {
    id: '1',
    orderCode: '#AEM-9982',
    vehicleName: 'Honda SH 160i Thể Thao',
    financialStatus: 'Đã cọc: 10.000.000đ',
    currentStage: 2, // Đăng ký biển số Biên Hòa
    stagesData: [
      { name: "Đã nhận cọc", time: "09:00 15/05", done: true },
      { name: "Làm biển số Biên Hòa", time: "Đang tiến hành", done: false },
      { name: "Sẵn sàng giao xe", time: "--:--", done: false },
    ],
    isBottlenecked: true,
    bottleneckMessage: "Tắc nghẽn: Chậm 12 tiếng tại phòng thuế Biên Hòa",
    isTransporting: false,
  },
  {
    id: '2',
    orderCode: '#AEM-9985',
    vehicleName: 'Yamaha Exciter 155 VVA',
    financialStatus: '✓ Đã duyệt trả góp (HD Saison)',
    currentStage: 3, // Sẵn sàng giao xe
    stagesData: [
      { name: "Đã nhận cọc", time: "14:00 14/05", done: true },
      { name: "Làm biển số Biên Hòa", time: "11:00 16/05", done: true },
      { name: "Sẵn sàng giao xe", time: "Chờ khách nhận", done: false },
    ],
    isBottlenecked: false,
    isTransporting: false,
  },
  {
    id: '3',
    orderCode: '#AEM-9986',
    vehicleName: 'Honda Winner X 2026',
    financialStatus: 'Đã cọc: 5.000.000đ',
    currentStage: 4, // Đang vận chuyển
    stagesData: [
      { name: "Đã nhận cọc", time: "08:30 16/05", done: true },
      { name: "Làm biển số Biên Hòa", time: "15:00 16/05", done: true },
      { name: "Đang vận chuyển", time: "Đang trên đường", done: false },
    ],
    isBottlenecked: false,
    isTransporting: true,
    driverName: 'Nguyễn Văn H.',
    driverPhone: '0901122334',
    etaMinutes: 25,
    routePolyline: [
      { latitude: 10.8756, longitude: 106.8009 },
      { latitude: 10.9000, longitude: 106.8150 },
      { latitude: 10.9250, longitude: 106.8300 },
      { latitude: 10.9574, longitude: 106.8427 } // Showroom Biên Hòa
    ],
    driverCoordinates: { latitude: 10.9120, longitude: 106.8210 } // Current location in transit
  }
];

let inMemoryTickets = [
  {
    id: '1',
    customerName: 'Lê Thảo Nhi',
    customerAvatar: 'https://i.pravatar.cc/150?u=4',
    type: 'Khiếu nại',
    content: 'Thái độ nhân viên chưa tốt khi tư vấn trả góp.',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    status: 'new',
    assignedStaffId: null,
    assignedStaffName: null,
    slaFirstResponseMinutes: 90, // 90 minutes remaining
    slaResolveMinutes: 1410,
    rating: 2, // Low rating triggered this complaint ticket
    internalNotes: 'Ý kiến từ đánh giá sao thấp trên App khách hàng.',
    replyContent: null
  },
  {
    id: '2',
    customerName: 'Trần Minh Nam',
    customerAvatar: 'https://i.pravatar.cc/150?u=5',
    type: 'Hỗ trợ',
    content: 'Cần hướng dẫn kích hoạt bảo hành điện tử.',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'assigned',
    assignedStaffId: '1',
    assignedStaffName: 'Minh Tuấn',
    slaFirstResponseMinutes: 0, // Met SLA first response
    slaResolveMinutes: 1320,
    rating: null,
    internalNotes: 'Lịch sử bảo hành đã gán cho kỹ thuật viên.',
    replyContent: null
  },
  {
    id: '3',
    customerName: 'Nguyễn Văn Khôi',
    customerAvatar: 'https://i.pravatar.cc/150?u=1',
    type: 'Phản hồi',
    content: 'Xe chạy rất êm, dịch vụ giao xe nhanh.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    status: 'resolved',
    assignedStaffId: '2',
    assignedStaffName: 'Thanh Hằng',
    slaFirstResponseMinutes: 0,
    slaResolveMinutes: 0,
    rating: 5,
    internalNotes: 'Đánh giá tích cực, đã cảm ơn khách.',
    replyContent: 'Cảm ơn bạn đã phản hồi tích cực!'
  }
];

export class MockAdminDataSource {
  async fetchDashboardStats() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...inMemoryStats };
  }

  async fetchAppointments() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...inMemoryAppointments];
  }

  async fetchSalesStaff() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...inMemoryStaff];
  }

  async fetchOrders() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...inMemoryOrders];
  }

  async updateAppointmentSale(appointmentId, saleId, saleName) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = inMemoryAppointments.findIndex(app => app.id === appointmentId);
    if (index === -1) throw new Error("Không tìm thấy lịch hẹn");
    
    // Update in-memory db
    inMemoryAppointments[index] = {
      ...inMemoryAppointments[index],
      status: 'confirmed',
      assignedSaleId: saleId,
      assignedSaleName: saleName
    };

    // Increment test drive stats as feedback
    inMemoryStats.testDriveCount += 1;
    inMemoryStats.testDriveRate = Math.min(inMemoryStats.testDriveRate + 4, 100);

    return { ...inMemoryAppointments[index] };
  }

  async updateServiceStatus(appointmentId, status) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = inMemoryAppointments.findIndex(app => app.id === appointmentId);
    if (index === -1) throw new Error("Không tìm thấy lịch hẹn");
    
    inMemoryAppointments[index] = {
      ...inMemoryAppointments[index],
      status: status,
      serviceStage: status === 'in_garage' ? 1 : null
    };

    return { ...inMemoryAppointments[index] };
  }

  async updateServiceStage(appointmentId, stage) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = inMemoryAppointments.findIndex(app => app.id === appointmentId);
    if (index === -1) throw new Error("Không tìm thấy lịch hẹn");

    const updatedStage = parseInt(stage, 10);
    if (updatedStage > 4) {
      inMemoryAppointments[index] = {
        ...inMemoryAppointments[index],
        status: 'done',
        serviceStage: null
      };
    } else {
      inMemoryAppointments[index] = {
        ...inMemoryAppointments[index],
        status: 'in_garage',
        serviceStage: updatedStage
      };
    }

    return { ...inMemoryAppointments[index] };
  }

  async fetchSupportTickets() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...inMemoryTickets];
  }

  async assignStaffToTicket(ticketId, staffId, staffName) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = inMemoryTickets.findIndex(t => t.id === ticketId);
    if (index === -1) throw new Error("Không tìm thấy ticket");

    inMemoryTickets[index] = {
      ...inMemoryTickets[index],
      status: 'assigned',
      assignedStaffId: staffId,
      assignedStaffName: staffName,
      internalNotes: inMemoryTickets[index].internalNotes + `\n[Log] Đã phân công cho ${staffName} xử lý.`
    };
    return { ...inMemoryTickets[index] };
  }

  async respondToTicket(ticketId, replyText) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = inMemoryTickets.findIndex(t => t.id === ticketId);
    if (index === -1) throw new Error("Không tìm thấy ticket");

    inMemoryTickets[index] = {
      ...inMemoryTickets[index],
      status: 'replied',
      replyContent: replyText,
      slaFirstResponseMinutes: 0, // Met SLA first response
      internalNotes: inMemoryTickets[index].internalNotes + `\n[Log] Đã phản hồi: "${replyText}"`
    };
    return { ...inMemoryTickets[index] };
  }

  async resolveTicket(ticketId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = inMemoryTickets.findIndex(t => t.id === ticketId);
    if (index === -1) throw new Error("Không tìm thấy ticket");

    inMemoryTickets[index] = {
      ...inMemoryTickets[index],
      status: 'resolved',
      slaResolveMinutes: 0, // Met resolve SLA
      internalNotes: inMemoryTickets[index].internalNotes + `\n[Log] Quản lý phê duyệt đóng hồ sơ.`
    };
    return { ...inMemoryTickets[index] };
  }
}

