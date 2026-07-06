import { useState, useEffect, useCallback } from 'react';
import { useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useDependency } from '../../../di/DependencyContext';
import { verticalScale } from '../../../utils/responsive';
import { getProductsApi } from '../../../api/customerApi';

export const useCatalog = () => {
  const { api } = useDependency();
  const [loading, setLoading] = useState(true);
  const [quoteModal, setQuoteModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedMotor, setSelectedMotor] = useState(null);
  const [quotePhone, setQuotePhone] = useState('');
  const [aiScanning, setAiScanning] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [activeBrand, setActiveBrand] = useState('Tất cả');
  const [activeType, setActiveType] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [products, setProducts] = useState([]);

  const scanPos = useSharedValue(0);

  const BRANDS = [
    { name: 'Tất cả', image: 'https://cdn-icons-png.flaticon.com/512/3089/3089918.png' },
    { name: 'Honda', image: 'https://logos-world.net/wp-content/uploads/2020/04/Honda-Logo.png' },
    { name: 'Yamaha', image: 'https://logos-world.net/wp-content/uploads/2020/04/Yamaha-Logo.png' },
    { name: 'VinFast', image: 'https://seeklogo.com/images/V/vinfast-logo-5D19A801D3-seeklogo.com.png' },
    { name: 'Piaggio', image: 'https://logos-world.net/wp-content/uploads/2021/08/Piaggio-Logo.png' },
    { name: 'Suzuki', image: 'https://logos-world.net/wp-content/uploads/2020/04/Suzuki-Logo.png' },
    { name: 'Sym', image: 'https://seeklogo.com/images/S/sym-logo-E722C1A1A8-seeklogo.com.png' },
  ];

  const MOTOR_TYPES = [
    { name: 'Tất cả', image: 'https://cdn-icons-png.flaticon.com/512/3089/3089918.png' },
    { name: 'Xe số', image: 'https://cdn-icons-png.flaticon.com/512/3362/3362028.png' },
    { name: 'Xe tay ga', image: 'https://cdn-icons-png.flaticon.com/512/3362/3362029.png' },
    { name: 'Xe Điện', image: 'https://cdn-icons-png.flaticon.com/512/10573/10573426.png' },
    { name: 'Xe phân khối lớn', image: 'https://cdn-icons-png.flaticon.com/512/3362/3362024.png' },
    { name: 'Xe côn tay', image: 'https://cdn-icons-png.flaticon.com/512/3362/3362025.png' },
  ];

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProductsApi();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    scanPos.value = withRepeat(withTiming(verticalScale(250), { duration: 2000 }), -1, true);
    return () => clearTimeout(timer);
  }, [scanPos]);

  const filteredMotors = products.filter((motor) => {
    const product = motor.productName || motor.name || '';
    const category = motor.categoryName || motor.category || '';
    const brand = motor.brandName || motor.brand || '';
    const type = motor.typeName || motor.type || '';

    const matchesCategory = activeCategory === 'Tất cả' || category === activeCategory;
    const matchesBrand = activeBrand === 'Tất cả' || brand === activeBrand;
    const matchesType = activeType === 'Tất cả' || type === activeType;
    const matchesSearch = product.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesType && matchesSearch;
  });

  const openQuote = (motor) => { setSelectedMotor(motor); setQuoteModal(true); };
  const closeQuote = () => { setQuoteModal(false); setQuotePhone(''); };

  const handleAiSearch = () => {
    setAiScanning(true);
    setTimeout(() => setAiScanning(false), 3000);
  };

  return {
    loading, quoteModal, filterModal, selectedMotor, quotePhone, setQuotePhone,
    aiScanning, activeCategory, setActiveCategory, activeBrand, setActiveBrand,
    activeType, setActiveType, searchQuery, setSearchQuery, sortBy, setSortBy,
    scanPos, BRANDS, MOTOR_TYPES, filteredMotors, openQuote, closeQuote,
    handleAiSearch, setFilterModal, refreshProducts: loadProducts,
  };
};
