import { ApiCustomerDataSource } from '../data/customer/datasources/ApiCustomerDataSource';
import { ProfileRepositoryImpl } from '../features/profile/data/repositories/ProfileRepositoryImpl';
import { GetProfileUseCase } from '../features/profile/domain/usecases/GetProfileUseCase';
import { UpdateProfileUseCase } from '../features/profile/domain/usecases/UpdateProfileUseCase';
import { UpdateSettingsUseCase } from '../features/profile/domain/usecases/UpdateSettingsUseCase';
import { UploadAvatarUseCase } from '../features/profile/domain/usecases/UploadAvatarUseCase';
import { CustomerRepositoryImpl } from '../data/customer/repositories/CustomerRepositoryImpl';
import { GetCustomerVehicles } from '../domain/customer/usecases/GetCustomerVehicles';
import { GetCustomerVehicleDetail } from '../domain/customer/usecases/GetCustomerVehicleDetail';
import { GetServiceHistory } from '../domain/customer/usecases/GetServiceHistory';
import { GetUpcomingReminders } from '../domain/customer/usecases/GetUpcomingReminders';
import { RegisterCustomerVehicle } from '../domain/customer/usecases/RegisterCustomerVehicle';
import { UpdateCustomerVehicle } from '../domain/customer/usecases/UpdateCustomerVehicle';

class DependencyContainer {
  constructor() {
    this.customerDataSource = new ApiCustomerDataSource();
    this.customerRepository = new CustomerRepositoryImpl(this.customerDataSource);
    this.getCustomerVehiclesUseCase = new GetCustomerVehicles(this.customerRepository);
    this.getCustomerVehicleDetailUseCase = new GetCustomerVehicleDetail(this.customerRepository);
    this.getServiceHistoryUseCase = new GetServiceHistory(this.customerRepository);
    this.getUpcomingRemindersUseCase = new GetUpcomingReminders(this.customerRepository);
    this.registerCustomerVehicleUseCase = new RegisterCustomerVehicle(this.customerRepository);
    this.updateCustomerVehicleUseCase = new UpdateCustomerVehicle(this.customerRepository);

    this.profileRepository = new ProfileRepositoryImpl();
    this.getProfileUseCase = new GetProfileUseCase(this.profileRepository);
    this.updateProfileUseCase = new UpdateProfileUseCase(this.profileRepository);
    this.updateSettingsUseCase = new UpdateSettingsUseCase(this.profileRepository);
    this.uploadAvatarUseCase = new UploadAvatarUseCase(this.profileRepository);
  }
}

export const container = new DependencyContainer();
