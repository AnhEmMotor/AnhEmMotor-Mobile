import { useState, useRef, useMemo, useEffect } from 'react';
import { ProductDataSource } from '../../../data/product/datasources/ProductDataSource';

export const useVehicleDetail = (motorSummary, initialColor) => {
  const [motorDetail, setMotorDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedColor, setSelectedColor] = useState(
    initialColor || motorSummary?.colors?.[0]?.id || 'default'
  );
  const [rotationIndex, setRotationIndex] = useState(0);


    const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [loanTerm, setLoanTerm] = useState(12);

  const lastX = useRef(0);

  const motor = motorDetail || motorSummary; 

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      if (!motorSummary?.id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await ProductDataSource.fetchProductDetail(motorSummary.id);
        if (isMounted) {
          setMotorDetail(data);
          if (data?.colors?.length > 0) {
            setSelectedColor((prev) => (prev === 'default' ? data.colors[0].id : prev));
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Không thể tải chi tiết sản phẩm');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [motorSummary?.id]);

  const motorFrames = useMemo(
    () =>
      Array.isArray(motor?.frames) && motor.frames.length > 0
        ? motor.frames
        : [motor?.img || motor?.imageUrl || motor?.coverImageUrl],
    [motor]
  );

  const handleTouchStart = (e) => {
    lastX.current = e.nativeEvent.pageX;
  };

  const handleTouchMove = (e) => {
    const currentX = e.nativeEvent.pageX;
    const diff = lastX.current - currentX;
    const sensitivity = 20;

    if (Math.abs(diff) > sensitivity) {
      const direction = diff > 0 ? 1 : -1;
      setRotationIndex((prev) => {
        let next = (prev + direction) % motorFrames.length;
        if (next < 0) next = motorFrames.length - 1;
        return next;
      });
      lastX.current = currentX;
    }
  };

  const currentImage = useMemo(() => {
    if (Array.isArray(motor?.frames) && motor.frames.length > 0) return motorFrames[rotationIndex];
    return (
      motor?.colors?.find((c) => c.id === selectedColor)?.image ||
      motor?.colors?.find((c) => c.id === selectedColor)?.coverImageUrl ||
      motor?.img ||
      motor?.imageUrl ||
      motor?.coverImageUrl
    );
  }, [rotationIndex, selectedColor, motor, motorFrames]);


    const financeResults = useMemo(() => {
    const priceValue =
      motor?.price ?? motor?.referencePrice ?? motor?.Price ?? motor?.ReferencePrice;
    const priceRaw =
      typeof priceValue === 'number'
        ? priceValue
        : parseInt(
            String(priceValue || '')
              .replace(/\./g, '')
              .replace(/[^\d]/g, '') || '0'
          );
    const downPayment = Math.floor(priceRaw * (downPaymentPercent / 100));
    const loanAmount = priceRaw - downPayment;
    const monthlyRate = 0.015; 
    const monthlyPayment = Math.floor(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
        (Math.pow(1 + monthlyRate, loanTerm) - 1)
    );

    return {
      downPayment,
      loanAmount,
      monthlyPayment,
    };
  }, [downPaymentPercent, loanTerm, motor]);

  return {
    motor, 
    loading,
    error,
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
    financeResults,
  };
};
