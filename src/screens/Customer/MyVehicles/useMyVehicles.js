import { useState, useEffect } from 'react';
import { MockCustomerDataSource } from '../../../data/customer/datasources/MockCustomerDataSource';
import { CustomerRepositoryImpl } from '../../../data/customer/repositories/CustomerRepositoryImpl';
import { GetCustomerVehicles } from '../../../domain/customer/usecases/GetCustomerVehicles';

// Instantiate dependencies once
const dataSource = new MockCustomerDataSource();
const repository = new CustomerRepositoryImpl(dataSource);
const getCustomerVehiclesUseCase = new GetCustomerVehicles(repository);

export const useMyVehicles = () => {
  const [bikes, setBikes] = useState([]);
  const [activeBike, setActiveBike] = useState(null);
  const [showQR, setShowQR] = useState(false);

  // Load the customer's vehicles list asynchronously via Use Case
  useEffect(() => {
    let isMounted = true;
    const fetchVehicles = async () => {
      try {
        const vehicles = await getCustomerVehiclesUseCase.execute();
        if (vehicles && vehicles.length > 0 && isMounted) {
          setBikes(vehicles);
          setActiveBike(vehicles[0]);
        }
      } catch (error) {
        console.error('Error fetching vehicles via Clean Architecture:', error);
      }
    };
    fetchVehicles();
    return () => { isMounted = false; };
  }, []);

  /**
   * Switch the active vehicle displayed on screen
   */
  const selectBike = (bikeId) => {
    const found = bikes.find(b => b.id === bikeId);
    if (found) {
      setActiveBike(found);
    }
  };

  /**
   * Add a new vehicle dynamically to the list and set it as active
   */
  const addNewVehicle = (newBike) => {
    const createdBike = {
      id: String(bikes.length + 1),
      name: newBike.name || 'Honda Vario 160',
      plate: newBike.plate || '60-B1 999.99',
      vin: newBike.vin || 'VR160-2026-VNBK777',
      engine: newBike.engine || 'ESP-PLUS-8888',
      color: newBike.color || 'Đen Nhám',
      type: newBike.type || 'Scooter',
      version: newBike.version || 'Thể thao (ABS)',
      capacity: newBike.capacity || '156.9 cc',
      regDate: newBike.regDate || '18/05/2026',
      status: 'Hoạt động tốt',
      odo: '0 km',
      warrantyUntil: '2030-05-18',
      warrantyFrom: '2026-05-18',
      insuranceUntil: '2027-05-18',
      operatingSpecs: {
        oil: '10W-30 Full Synthetic',
        tirePressure: '2.0 bar (Trước) / 2.25 bar (Sau)',
      },
      nextService: {
        odo: '1,000 km',
        date: '18/06/2026',
        items: ['Thay nhớt chạy roda', 'Kiểm tra ốc vít', 'Vệ sinh nồi'],
      },
      timeline: [
        {
          id: `new-t-${Date.now()}`,
          date: '18/05/2026',
          type: 'Đăng ký mới',
          desc: 'Xe mới đã được đăng ký thành công vào hệ thống AnhEmMotor. Đang trong giai đoạn roda 1.000km đầu tiên.',
          km: '0 km',
          price: 'Miễn phí',
        },
      ],
    };

    const updatedBikes = [...bikes, createdBike];
    setBikes(updatedBikes);
    setActiveBike(createdBike);
  };

  // Safe fallback to prevent initial render crash/glitch before the async load completes
  const fallbackBike = {
    id: '1',
    name: 'Honda SH 125i',
    plate: '60-A1 555.55',
    vin: 'SH125-2024-VNBK888',
    engine: 'ESP-PLUS-9999',
    color: 'Trắng Ngọc Trai',
    type: 'Scooter',
    version: 'Cao cấp (ABS)',
    capacity: '124.8 cc',
    regDate: '15/05/2024',
    status: 'Hoạt động tốt',
    odo: '12,500 km',
    warrantyUntil: '2028-05-15',
    warrantyFrom: '2026-05-15',
    insuranceUntil: '2027-05-20',
    operatingSpecs: {
      oil: '10W-30 Full Synthetic',
      tirePressure: '2.0 bar (Trước) / 2.25 bar (Sau)',
    },
    nextService: {
      odo: '18,200 km',
      date: '15/08/2026',
      items: ['Thay nhớt máy', 'Kiểm tra nước làm mát', 'Vệ sinh nồi'],
    },
    timeline: [
      {
        id: 't1',
        date: '10/01/2026',
        type: 'Bảo trì định kỳ',
        desc: 'Thay nhớt Motul, lọc gió, kiểm tra phanh và vệ sinh nhông sên dĩa.',
        km: '12,500 km',
        price: '1.250.000đ',
      },
      {
        id: 't2',
        date: '15/08/2025',
        type: 'Sửa chữa',
        desc: 'Thay lốp sau Michelin City Grip 2 do bị vật nhọn đâm thủng.',
        km: '8,200 km',
        price: '1.850.000đ',
      },
    ],
  };

  const currentBike = activeBike || fallbackBike;
  const currentBikes = bikes.length > 0 ? bikes : [fallbackBike];

  const openQR = () => setShowQR(true);
  const closeQR = () => setShowQR(false);

  const handleNavigateToDetail = (navigation) => {
    navigation.navigate('MyVehicleDetail', { bike: currentBike });
  };

  return {
    bikes: currentBikes,
    activeBike: currentBike,
    showQR,
    openQR,
    closeQR,
    selectBike,
    addNewVehicle,
    handleNavigateToDetail,
  };
};
