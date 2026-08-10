import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getBrandsApi } from '../../../api/customerApi';
import { ProductDataSource } from '../../../data/product/datasources/ProductDataSource';

const CATEGORIES = [
  { id: 8, name: 'Xe máy' },
  { id: 13, name: 'Phụ tùng' },
  { id: 12, name: 'Phụ kiện' },
];

export const useCatalog = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(8);
  const [activeBrandId, setActiveBrandId] = useState(null);
  const [sortBy, setSortBy] = useState('Newest');

  const initialized = useRef(false);

  const loadProducts = useCallback(
    async (categoryId) => {
      try {
        setLoading(true);
        setFetchError(null);
        const data = await ProductDataSource.fetchCatalogProducts(searchQuery, categoryId);
        setProducts(data.items || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
        setFetchError(error.message || 'Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    },
    [searchQuery]
  );

  const loadBrands = useCallback(async () => {
    try {
      const data = await getBrandsApi();
      setBrands(Array.isArray(data) ? data : []);
    } catch {
      setBrands([]);
    }
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      loadProducts(activeCategoryId);
      loadBrands();
    }
  }, [loadProducts, loadBrands, activeCategoryId]);

  useEffect(() => {
    if (initialized.current) {
      loadProducts(activeCategoryId);
    }
  }, [searchQuery, activeCategoryId, loadProducts]);

  const filteredMotors = useMemo(() => {
    let list = products;

    if (activeBrandId !== null) {
      list = list.filter((p) => {
        if (typeof activeBrandId === 'number') {
          return p.brandId === activeBrandId;
        }
        return p.brandName === activeBrandId;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const haystack = `${p.name} ${p.brandName || ''} ${p.categoryName || ''}`.toLowerCase();
        return haystack.includes(q);
      });
    }

    if (sortBy === 'PriceAsc') {
      list = [...list].sort((a, b) => (a.referencePrice ?? 0) - (b.referencePrice ?? 0));
    } else if (sortBy === 'PriceDesc') {
      list = [...list].sort((a, b) => (b.referencePrice ?? 0) - (a.referencePrice ?? 0));
    }

    return list;
  }, [products, activeBrandId, searchQuery, sortBy]);

  return {
    loading,
    fetchError,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    CATEGORIES,
    BRANDS: brands,
    activeCategoryId,
    setActiveCategoryId,
    activeBrandId,
    setActiveBrandId,
    filteredMotors,
    refreshProducts: () => loadProducts(activeCategoryId),
  };
};
