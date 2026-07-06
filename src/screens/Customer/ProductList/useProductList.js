import { useState, useEffect, useMemo } from 'react';
import { getProductsApi } from '../../../api/customerApi';

export const useProductList = (route) => {
  const { brand, type } = route.params || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsApi();
        const list = Array.isArray(data) ? data : [];
        setProducts(list);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((motor) => {
      const motorBrand = motor.brandName || motor.brand || '';
      const motorType = motor.typeName || motor.type || '';
      const matchesBrand = brand === 'Tất cả' || motorBrand === brand;
      const matchesType = type === 'Tất cả' || motorType === type;
      return matchesBrand && matchesType;
    });
  }, [products, brand, type]);

  return { brand, type, filteredProducts, loading };
};
