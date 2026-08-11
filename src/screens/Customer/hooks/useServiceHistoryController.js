import { useState, useEffect, useCallback } from 'react';
import { useDependency } from '../../../di/DependencyContext';

export function useServiceHistoryController(initialVehicleId) {
  const { getServiceHistoryUseCase, getUpcomingRemindersUseCase, getCustomerVehiclesUseCase } = useDependency();
  const [history, setHistory] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadServiceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let targetVehicleId = initialVehicleId;

      if (!targetVehicleId) {
        const vehicles = await getCustomerVehiclesUseCase.execute();
        if (!vehicles || vehicles.length === 0) {
          throw new Error('Bạn chưa có xe nào để xem lịch sử.');
        }
        targetVehicleId = vehicles[0].id;
        setActiveVehicle(vehicles[0]);
      }

      const [historyData, remindersData] = await Promise.all([
        getServiceHistoryUseCase.execute(targetVehicleId),
        getUpcomingRemindersUseCase.execute(targetVehicleId),
      ]);
      console.log('HISTORY DATA RETURNED:', historyData);

      if (historyData && historyData.error) {
        throw new Error(historyData.error.message);
      }

      setHistory(historyData);
      setReminders(remindersData);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử dịch vụ:', error);
      setError(error?.message || 'Không thể tải dữ liệu lịch sử dịch vụ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [initialVehicleId, getServiceHistoryUseCase, getUpcomingRemindersUseCase, getCustomerVehiclesUseCase]);

  useEffect(() => {
    const init = async () => {
      await loadServiceData();
    };
    init();
  }, [loadServiceData]);

  return {
    history,
    reminders,
    loading,
    error,
    activeVehicle,
    refreshData: loadServiceData,
  };
}
