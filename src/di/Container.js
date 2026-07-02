import { MockCustomerDataSource } from '../data/customer/datasources/MockCustomerDataSource';
import { CustomerRepositoryImpl } from '../data/customer/repositories/CustomerRepositoryImpl';
import { GetCustomerVehicles } from '../domain/customer/usecases/GetCustomerVehicles';
import { GetServiceHistory } from '../domain/customer/usecases/GetServiceHistory';
import { GetUpcomingReminders } from '../domain/customer/usecases/GetUpcomingReminders';

import { MockAdminDataSource } from '../data/admin/datasources/MockAdminDataSource';
import { AdminRepositoryImpl } from '../data/admin/repositories/AdminRepositoryImpl';
import { GetAppointments } from '../domain/admin/usecases/GetAppointments';
import { AssignSaleToAppointment } from '../domain/admin/usecases/AssignSaleToAppointment';
import { StartServiceRepair } from '../domain/admin/usecases/StartServiceRepair';
import { UpdateServiceStage } from '../domain/admin/usecases/UpdateServiceStage';
import { GetSupportTickets } from '../domain/admin/usecases/GetSupportTickets';
import { AssignStaffToTicket } from '../domain/admin/usecases/AssignStaffToTicket';
import { RespondToTicket } from '../domain/admin/usecases/RespondToTicket';
import { ResolveTicket } from '../domain/admin/usecases/ResolveTicket';
import { GetOrders } from '../domain/admin/usecases/GetOrders';
import { GetDashboardStats } from '../domain/admin/usecases/GetDashboardStats';

import { ProfileRepositoryImpl } from '../features/profile/data/repositories/ProfileRepositoryImpl';
import { GetProfileUseCase } from '../features/profile/domain/usecases/GetProfileUseCase';
import { UpdateProfileUseCase } from '../features/profile/domain/usecases/UpdateProfileUseCase';
import { UpdateSettingsUseCase } from '../features/profile/domain/usecases/UpdateSettingsUseCase';
import { UploadAvatarUseCase } from '../features/profile/domain/usecases/UploadAvatarUseCase';

class DependencyContainer {
  constructor() {
    // -------------------------------------------------------------
    // 1. CUSTOMER FEATURE
    // -------------------------------------------------------------
    this.customerDataSource = new MockCustomerDataSource();
    this.customerRepository = new CustomerRepositoryImpl(this.customerDataSource);
    this.getCustomerVehiclesUseCase = new GetCustomerVehicles(this.customerRepository);
    this.getServiceHistoryUseCase = new GetServiceHistory(this.customerRepository);
    this.getUpcomingRemindersUseCase = new GetUpcomingReminders(this.customerRepository);

    // -------------------------------------------------------------
    // 2. ADMIN FEATURE
    // -------------------------------------------------------------
    this.adminDataSource = new MockAdminDataSource();
    this.adminRepository = new AdminRepositoryImpl(this.adminDataSource);
    this.getAppointmentsUseCase = new GetAppointments(this.adminRepository);
    this.assignSaleUseCase = new AssignSaleToAppointment(this.adminRepository);
    this.startServiceUseCase = new StartServiceRepair(this.adminRepository);
    this.advanceServiceStageUseCase = new UpdateServiceStage(this.adminRepository);
    this.getSupportTicketsUseCase = new GetSupportTickets(this.adminRepository);
    this.assignStaffUseCase = new AssignStaffToTicket(this.adminRepository);
    this.respondToTicketUseCase = new RespondToTicket(this.adminRepository);
    this.resolveTicketUseCase = new ResolveTicket(this.adminRepository);
    this.getOrdersUseCase = new GetOrders(this.adminRepository);
    this.getDashboardStatsUseCase = new GetDashboardStats(this.adminRepository);

    // -------------------------------------------------------------
    // 3. PROFILE FEATURE
    // -------------------------------------------------------------
    this.profileRepository = new ProfileRepositoryImpl();
    this.getProfileUseCase = new GetProfileUseCase(this.profileRepository);
    this.updateProfileUseCase = new UpdateProfileUseCase(this.profileRepository);
    this.updateSettingsUseCase = new UpdateSettingsUseCase(this.profileRepository);
    this.uploadAvatarUseCase = new UploadAvatarUseCase(this.profileRepository);
  }
}

export const container = new DependencyContainer();
