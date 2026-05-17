import { useState } from 'react';
import { MY_VEHICLES } from '../../../constants/vehicleData';

export const useMyVehicles = () => {
  const [activeBike] = useState(MY_VEHICLES[0]);
  const [showQR, setShowQR] = useState(false);

  const openQR = () => setShowQR(true);
  const closeQR = () => setShowQR(false);

  /**
   * Chuyển đổi dữ liệu xe sở hữu sang định dạng catalog động cơ
   * và điều hướng đến màn hình chi tiết xe cao cấp.
   */
  const handleNavigateToDetail = (navigation) => {
    const motorParam = {
      id: activeBike.id,
      name: activeBike.name,
      brand: 'Honda',
      type: activeBike.type,
      price: '98.000.000đ',
      description: 'Chiếc xe ga cao cấp sở hữu động cơ eSP+ thế hệ mới cùng thiết kế sang trọng, phanh ABS an toàn tuyệt đối.',
      img: 'https://images.unsplash.com/photo-1620939511593-299312d1666c?q=80&w=2070',
      specs: [
        { label: 'Số khung', value: activeBike.vin },
        { label: 'Số máy', value: activeBike.engine },
        { label: 'Màu sắc', value: activeBike.color },
        { label: 'Phiên bản', value: activeBike.version },
        { label: 'Đăng ký lần đầu', value: activeBike.regDate },
        { label: 'Dung tích', value: activeBike.capacity },
        { label: 'Chỉ số ODO', value: activeBike.odo },
      ]
    };
    navigation.navigate('MyVehicleDetail', { bike: activeBike });
  };

  return {
    activeBike,
    showQR,
    openQR,
    closeQR,
    handleNavigateToDetail,
  };
};
