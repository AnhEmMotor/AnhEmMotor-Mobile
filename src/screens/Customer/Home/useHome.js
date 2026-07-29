import { useState, useRef, useEffect } from 'react';
import { useGlobalState } from '../../../context/GlobalState';
import { ProfileLocalDataSource } from '../../../features/profile/data/datasources/ProfileLocalDataSource';

export const useHome = () => {
  const { unreadNotifications } = useGlobalState();
  const [vehicleStatus] = useState('has_vehicle');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const bottomSheetRef = useRef(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const dataSource = new ProfileLocalDataSource();
      const profile = await dataSource.getProfile();
      if (profile && profile.name) {
        setUserName(profile.getFormattedName());
      } else {
        setUserName('Khách hàng');
      }
    };
    fetchProfile();
  }, []);

  const handleOpenVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    // Sử dụng setTimeout 50ms để đợi component BottomSheet render gắn ref xong rồi mới show
    setTimeout(() => {
      bottomSheetRef.current?.show();
    }, 50);
  };

  const handleCloseVoucher = () => {
    setSelectedVoucher(null);
  };

  return {
    unreadNotifications,
    vehicleStatus,
    selectedVoucher,
    bottomSheetRef,
    userName,
    handleOpenVoucher,
    handleCloseVoucher,
  };
};

export const shortcuts = [
  // icons are passed as components, so we can't define them here without imports
  // I'll keep them in the main component or import them here
];
