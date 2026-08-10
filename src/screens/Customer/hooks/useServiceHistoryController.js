import { useState, useEffect, useCallback } from 'react';
import { useDependency } from '../../../di/DependencyContext';

export function useServiceHistoryController(vehicleId) {
  const { getServiceHistoryUseCase, getUpcomingRemindersUseCase } = useDependency();
  const [history, setHistory] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadServiceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [historyData, remindersData] = await Promise.all([
        getServiceHistoryUseCase.execute(vehicleId),
        getUpcomingRemindersUseCase.execute(vehicleId),
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
  }, [vehicleId, getServiceHistoryUseCase, getUpcomingRemindersUseCase]);

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
    refreshData: loadServiceData,
  };
}
