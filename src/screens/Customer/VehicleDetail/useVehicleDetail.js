import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { ProductDataSource } from '../../../data/product/datasources/ProductDataSource';

export const useVehicleDetail = (motorSummary, initialColor) => {
  const [motorDetail, setMotorDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedColorId, setSelectedColorId] = useState('default');
  const [rotationIndex, setRotationIndex] = useState(0);

  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [loanTerm, setLoanTerm] = useState(12);

  const lastX = useRef(0);

  const motor = motorDetail || motorSummary;

  const variants = useMemo(() => (Array.isArray(motor?.variants) ? motor.variants : []), [motor]);

  const selectedVariant = useMemo(() => {
    if (variants.length === 0) return null;
    return variants.find((v) => String(v.id) === String(selectedVariantId)) || variants[0] || null;
  }, [variants, selectedVariantId]);

  const selectedVariantColors = useMemo(
    () => (Array.isArray(selectedVariant?.colors) ? selectedVariant.colors : []),
    [selectedVariant]
  );

  const selectedColor = useMemo(() => {
    if (selectedVariantColors.length === 0) return null;
    return (
      selectedVariantColors.find((c) => String(c.id) === String(selectedColorId)) ||
      selectedVariantColors[0] ||
      null
    );
  }, [selectedVariantColors, selectedColorId]);

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
          const vs = Array.isArray(data?.variants) ? data.variants : [];
          if (vs.length > 0) {
            setSelectedVariantId((prev) => prev ?? vs[0].id);
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

  const handleSelectVariant = useCallback(
    (variantId) => {
      setSelectedVariantId(variantId);
      const vs = Array.isArray(motor?.variants) ? motor.variants : [];
      const variant = vs.find((v) => String(v.id) === String(variantId));
      const colors = Array.isArray(variant?.colors) ? variant.colors : [];
      setSelectedColorId(colors.length > 0 ? colors[0].id : 'default');
    },
    [motor]
  );

  const handleSelectColor = useCallback((colorId) => {
    setSelectedColorId(colorId);
  }, []);

  const displayPrice = useMemo(() => {
    if (selectedVariant?.price != null) return selectedVariant.price;
    return motor?.price ?? motor?.referencePrice ?? null;
  }, [selectedVariant, motor]);

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
    const colorImage = selectedColor?.image || selectedColor?.coverImageUrl;
    if (colorImage) return colorImage;
    if (selectedVariant?.coverImageUrl) return selectedVariant.coverImageUrl;
    return motor?.img || motor?.imageUrl || motor?.coverImageUrl;
  }, [rotationIndex, selectedColor, selectedVariant, motor, motorFrames]);

  const financeResults = useMemo(() => {
    const priceValue =
      displayPrice ?? motor?.referencePrice ?? motor?.Price ?? motor?.ReferencePrice;
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
  }, [downPaymentPercent, loanTerm, displayPrice, motor]);

  return {
    motor,
    loading,
    error,
    activeTab,
    setActiveTab,
    variants,
    selectedVariant,
    selectedVariantColors,
    selectedColor,
    selectedColorId,
    handleSelectVariant,
    handleSelectColor,
    displayPrice,
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
