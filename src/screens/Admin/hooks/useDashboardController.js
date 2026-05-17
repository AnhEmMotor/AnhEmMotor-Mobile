import { useState, useEffect, useCallback } from 'react';
import { MockAdminDataSource } from '../../../data/admin/datasources/MockAdminDataSource';
import { AdminRepositoryImpl } from '../../../data/admin/repositories/AdminRepositoryImpl';
import { GetDashboardStats } from '../../../domain/admin/usecases/GetDashboardStats';
import { useGlobalState } from '../../../context/GlobalState';

// Instantiate dependencies once
const dataSource = new MockAdminDataSource();
const repository = new AdminRepositoryImpl(dataSource);
const getDashboardStatsUseCase = new GetDashboardStats(repository);

export function useDashboardController() {
  const [stats, setStats] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setIsDataSyncing } = useGlobalState();

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setIsDataSyncing(true);
      
      const [statsData, staffData] = await Promise.all([
        getDashboardStatsUseCase.execute(),
        repository.getSalesStaff(),
      ]);

      setStats(statsData);
      setStaff(staffData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
      setIsDataSyncing(false);
    }
  }, [setIsDataSyncing]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    stats,
    staff,
    loading,
    refreshData: loadDashboardData,
  };
}
