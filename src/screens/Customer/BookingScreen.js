import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActiveColors, useTheme } from '../../theme/Theme'; // Import useTheme
import {
  CheckCircle2, Calendar as CalendarIcon, Clock, ChevronRight,
  Wrench, ShieldAlert, Sparkles, Bike, MapPin, Search, ChevronLeft, Settings
} from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';
import ServiceTracker from '../../components/ServiceTracker';
import RemoteApproval from '../../components/RemoteApproval';
import Toast from '../../components/Toast';
import { useGlobalState } from '../../context/GlobalState';

export default function BookingScreen({ navigation }) {
  const activeColors = useActiveColors();
  const theme = useTheme(); // Use the useTheme hook
  const { setSettingsOpen } = useGlobalState();
  const toastRef = useRef(null);
  const [activeView, setActiveView] = useState('booking'); // 'booking' or 'status'
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
    { name: 'Bảo dưỡng định kỳ', icon: <Wrench color={activeColors.primary} size={24} />, desc: 'Kiểm tra tổng quát 24 hạng mục' },
    { name: 'Khắc phục sự cố', icon: <ShieldAlert color={activeColors.secondary} size={24} />, desc: 'Xử lý lỗi động cơ, phanh, điện' },
    { name: 'Vệ sinh & Làm đẹp', icon: <Sparkles color={activeColors.info} size={24} />, desc: 'Rửa xe chi tiết & phủ Ceramic' },
  ];

  const timeSlots = ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'];

  const renderStep1 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={getStyles().stepContainer}>
      <Text style={[getStyles().stepTitle, { color: activeColors.text }]}>Chọn xe cần dịch vụ</Text>
      {myBikes.map((bike, i) => (
        <ScalePress key={i} onPress={() => { setSelectedVehicle(bike); setStep(2); }}>
          <GlassCard style={[getStyles().optionCard, { borderColor: activeColors.border, backgroundColor: activeColors.card }]} intensity={15}>
            <View style={[getStyles().optionIconBox, { backgroundColor: activeColors.border + '33' }]}>
              <Bike color={activeColors.primary} size={24} />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={[styles.optionText, { color: activeColors.text }]}>{bike.name}</Text>
              <Text style={[styles.optionDesc, { color: activeColors.subtext }]}>{bike.plate}</Text>
            </View>
            <ChevronRight color={activeColors.subtext} size={20} />
          </GlassCard>
        </ScalePress>
      ))}
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={getStyles().stepContainer}>
      <TouchableOpacity onPress={() => setStep(1)} style={getStyles().backLinkWrapper}>
        <Text style={[getStyles().backLink, { color: activeColors.primary }]}>← Đổi xe ({selectedVehicle?.name})</Text>
      </TouchableOpacity>
      <Text style={[getStyles().stepTitle, { color: activeColors.text }]}>Chọn loại dịch vụ</Text>
      {services.map((s, i) => (
        <ScalePress key={i} onPress={() => { setSelectedService(s.name); setStep(3); }}>
          <GlassCard style={[getStyles().optionCard, { borderColor: activeColors.border, backgroundColor: activeColors.card }]} intensity={15}>
            <View style={[getStyles().optionIconBox, { backgroundColor: activeColors.border + '33' }]}>
              {s.icon}
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={[styles.optionText, { color: activeColors.text }]}>{s.name}</Text>
              <Text style={[styles.optionDesc, { color: activeColors.subtext }]}>{s.desc}</Text>
            </View>
            <ChevronRight color={activeColors.subtext} size={20} />
          </GlassCard>
        </ScalePress>
      ))}
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={getStyles().stepContainer}>
      <TouchableOpacity onPress={() => setStep(2)} style={getStyles().backLinkWrapper}>
        <Text style={[getStyles().backLink, { color: activeColors.primary }]}>← Đổi dịch vụ ({selectedService})</Text>
      </TouchableOpacity>
      <Text style={[getStyles().stepTitle, { color: activeColors.text }]}>Chọn thời gian</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: theme.spacing.lg }}>
        {[6, 7, 8, 9, 10, 11].map(d => (
          <ScalePress key={d} onPress={() => setSelectedDate(`Ngày ${d}/05`)} style={{ marginRight: theme.spacing.md }}>
            <GlassCard style={[getStyles().dateCard, selectedDate === `Ngày ${d}/05` && getStyles().selectedCard, selectedDate === `Ngày ${d}/05` && { borderColor: activeColors.primary }]} intensity={selectedDate === `Ngày ${d}/05` ? 40 : 15}>
              <Text style={[getStyles().dateText, { color: activeColors.text }]}>{d}</Text>
              <Text style={[getStyles().monthText, { color: activeColors.subtext }]}>Tháng 5</Text>
            </GlassCard>
          </ScalePress>
        ))}
      </ScrollView>

      <View style={getStyles().timeGrid}>
        {timeSlots.map((time, index) => (
          <ScalePress key={time} style={getStyles().timeSlotWrapper} onPress={() => setSelectedTime(time)}>
            <GlassCard style={[getStyles().timeCard, selectedTime === time && getStyles().selectedCard, selectedTime === time && { borderColor: activeColors.primary }]} intensity={selectedTime === time ? 40 : 15}>
              <Text style={[getStyles().timeText, { color: activeColors.subtext }, selectedTime === time && { color: '#fff' }]}>{time}</Text>
            </GlassCard>
          </ScalePress>
        ))}
      </View>

      {selectedTime && (
        <ScalePress style={[styles.confirmBtn, { backgroundColor: activeColors.primary }]} onPress={handleComplete}>
          <Text style={styles.confirmBtnText}>Xác nhận & Gửi yêu cầu</Text>
        </ScalePress>
      )}
    </Animated.View>
  );

  const handleComplete = () => {
    toastRef.current?.show('Đặt lịch thành công!');
    setTimeout(() => {
      setStep(1);
      setActiveView('status');
    }, 1500);
  };

  return (
    <SafeAreaView style={[getStyles().container, { backgroundColor: activeColors.background }]} edges={['top']}>
      <View style={getStyles().header}>
        <View style={[getStyles().headerTopRow, { marginBottom: 15 }]}>
          <ScalePress style={{ width: 44, height: 44, justifyContent: 'center' }} onPress={() => navigation.goBack()}>
            <ChevronLeft color={activeColors.text} size={28} />
          </ScalePress>
          <ScalePress style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }} onPress={() => setSettingsOpen(true)}>
            <Settings color={activeColors.text} size={22} />
          </ScalePress>
        </View>
        <View style={[getStyles().tabSwitcher, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }]}>
          <TouchableOpacity onPress={() => setActiveView('booking')} style={[getStyles().tab, activeView === 'booking' && [getStyles().activeTab, { backgroundColor: activeColors.card }]]}>
            <Text style={[getStyles().tabText, { color: activeColors.subtext }, activeView === 'booking' && { color: activeColors.primary }]}>Đặt lịch</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveView('status')} style={[getStyles().tab, activeView === 'status' && [getStyles().activeTab, { backgroundColor: activeColors.card }]]}>
            <Text style={[getStyles().tabText, { color: activeColors.subtext }, activeView === 'status' && { color: activeColors.primary }]}>Đang sửa chữa</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      > {/* Use getStyles for scrollContent */}
        {activeView === 'booking' ? (
          <View style={getStyles().bookingContent}>
            <View style={styles.progressContainer}>
              {[1, 2, 3].map(i => (
                <View key={i} style={[styles.progressDot, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }, step >= i && [styles.activeProgressDot, { backgroundColor: activeColors.primary }]]} />
              ))}
            </View>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </View>
        ) : (
          <Animated.View entering={FadeInRight}>
            <ServiceTracker currentStep={3} />

            <View style={styles.approvalSection}>
              <RemoteApproval onComplete={() => toastRef.current?.show('Đã xác nhận báo giá!')} />
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <Toast ref={toastRef} />
    </SafeAreaView>
  );
}

