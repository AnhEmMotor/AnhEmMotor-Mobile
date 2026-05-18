import { useState, useEffect, useCallback } from 'react';
import { MockCustomerDataSource } from '../../../data/customer/datasources/MockCustomerDataSource';
import { CustomerRepositoryImpl } from '../../../data/customer/repositories/CustomerRepositoryImpl';
import { GetServiceHistory } from '../../../domain/customer/usecases/GetServiceHistory';
import { GetUpcomingReminders } from '../../../domain/customer/usecases/GetUpcomingReminders';

// Instantiate dependencies once
const dataSource = new MockCustomerDataSource();
const repository = new CustomerRepositoryImpl(dataSource);
const getServiceHistoryUseCase = new GetServiceHistory(repository);
const getUpcomingRemindersUseCase = new GetUpcomingReminders(repository);

export function useServiceHistoryController(vehicleId) {
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
