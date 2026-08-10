import { useState, useEffect, useMemo } from 'react';
import { ProductDataSource } from '../../../data/product/datasources/ProductDataSource';

export const useProductList = (route) => {
  const { brand = 'Tất cả', type = 'Tất cả' } = route?.params || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await ProductDataSource.fetchCatalogProducts();
        const list = data.items || [];

        if (isMounted) {
          setProducts(list);
        }
      } catch (error) {
        console.warn('Failed to fetch products from backend:', error);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return (Array.isArray(products) ? products : []).filter((motor) => {
      const motorBrand = motor.brandName || motor.brand || '';
      const motorType = motor.typeName || motor.type || '';
      const matchesBrand = brand === 'Tất cả' || motorBrand === brand;
      const matchesType = type === 'Tất cả' || motorType === type;
      return matchesBrand && matchesType;
    });
  }, [products, brand, type]);

  return { brand, type, filteredProducts, loading };
};
