import { useState } from 'react';
import { MY_VEHICLES } from '../../../constants/vehicleData';

export const useMyVehicles = () => {
  const [activeBike] = useState(MY_VEHICLES[0]);
  const [showQR, setShowQR] = useState(false);

  const openQR = () => setShowQR(true);
  const closeQR = () => setShowQR(false);

  return {
    activeBike,
    showQR,
    openQR,
    closeQR,
  };
};
