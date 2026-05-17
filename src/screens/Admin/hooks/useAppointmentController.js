import { useState, useEffect, useCallback } from 'react';
import { MockAdminDataSource } from '../../../data/admin/datasources/MockAdminDataSource';
import { AdminRepositoryImpl } from '../../../data/admin/repositories/AdminRepositoryImpl';
import { GetAppointments } from '../../../domain/admin/usecases/GetAppointments';
import { AssignSaleToAppointment } from '../../../domain/admin/usecases/AssignSaleToAppointment';
import { StartServiceRepair } from '../../../domain/admin/usecases/StartServiceRepair';
import { UpdateServiceStage } from '../../../domain/admin/usecases/UpdateServiceStage';

// Instantiate dependencies
const dataSource = new MockAdminDataSource();
const repository = new AdminRepositoryImpl(dataSource);
const getAppointmentsUseCase = new GetAppointments(repository);
const assignSaleUseCase = new AssignSaleToAppointment(repository);
const startServiceUseCase = new StartServiceRepair(repository);
const advanceServiceStageUseCase = new UpdateServiceStage(repository);

export function useAppointmentController() {
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('test_drive'); // 'test_drive' or 'service'

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const [list, staffList] = await Promise.all([
        getAppointmentsUseCase.execute(),
        repository.getSalesStaff()
      ]);
      setAppointments(list);
      setStaff(staffList);
    } catch (error) {
      console.error("Lỗi khi tải danh sách lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleAssignSale = async (appointmentId, saleId, saleName) => {
    try {
      const updated = await assignSaleUseCase.execute(appointmentId, saleId, saleName);
      setAppointments(prev => prev.map(app => app.id === appointmentId ? updated : app));
      return updated;
    } catch (error) {
      console.error("Lỗi khi chỉ định Sale:", error);
      throw error;
    }
  };

  const handleStartService = async (appointmentId) => {
    try {
      const updated = await startServiceUseCase.execute(appointmentId);
      setAppointments(prev => prev.map(app => app.id === appointmentId ? updated : app));
      return updated;
    } catch (error) {
      console.error("Lỗi khi cho xe vào xưởng:", error);
      throw error;
    }
  };

  const handleAdvanceServiceStage = async (appointmentId, currentStage) => {
    try {
      const nextStage = (currentStage || 1) + 1;
      const updated = await advanceServiceStageUseCase.execute(appointmentId, nextStage);
      setAppointments(prev => prev.map(app => app.id === appointmentId ? updated : app));
      return updated;
    } catch (error) {
      console.error("Lỗi khi cập nhật tiến cấp chặng dịch vụ:", error);
      throw error;
    }
  };

  // Get only filtered appointments based on current active tab
  const getFilteredAppointments = () => {
    return appointments.filter(app => app.type === activeTab);
  };

  return {
    appointments: getFilteredAppointments(),
    allAppointments: appointments,
    staff,
    loading,
    activeTab,
    setActiveTab,
    assignSale: handleAssignSale,
    startService: handleStartService,
    advanceStage: handleAdvanceServiceStage,
    refreshAppointments: loadAppointments,
  };
}
