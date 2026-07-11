import { useState, useEffect, useRef } from 'react';
import { useDependency } from '../../../di/DependencyContext';

export const useMyVehicles = () => {
  const { getCustomerVehiclesUseCase, registerCustomerVehicleUseCase } = useDependency();
  const isMountedRef = useRef(true);

  const [bikes, setBikes] = useState([]);
  const [activeBike, setActiveBike] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  const loadVehicles = async () => {
    if (!isMountedRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const vehicles = await getCustomerVehiclesUseCase.execute();
      if (!isMountedRef.current) return;
      if (Array.isArray(vehicles) && vehicles.length > 0) {
        setBikes(vehicles);
        setActiveBike(vehicles[0]);
      } else {
        setBikes([]);
        setActiveBike(null);
      }
    } catch (fetchError) {
      if (!isMountedRef.current) return;
      console.error('Error fetching vehicles via Clean Architecture:', fetchError);
      setError(fetchError?.message || 'Không thể tải danh sách xe. Vui lòng thử lại.');
      setBikes([]);
      setActiveBike(null);
    } finally {
      if (!isMountedRef.current) return;
      setLoading(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    loadVehicles();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Switch the active vehicle displayed on screen
   */
  const selectBike = (bikeId) => {
    const found = bikes.find((b) => b.id === bikeId);
    if (found) {
      setActiveBike(found);
    }
  };

  /**
   * Register a new vehicle through backend API and set it as active
   */
  const addNewVehicle = async (newBike) => {
    setRegistering(true);
    setRegisterError(null);

    try {
      const createdBike = await registerCustomerVehicleUseCase.execute({
        licensePlate: newBike.plate,
        vinNumber: newBike.vin,
        engineNumber: newBike.engine,
        color: newBike.color,
        purchaseDate: newBike.purchaseDate,
        warrantyDate: newBike.warrantyDate,
        currentOdo: newBike.currentOdo != null ? Number(newBike.currentOdo) : 0,
      });

      if (!createdBike) {
        throw new Error('Không nhận được dữ liệu xe sau khi đăng ký.');
      }

      const registeredBike = {
        ...createdBike,
        name: newBike.name?.trim() || createdBike.name,
      };

      const updatedBikes = [...bikes, registeredBike];
      setBikes(updatedBikes);
      setActiveBike(registeredBike);
      return registeredBike;
    } catch (registrationError) {
      if (!isMountedRef.current) return;
      console.error('Error registering new vehicle via backend:', registrationError);
      const message = registrationError?.message || 'Không thể đăng ký xe. Vui lòng thử lại.';
      setRegisterError(message);
      throw new Error(message);
    } finally {
      if (!isMountedRef.current) return;
      setRegistering(false);
    }
  };

  const hasVehicles = bikes.length > 0;
  const openQR = () => setShowQR(true);
  const closeQR = () => setShowQR(false);

  const handleNavigateToDetail = (navigation) => {
    if (!activeBike) return;
    navigation.navigate('MyVehicleDetail', { bike: activeBike });
  };

  return {
    bikes,
    activeBike,
    showQR,
    openQR,
    closeQR,
    selectBike,
    addNewVehicle,
    registering,
    registerError,
    handleNavigateToDetail,
    loading,
    error,
    hasVehicles,
    retryLoadVehicles: loadVehicles,
  };
};
