import { useState, useEffect, useRef, useCallback } from 'react';
import { useDependency } from '../../../di/DependencyContext';

export const useMyVehicles = () => {
	const { getCustomerVehiclesUseCase, registerCustomerVehicleUseCase, getCustomerVehicleDetailUseCase } = useDependency();
	const isMountedRef = useRef(true);

	const [bikes, setBikes] = useState([]);
	const [activeBike, setActiveBike] = useState(null);
	const [showQR, setShowQR] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [registering, setRegistering] = useState(false);
	const [registerError, setRegisterError] = useState(null);

	const loadVehicles = useCallback(async () => {
		if (!isMountedRef.current) return;
		setError(null);
		try {
			const vehicles = await getCustomerVehiclesUseCase.execute();
			if (!isMountedRef.current) return;
			if (Array.isArray(vehicles) && vehicles.length > 0) {
				setBikes(vehicles);
				setActiveBike(vehicles[0]);
				try {
					const details = await getCustomerVehicleDetailUseCase.execute(vehicles[0].id);
					setActiveBike(prev => prev ? { ...prev, ...details } : prev);
				} catch (detailError) {
					console.error('Error fetching details for first vehicle:', detailError);
				}
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
	}, [getCustomerVehiclesUseCase, getCustomerVehicleDetailUseCase]);

	useEffect(() => {
		isMountedRef.current = true;
		(async () => {
			await loadVehicles();
		})();
		return () => {
			isMountedRef.current = false;
		};
	}, [loadVehicles]);

	const selectBike = async (bikeId) => {
		const found = bikes.find((b) => b.id === bikeId);
		if (found) {
			setActiveBike(found);
			try {
				const details = await getCustomerVehicleDetailUseCase.execute(bikeId);
				setActiveBike(prev => prev ? { ...prev, ...details } : prev);
			} catch (detailError) {
				console.error('Error fetching details for selected vehicle:', detailError);
			}
		}
	};

	const addNewVehicle = async (newBike) => {
		setRegistering(true);
		setRegisterError(null);

		try {
			const createdBike = await registerCustomerVehicleUseCase.execute({
				name: newBike.name?.trim() || undefined,
				phoneNumber: undefined,
				licensePlate: newBike.licensePlate,
				vin: newBike.vin || undefined,
				engineNumber: newBike.engineNumber || undefined,
				color: newBike.color || undefined,
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
