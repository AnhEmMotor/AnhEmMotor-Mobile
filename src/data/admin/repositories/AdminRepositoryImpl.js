import { IAdminRepository } from '../../../domain/admin/repositories/IAdminRepository';
import { DashboardStats } from '../../../domain/admin/entities/DashboardStats';
import { Appointment } from '../../../domain/admin/entities/Appointment';
import { Order } from '../../../domain/admin/entities/Order';
import { SupportTicket } from '../../../domain/admin/entities/SupportTicket';

export class AdminRepositoryImpl extends IAdminRepository {
  constructor(mockAdminDataSource) {
    super();
    this.dataSource = mockAdminDataSource;
  }

  async getDashboardStats() {
    const rawStats = await this.dataSource.fetchDashboardStats();
    return new DashboardStats({
      salesRevenue: rawStats.salesRevenue,
      salesCount: rawStats.salesCount,
      salesGrowth: rawStats.salesGrowth,
      newLeadsCount: rawStats.newLeadsCount,
      testDriveCount: rawStats.testDriveCount,
      testDriveRate: rawStats.testDriveRate,
      pendingPipeline: rawStats.pendingPipeline,
      targetCount: rawStats.targetCount,
    });
  }

  async getAppointments() {
    const rawList = await this.dataSource.fetchAppointments();
    return rawList.map(raw => new Appointment({
      id: raw.id,
      type: raw.type,
      timeSlot: raw.timeSlot,
      status: raw.status,
      customerName: raw.customerName,
      customerPhone: raw.customerPhone,
      vehicleName: raw.vehicleName,
      licensePlate: raw.licensePlate,
      customerRank: raw.customerRank,
      serviceRequest: raw.serviceRequest,
      assignedSaleId: raw.assignedSaleId,
      assignedSaleName: raw.assignedSaleName,
    }));
  }

  async assignSaleToAppointment(appointmentId, saleId, saleName) {
    const raw = await this.dataSource.updateAppointmentSale(appointmentId, saleId, saleName);
    return new Appointment({
      id: raw.id,
      type: raw.type,
      timeSlot: raw.timeSlot,
      status: raw.status,
      customerName: raw.customerName,
      customerPhone: raw.customerPhone,
      vehicleName: raw.vehicleName,
      licensePlate: raw.licensePlate,
      customerRank: raw.customerRank,
      serviceRequest: raw.serviceRequest,
      assignedSaleId: raw.assignedSaleId,
      assignedSaleName: raw.assignedSaleName,
    });
  }

  async startServiceRepair(appointmentId) {
    // Moves service appointment to 'in_garage'
    const raw = await this.dataSource.updateServiceStatus(appointmentId, 'in_garage');
    return new Appointment({
      id: raw.id,
      type: raw.type,
      timeSlot: raw.timeSlot,
      status: raw.status,
      customerName: raw.customerName,
      customerPhone: raw.customerPhone,
      vehicleName: raw.vehicleName,
      licensePlate: raw.licensePlate,
      customerRank: raw.customerRank,
      serviceRequest: raw.serviceRequest,
      assignedSaleId: raw.assignedSaleId,
      assignedSaleName: raw.assignedSaleName,
    });
  }

  async getSalesStaff() {
    return await this.dataSource.fetchSalesStaff();
  }

  async getOrders() {
    const rawList = await this.dataSource.fetchOrders();
    return rawList.map(raw => new Order({
      id: raw.id,
      orderCode: raw.orderCode,
      vehicleName: raw.vehicleName,
      financialStatus: raw.financialStatus,
      currentStage: raw.currentStage,
      stagesData: raw.stagesData,
      isBottlenecked: raw.isBottlenecked,
      bottleneckMessage: raw.bottleneckMessage,
      isTransporting: raw.isTransporting,
      driverName: raw.driverName,
      driverPhone: raw.driverPhone,
      etaMinutes: raw.etaMinutes,
      routePolyline: raw.routePolyline,
      driverCoordinates: raw.driverCoordinates,
    }));
  }

  async updateServiceStage(appointmentId, stage) {
    const raw = await this.dataSource.updateServiceStage(appointmentId, stage);
    return new Appointment({
      id: raw.id,
      type: raw.type,
      timeSlot: raw.timeSlot,
      status: raw.status,
      customerName: raw.customerName,
      customerPhone: raw.customerPhone,
      vehicleName: raw.vehicleName,
      licensePlate: raw.licensePlate,
      customerRank: raw.customerRank,
      serviceRequest: raw.serviceRequest,
      assignedSaleId: raw.assignedSaleId,
      assignedSaleName: raw.assignedSaleName,
      serviceStage: raw.serviceStage,
    });
  }

  async getSupportTickets() {
    const rawList = await this.dataSource.fetchSupportTickets();
    return rawList.map(raw => new SupportTicket({
      id: raw.id,
      customerName: raw.customerName,
      customerAvatar: raw.customerAvatar,
      type: raw.type,
      content: raw.content,
      createdAt: raw.createdAt,
      status: raw.status,
      assignedStaffId: raw.assignedStaffId,
      assignedStaffName: raw.assignedStaffName,
      slaFirstResponseMinutes: raw.slaFirstResponseMinutes,
      slaResolveMinutes: raw.slaResolveMinutes,
      rating: raw.rating,
      internalNotes: raw.internalNotes,
      replyContent: raw.replyContent,
    }));
  }

  async assignStaffToTicket(ticketId, staffId, staffName) {
    const raw = await this.dataSource.assignStaffToTicket(ticketId, staffId, staffName);
    return new SupportTicket({
      id: raw.id,
      customerName: raw.customerName,
      customerAvatar: raw.customerAvatar,
      type: raw.type,
      content: raw.content,
      createdAt: raw.createdAt,
      status: raw.status,
      assignedStaffId: raw.assignedStaffId,
      assignedStaffName: raw.assignedStaffName,
      slaFirstResponseMinutes: raw.slaFirstResponseMinutes,
      slaResolveMinutes: raw.slaResolveMinutes,
      rating: raw.rating,
      internalNotes: raw.internalNotes,
      replyContent: raw.replyContent,
    });
  }

  async respondToTicket(ticketId, replyText) {
    const raw = await this.dataSource.respondToTicket(ticketId, replyText);
    return new SupportTicket({
      id: raw.id,
      customerName: raw.customerName,
      customerAvatar: raw.customerAvatar,
      type: raw.type,
      content: raw.content,
      createdAt: raw.createdAt,
      status: raw.status,
      assignedStaffId: raw.assignedStaffId,
      assignedStaffName: raw.assignedStaffName,
      slaFirstResponseMinutes: raw.slaFirstResponseMinutes,
      slaResolveMinutes: raw.slaResolveMinutes,
      rating: raw.rating,
      internalNotes: raw.internalNotes,
      replyContent: raw.replyContent,
    });
  }

  async resolveTicket(ticketId) {
    const raw = await this.dataSource.resolveTicket(ticketId);
    return new SupportTicket({
      id: raw.id,
      customerName: raw.customerName,
      customerAvatar: raw.customerAvatar,
      type: raw.type,
      content: raw.content,
      createdAt: raw.createdAt,
      status: raw.status,
      assignedStaffId: raw.assignedStaffId,
      assignedStaffName: raw.assignedStaffName,
      slaFirstResponseMinutes: raw.slaFirstResponseMinutes,
      slaResolveMinutes: raw.slaResolveMinutes,
      rating: raw.rating,
      internalNotes: raw.internalNotes,
      replyContent: raw.replyContent,
    });
  }
}

