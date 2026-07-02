import { useMemo } from 'react';
import { MOCK_MOTORS } from '../../../constants/MockData';

export const useProductList = (route) => {
  const { brand, type } = route.params || {};

  const filteredProducts = useMemo(() => {
    return MOCK_MOTORS.filter(motor => {
      const matchesBrand = brand === 'Tất cả' || motor.brand === brand;
      const matchesType = type === 'Tất cả' || motor.type === type;
      return matchesBrand && matchesType;
    });
  }, [brand, type]);

  return {
    brand,
    type,
    filteredProducts
  };
};
