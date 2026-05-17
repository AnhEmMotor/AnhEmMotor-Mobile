import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Theme } from '../theme/Theme';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { DollarSign, Calendar, ArrowRight, MessageSquare } from 'lucide-react-native';
import GlassCard from './GlassCard';

const { width } = Dimensions.get('window');

const FinanceCalculator = ({ vehiclePrice = 450000000, onAction }) => {
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [months, setMonths] = useState(24);
  const [monthlyInstallment, setMonthlyInstallment] = useState(0);

  const interestRate = 0.08; // 8% yearly

  useEffect(() => {
    calculateFinance();
  }, [downPaymentPercent, months]);

  const calculateFinance = () => {
    const downPayment = (vehiclePrice * downPaymentPercent) / 100;
    const principal = vehiclePrice - downPayment;

    // Monthly interest rate
    const i = interestRate / 12;
    // Number of months
    const n = months;

    // Standard Amortization Formula: M = P * [ i * (1 + i)^n ] / [ (1 + i)^n – 1 ]
    const monthlyPayment = principal * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);

    setMonthlyInstallment(Math.round(monthlyPayment));
  };

  const handleSliderChange = (value, setter) => {
    setter(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dự toán trả góp 💰</Text>
      <Text style={styles.subtitle}>Giá xe: {formatCurrency(vehiclePrice)}</Text>

      <GlassCard style={styles.card} intensity={20}>
        <View style={styles.row}>
          <Text style={styles.label}>Trả trước ({downPaymentPercent}%)</Text>
          <Text style={styles.value}>{formatCurrency((vehiclePrice * downPaymentPercent) / 100)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={20}
          maximumValue={70}
          step={5}
          value={downPaymentPercent}
          onValueChange={(v) => handleSliderChange(v, setDownPaymentPercent)}
          minimumTrackTintColor={Theme.colors.primary}
          maximumTrackTintColor="rgba(255,255,255,0.1)"
          thumbTintColor={Theme.colors.primary}
        />

        <View style={[styles.row, { marginTop: 20 }]}>
          <Text style={styles.label}>Thời hạn vay</Text>
          <Text style={styles.value}>{months} tháng</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={12}
          maximumValue={60}
          step={12}
          value={months}
          onValueChange={(v) => handleSliderChange(v, setMonths)}
          minimumTrackTintColor={Theme.colors.secondary}
          maximumTrackTintColor="rgba(255,255,255,0.1)"
          thumbTintColor={Theme.colors.secondary}
        />

        <LinearGradient
          colors={['rgba(0,122,255,0.1)', 'rgba(0,122,255,0.05)']}
          style={styles.resultBox}
        >
          <Text style={styles.resultLabel}>Ước tính trả mỗi tháng</Text>
          <Text style={styles.resultValue}>{formatCurrency(monthlyInstallment)}</Text>
          <Text style={styles.interestHint}>Lãi suất ưu đãi: 8.0%/năm</Text>
        </LinearGradient>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.secondaryBtn]}
            onPress={() => onAction?.('chat')}
          >
            <MessageSquare color={Theme.colors.primary} size={20} />
            <Text style={styles.secondaryBtnText}>Tư vấn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.primaryBtn]}
            onPress={() => onAction?.('deposit')}
          >
            <Text style={styles.primaryBtnText}>Tư Vấn</Text>
            <ArrowRight color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { color: Theme.colors.subtext, fontSize: 14, marginBottom: 20 },
  card: { padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: Theme.colors.subtext, fontSize: 13 },
  value: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  slider: { width: '100%', height: 40, marginTop: 10 },
  resultBox: { marginTop: 25, padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,122,255,0.2)' },
  resultLabel: { color: Theme.colors.subtext, fontSize: 12 },
  resultValue: { color: Theme.colors.primary, fontSize: 28, fontWeight: 'bold', marginVertical: 5 },
  interestHint: { color: Theme.colors.success, fontSize: 10, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', marginTop: 25, justifyContent: 'space-between' },
  actionBtn: { height: 50, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { flex: 1.5, backgroundColor: Theme.colors.primary, marginLeft: 10 },
  secondaryBtn: { flex: 1, borderWidth: 1, borderColor: Theme.colors.primary },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', marginRight: 10 },
  secondaryBtnText: { color: Theme.colors.primary, fontWeight: 'bold', marginLeft: 10 },
});

export default FinanceCalculator;
