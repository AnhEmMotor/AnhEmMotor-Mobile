import { useState, useEffect, useCallback } from 'react';
import { useDependency } from '../../../di/DependencyContext';


export function useAppointmentController() {
  const {
    getAppointmentsUseCase,
    assignSaleUseCase,
    startServiceUseCase,
    advanceServiceStageUseCase,
    adminRepository: repository,
  } = useDependency();

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
