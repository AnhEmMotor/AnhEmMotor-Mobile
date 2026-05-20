import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { DollarSign, Calendar, ArrowRight, MessageSquare } from 'lucide-react-native';
import GlassCard from './GlassCard';
import { useTheme } from '../theme/Theme'; // Import useTheme

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
    <View style={getStyles(theme).container}>
      <Text style={getStyles(theme).title}>Dự toán trả góp 💰</Text>
      <Text style={[getStyles(theme).subtitle, { color: theme.colors.subtext }]}>Giá xe: {formatCurrency(vehiclePrice)}</Text>

      <GlassCard style={getStyles(theme).card} intensity={20}>
        <View style={getStyles(theme).row}>
          <Text style={getStyles(theme).label}>Trả trước ({downPaymentPercent}%)</Text>
          <Text style={getStyles(theme).value}>{formatCurrency((vehiclePrice * downPaymentPercent) / 100)}</Text>
        </View>
        <Slider
          style={getStyles(theme).slider}
          minimumValue={20}
          maximumValue={70}
          step={5}
          value={downPaymentPercent}
          onValueChange={(v) => handleSliderChange(v, setDownPaymentPercent)}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor="rgba(255,255,255,0.1)"
          thumbTintColor={theme.colors.primary}
        />

        <View style={[getStyles(theme).row, { marginTop: 20 }]}>
          <Text style={getStyles(theme).label}>Thời hạn vay</Text>
          <Text style={getStyles(theme).value}>{months} tháng</Text>
        </View>
        <Slider
          style={getStyles(theme).slider}
          minimumValue={12}
          maximumValue={60}
          step={12}
          value={months}
          onValueChange={(v) => handleSliderChange(v, setMonths)}
          minimumTrackTintColor={theme.colors.secondary}
          maximumTrackTintColor="rgba(255,255,255,0.1)"
          thumbTintColor={theme.colors.secondary}
        />

        <LinearGradient
          colors={['rgba(0,122,255,0.1)', 'rgba(0,122,255,0.05)']}
          style={getStyles(theme).resultBox}
        >
          <Text style={[getStyles(theme).resultLabel, { color: theme.colors.subtext }]}>Ước tính trả mỗi tháng</Text>
          <Text style={[getStyles(theme).resultValue, { color: theme.colors.primary }]}>{formatCurrency(monthlyInstallment)}</Text>
          <Text style={[getStyles(theme).interestHint, { color: theme.colors.success }]}>Lãi suất ưu đãi: 8.0%/năm</Text>
        </LinearGradient>

        <View style={getStyles(theme).actionRow}>
          <TouchableOpacity
            style={[getStyles(theme).actionBtn, getStyles(theme).secondaryBtn, { borderColor: theme.colors.primary }]}
            onPress={() => onAction?.('chat')}
          >
            <MessageSquare color={theme.colors.primary} size={20} />
            <Text style={[getStyles(theme).secondaryBtnText, { color: theme.colors.primary }]}>Tư vấn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[getStyles(theme).actionBtn, getStyles(theme).primaryBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => onAction?.('deposit')}
          >
            <Text style={getStyles(theme).primaryBtnText}>Tư Vấn</Text>
            <ArrowRight color="#FFF" size={20} />
          </TouchableOpacity>
        </View>
      </GlassCard>
    </View>
  );
};
const getStyles = (theme) => StyleSheet.create({
  container: { marginTop: 20 },
  title: { color: theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { color: theme.colors.subtext, fontSize: 14, marginBottom: 20 },
  card: { padding: 20, borderRadius: theme.radius.lg }, // Added borderRadius for consistency
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: theme.colors.subtext, fontSize: 13 },
  value: { color: theme.colors.text, fontSize: 15, fontWeight: 'bold' },
  slider: { width: '100%', height: 40, marginTop: 10 },
  resultBox: { marginTop: 25, padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,122,255,0.2)' },
  resultLabel: { color: theme.colors.subtext, fontSize: 12 },
  resultValue: { color: theme.colors.primary, fontSize: 28, fontWeight: 'bold', marginVertical: 5 },
  interestHint: { color: theme.colors.success, fontSize: 10, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', marginTop: 25, justifyContent: 'space-between' },
  actionBtn: { height: 50, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { flex: 1.5, backgroundColor: theme.colors.primary, marginLeft: 10 },
  secondaryBtn: { flex: 1, borderWidth: 1, borderColor: theme.colors.primary },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', marginRight: 10 },
  secondaryBtnText: { color: theme.colors.primary, fontWeight: 'bold', marginLeft: 10 },
});

export default FinanceCalculator;
