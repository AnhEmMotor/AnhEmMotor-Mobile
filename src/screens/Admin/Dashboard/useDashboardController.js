import { useState, useEffect, useCallback } from 'react';
import { useGlobalState } from '../../../context/GlobalState';
import { useDependency } from '../../../di/DependencyContext';



export function useDashboardController() {
  const { getDashboardStatsUseCase, adminRepository: repository } = useDependency();
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
