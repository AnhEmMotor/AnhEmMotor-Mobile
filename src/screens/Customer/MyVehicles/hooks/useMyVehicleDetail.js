import { useState, useEffect, useCallback } from 'react';
import { useDependency } from '../../../../di/DependencyContext';

export function useMyVehicleDetail(initialBike) {
  const { getCustomerVehicleDetailUseCase, updateCustomerVehicleUseCase } = useDependency();
  const [vehicle, setVehicle] = useState(initialBike || null);
  const [loading, setLoading] = useState(Boolean(initialBike?.id));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const loadVehicleDetail = useCallback(
    async (vehicleId) => {
      if (!vehicleId) return;
      setLoading(true);
      setError(null);
      try {
        const detail = await getCustomerVehicleDetailUseCase.execute(vehicleId);
        setVehicle((prev) => ({ ...prev, ...detail }));
      } catch (loadError) {
        console.error('Lỗi tải chi tiết xe:', loadError);
        setError(loadError?.message || 'Không thể tải chi tiết xe. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    },
    [getCustomerVehicleDetailUseCase],
  );

  useEffect(() => {
    if (initialBike?.id) {
      loadVehicleDetail(initialBike.id);
    }
  }, [initialBike?.id, loadVehicleDetail]);

  const retry = useCallback(() => {
    if (initialBike?.id) {
      loadVehicleDetail(initialBike.id);
    }
  }, [initialBike?.id, loadVehicleDetail]);

  const saveVehicle = useCallback(async (vehicleId, updates) => {
    if (!vehicleId) return null;
    setSaving(true);
    setSaveError(null);
    try {
      const updatedVehicle = await updateCustomerVehicleUseCase.execute(vehicleId, updates);
      setVehicle((prev) => ({ ...(prev || {}), ...(updatedVehicle || {}), id: vehicleId }));
      return updatedVehicle;
    } catch (saveError) {
      console.error('Lỗi cập nhật xe:', saveError);
      const message = saveError?.message || 'Không thể cập nhật thông tin xe.';
      setSaveError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, [updateCustomerVehicleUseCase]);

  return {
    vehicle,
    loading,
    error,
    retry,
    saving,
    saveError,
    saveVehicle,
  };
}
