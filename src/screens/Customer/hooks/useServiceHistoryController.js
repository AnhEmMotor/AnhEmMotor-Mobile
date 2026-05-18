import { useState, useEffect, useCallback } from 'react';
import { useDependency } from '../../../di/DependencyContext';


export function useServiceHistoryController(vehicleId) {
  const { getServiceHistoryUseCase, getUpcomingRemindersUseCase } = useDependency();
  const [history, setHistory] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadServiceData = useCallback(async () => {
    try {
      setLoading(true);
      const [historyData, remindersData] = await Promise.all([
        getServiceHistoryUseCase.execute(vehicleId),
        getUpcomingRemindersUseCase.execute(vehicleId),
      ]);
      setHistory(historyData);
      setReminders(remindersData);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử dịch vụ:', error);
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
    refreshData: loadServiceData,
  };
}
