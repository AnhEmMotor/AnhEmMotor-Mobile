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
      setHistory(historyData);
      setReminders(remindersData);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử dịch vụ:', error);
      setError(error?.message || 'Không thể tải dữ liệu lịch sử dịch vụ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    loadServiceData();
  }, [loadServiceData]);

  return {
    history,
    reminders,
    loading,
    error,
    refreshData: loadServiceData,
  };
}
