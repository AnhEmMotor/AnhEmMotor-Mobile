import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Theme } from '../../theme/Theme';
import { CheckCircle2, Calendar as CalendarIcon, Clock, ChevronRight, Wrench, ShieldAlert, Sparkles, Bike } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';

export default function BookingScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const myBikes = [
    { id: '1', name: 'Kawasaki Z1000', plate: '59-A3 123.45' },
    { id: '2', name: 'Honda CBR150R', plate: '29-B1 678.90' },
  ];

  const services = [
    { name: 'Bảo dưỡng định kỳ', icon: <Wrench color={Theme.colors.primary} size={24} />, desc: 'Kiểm tra tổng quát 24 hạng mục' },
    { name: 'Khắc phục sự cố', icon: <ShieldAlert color={Theme.colors.secondary} size={24} />, desc: 'Xử lý lỗi động cơ, phanh, điện' },
    { name: 'Vệ sinh & Làm đẹp', icon: <Sparkles color={Theme.colors.info} size={24} />, desc: 'Rửa xe chi tiết & phủ Ceramic' },
  ];

  const timeSlots = ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'];

  const renderStep1 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} layout={Layout.springify()}>
      <Text style={styles.stepTitle}>Chọn xe cần dịch vụ</Text>
      {myBikes.map((bike, i) => (
        <ScalePress key={i} onPress={() => { setSelectedVehicle(bike); setStep(2); }}>
          <GlassCard style={styles.optionCard} intensity={15}>
            <View style={styles.optionIconBox}>
              <Bike color={Theme.colors.primary} size={24} />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.optionText}>{bike.name}</Text>
              <Text style={styles.optionDesc}>{bike.plate}</Text>
            </View>
            <ChevronRight color={Theme.colors.subtext} size={20} />
          </GlassCard>
        </ScalePress>
      ))}
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} layout={Layout.springify()}>
      <TouchableOpacity onPress={() => setStep(1)}>
        <Text style={styles.backLink}>← Đổi xe ({selectedVehicle?.name})</Text>
      </TouchableOpacity>
      <Text style={styles.stepTitle}>Chọn loại dịch vụ</Text>
      {services.map((s, i) => (
        <ScalePress key={i} onPress={() => { setSelectedService(s.name); setStep(3); }}>
          <GlassCard style={styles.optionCard} intensity={15}>
            <View style={styles.optionIconBox}>
              {s.icon}
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.optionText}>{s.name}</Text>
              <Text style={styles.optionDesc}>{s.desc}</Text>
            </View>
            <ChevronRight color={Theme.colors.subtext} size={20} />
          </GlassCard>
        </ScalePress>
      ))}
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} layout={Layout.springify()}>
      <TouchableOpacity onPress={() => setStep(2)}>
        <Text style={styles.backLink}>← Đổi dịch vụ ({selectedService})</Text>
      </TouchableOpacity>
      <Text style={styles.stepTitle}>Chọn ngày bảo trì</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Theme.spacing.lg }}>
        {[6, 7, 8, 9, 10, 11].map(d => (
          <ScalePress key={d} onPress={() => setSelectedDate(`Ngày ${d}/05`)} style={{ marginRight: Theme.spacing.md }}>
            <GlassCard style={[styles.dateCard, selectedDate === `Ngày ${d}/05` && styles.selectedCard]} intensity={selectedDate === `Ngày ${d}/05` ? 40 : 15}>
              <Text style={styles.dateText}>{d}</Text>
              <Text style={styles.monthText}>Tháng 5</Text>
            </GlassCard>
          </ScalePress>
        ))}
      </ScrollView>

      {selectedDate && (
        <Animated.View entering={FadeInRight}>
          <Text style={styles.stepTitle}>Khung giờ</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map(time => (
              <ScalePress key={time} style={styles.timeSlotWrapper} onPress={() => { setSelectedTime(time); setStep(4); }}>
                <GlassCard style={[styles.timeCard, selectedTime === time && styles.selectedCard]} intensity={selectedTime === time ? 40 : 15}>
                  <Text style={[styles.timeText, selectedTime === time && { color: '#fff' }]}>{time}</Text>
                </GlassCard>
              </ScalePress>
            ))}
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );

  const renderStep4 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} layout={Layout.springify()}>
      <TouchableOpacity onPress={() => setStep(3)}>
        <Text style={styles.backLink}>← Đổi thời gian</Text>
      </TouchableOpacity>
      <Text style={styles.stepTitle}>Xác nhận đặt lịch</Text>

      <GlassCard style={styles.summaryCard} intensity={20}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Xe của bạn:</Text>
          <Text style={styles.summaryValue}>{selectedVehicle?.name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Biển số:</Text>
          <Text style={styles.summaryValue}>{selectedVehicle?.plate}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Dịch vụ:</Text>
          <Text style={styles.summaryValue}>{selectedService}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Thời gian:</Text>
          <Text style={styles.summaryValue}>{selectedTime}, {selectedDate}</Text>
        </View>
        
        <ScalePress style={styles.confirmBtn} onPress={handleComplete}>
          <Text style={styles.confirmBtnText}>Xác nhận Đặt lịch</Text>
        </ScalePress>
      </GlassCard>
    </Animated.View>
  );

  const handleComplete = () => {
    navigation.navigate('Success', {
      title: 'Đặt lịch thành công!',
      message: `Yêu cầu dịch vụ cho xe ${selectedVehicle?.name} vào lúc ${selectedTime} ${selectedDate} đã được tiếp nhận.`,
      target: 'Hub'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Đặt lịch bảo trì</Text>
          <Text style={styles.subTitle}>Dễ dàng & Nhanh chóng</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{step}/4</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { marginTop: Theme.spacing.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.spacing.xl },
  title: { color: Theme.colors.text, fontSize: 26, fontWeight: 'bold' },
  subTitle: { color: Theme.colors.subtext, fontSize: 13, marginTop: 2 },
  progressBadge: { backgroundColor: Theme.colors.primary, paddingHorizontal: 15, paddingVertical: 5, borderRadius: Theme.radius.full },
  progressText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  
  stepTitle: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: Theme.spacing.lg },
  stepHeader: { marginBottom: Theme.spacing.md },
  backLink: { color: Theme.colors.primary, fontSize: 14, fontWeight: '600', marginBottom: 8 },

  optionCard: { padding: Theme.spacing.md, flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.md },
  optionIconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  optionText: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  optionDesc: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2 },
  
  dateCard: { padding: Theme.spacing.md, alignItems: 'center', minWidth: 80 },
  dateText: { color: Theme.colors.text, fontSize: 24, fontWeight: 'bold' },
  monthText: { color: Theme.colors.subtext, fontSize: 12, marginTop: 4 },
  selectedCard: { borderColor: Theme.colors.primary, borderWidth: 1 },
  
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  timeSlotWrapper: { width: '31%', marginBottom: Theme.spacing.md },
  timeCard: { padding: Theme.spacing.sm, alignItems: 'center' },
  timeText: { color: Theme.colors.subtext, fontSize: 15, fontWeight: 'bold' },

  summaryCard: { padding: Theme.spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Theme.spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', paddingBottom: Theme.spacing.sm },
  summaryLabel: { color: Theme.colors.subtext, fontSize: 14 },
  summaryValue: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold' },
  confirmBtn: { backgroundColor: Theme.colors.primary, padding: 16, borderRadius: Theme.radius.md, alignItems: 'center', marginTop: Theme.spacing.lg },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
