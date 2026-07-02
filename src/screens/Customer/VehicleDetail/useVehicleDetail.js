import { useState, useRef, useMemo } from 'react';
import { verticalScale } from '../../../utils/responsive';

export const useVehicleDetail = (motor, initialColor) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedColor, setSelectedColor] = useState(initialColor || motor?.colors?.[0]?.id || 'default');
  const [rotationIndex, setRotationIndex] = useState(0);
  
  // Finance State
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [loanTerm, setLoanTerm] = useState(12);
  
  const lastX = useRef(0);
  const motorFrames = motor?.frames || [motor?.img];

  const handleTouchStart = (e) => {
    lastX.current = e.nativeEvent.pageX;
  };

  const handleTouchMove = (e) => {
    const currentX = e.nativeEvent.pageX;
    const diff = lastX.current - currentX;
    const sensitivity = 20;

    if (Math.abs(diff) > sensitivity) {
      const direction = diff > 0 ? 1 : -1;
      setRotationIndex(prev => {
        let next = (prev + direction) % motorFrames.length;
        if (next < 0) next = motorFrames.length - 1;
        return next;
      });
      lastX.current = currentX;
    }
  };

  const currentImage = useMemo(() => {
    if (motor?.frames) return motorFrames[rotationIndex];
    return motor?.colors?.find(c => c.id === selectedColor)?.img || motor?.img;
  }, [rotationIndex, selectedColor, motor]);

  // Mock Finance Calculation
  const financeResults = useMemo(() => {
    const priceRaw = parseInt(motor?.price?.replace(/\./g, '') || '0');
    const downPayment = Math.floor(priceRaw * (downPaymentPercent / 100));
    const loanAmount = priceRaw - downPayment;
    const monthlyRate = 0.015; // 1.5% average
    const monthlyPayment = Math.floor((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1));
    
    return {
      downPayment,
      loanAmount,
      monthlyPayment
    };
  }, [downPaymentPercent, loanTerm, motor]);

  return {
    activeTab,
    setActiveTab,
    selectedColor,
    setSelectedColor,
    rotationIndex,
    currentImage,
    handleTouchStart,
    handleTouchMove,
    downPaymentPercent,
    setDownPaymentPercent,
    loanTerm,
    setLoanTerm,
    financeResults
  };
};