const getStyles = () => StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: theme.spacing.lg, paddingBottom: 120, flexGrow: 1 },
  header: { marginTop: 10, marginBottom: theme.spacing.xl, paddingHorizontal: theme.spacing.lg },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, justifyContent: 'center', marginBottom: 15, borderRadius: theme.radius.md },
  tabSwitcher: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 15, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: activeColors.card },
  tabText: { fontWeight: 'bold', fontSize: 14 },
  activeTabText: { color: activeColors.primary },

  bookingContent: { flex: 1 },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: theme.spacing.lg },
  progressDot: { width: 40, height: 4, backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderRadius: 2, marginHorizontal: 4 },
  activeProgressDot: { backgroundColor: activeColors.primary },

  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: theme.spacing.lg },
  backLinkWrapper: { marginBottom: 8 },
  backLink: { fontSize: 14, fontWeight: '600' },

  optionCard: { padding: theme.spacing.md, flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md, borderRadius: theme.radius.lg, borderWidth: 1 },
  optionIconBox: { width: 48, height: 48, borderRadius: theme.radius.md, backgroundColor: activeColors.border + '33', justifyContent: 'center', alignItems: 'center' },
  optionText: { fontSize: 16, fontWeight: 'bold' },
  optionDesc: { fontSize: 12, marginTop: 2, flex: 1 },
  distanceText: { color: activeColors.primary, fontSize: 12, fontWeight: 'bold' },

  dateCard: { padding: theme.spacing.md, alignItems: 'center', minWidth: 80, borderRadius: theme.radius.lg, borderWidth: 1, backgroundColor: activeColors.card },
  dateText: { fontSize: 24, fontWeight: 'bold' },
  monthText: { fontSize: 12, marginTop: 4 },
  selectedCard: { borderColor: activeColors.primary, borderWidth: 1, backgroundColor: 'rgba(0,122,255,0.05)' },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', flex: 1 },
  timeSlotWrapper: { width: '31%', marginBottom: theme.spacing.md },
  timeCard: { padding: theme.spacing.sm, alignItems: 'center', borderRadius: theme.radius.lg, borderWidth: 1, backgroundColor: activeColors.card },
  timeText: { fontSize: 15, fontWeight: 'bold' },

  confirmBtn: { backgroundColor: activeColors.primary, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: theme.spacing.lg },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  approvalSection: { marginTop: 40, paddingBottom: 50 }
});
