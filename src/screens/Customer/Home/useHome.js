import { useState, useRef } from 'react';
import { useGlobalState } from '../../../context/GlobalState';

export const useHome = () => {
  const { unreadNotifications } = useGlobalState();
  const [vehicleStatus] = useState('has_vehicle');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const bottomSheetRef = useRef(null);

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
    handleOpenVoucher,
    handleCloseVoucher,
  };
};

export const shortcuts = [
  // icons are passed as components, so we can't define them here without imports
  // I'll keep them in the main component or import them here
];
