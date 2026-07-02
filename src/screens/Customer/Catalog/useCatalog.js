import { useState, useEffect } from 'react';
import { MOCK_MOTORS } from '../../../constants/MockData';
import { useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { verticalScale } from '../../../utils/responsive';

export const useCatalog = () => {
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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    scanPos.value = withRepeat(withTiming(verticalScale(250), { duration: 2000 }), -1, true);
    return () => clearTimeout(timer);
  }, []);

  const openQuote = (motor) => { setSelectedMotor(motor); setQuoteModal(true); };
  const closeQuote = () => { setQuoteModal(false); setQuotePhone(''); };

  const handleAiSearch = () => {
    setAiScanning(true);
    setTimeout(() => setAiScanning(false), 3000);
  };

  const filteredMotors = MOCK_MOTORS.filter(motor => {
    const matchesCategory = activeCategory === 'Tất cả' || motor.category === activeCategory;
    const matchesBrand = activeBrand === 'Tất cả' || motor.brand === activeBrand;
    const matchesType = activeType === 'Tất cả' || motor.type === activeType;
    const matchesSearch = motor.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesType && matchesSearch;
  });

  return {
    loading,
    quoteModal,
    filterModal,
    selectedMotor,
    quotePhone,
    setQuotePhone,
    aiScanning,
    activeCategory,
    setActiveCategory,
    activeBrand,
    setActiveBrand,
    activeType,
    setActiveType,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    scanPos,
    BRANDS,
    MOTOR_TYPES,
    filteredMotors,
    openQuote,
    closeQuote,
    handleAiSearch,
    setFilterModal,
  };
};
