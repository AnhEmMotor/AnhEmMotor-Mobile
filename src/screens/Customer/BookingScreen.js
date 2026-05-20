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
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={getStyles(activeColors).stepContainer}>
      <Text style={[getStyles(activeColors).stepTitle, { color: activeColors.text }]}>Chọn xe cần dịch vụ</Text>
      {myBikes.map((bike, i) => (
        <ScalePress key={i} onPress={() => { setSelectedVehicle(bike); setStep(2); }}>
          <GlassCard style={[getStyles(activeColors).optionCard, { borderColor: activeColors.border, backgroundColor: activeColors.card }]} intensity={15}>
            <View style={[getStyles(activeColors).optionIconBox, { backgroundColor: activeColors.border + '33' }]}>
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
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={getStyles(activeColors).stepContainer}>
      <TouchableOpacity onPress={() => setStep(1)} style={getStyles(activeColors).backLinkWrapper}>
        <Text style={[getStyles(activeColors).backLink, { color: activeColors.primary }]}>← Đổi xe ({selectedVehicle?.name})</Text>
      </TouchableOpacity>
      <Text style={[getStyles(activeColors).stepTitle, { color: activeColors.text }]}>Chọn loại dịch vụ</Text>
      {services.map((s, i) => (
        <ScalePress key={i} onPress={() => { setSelectedService(s.name); setStep(3); }}>
          <GlassCard style={[getStyles(activeColors).optionCard, { borderColor: activeColors.border, backgroundColor: activeColors.card }]} intensity={15}>
            <View style={[getStyles(activeColors).optionIconBox, { backgroundColor: activeColors.border + '33' }]}>
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
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={getStyles(activeColors).stepContainer}>
      <TouchableOpacity onPress={() => setStep(2)} style={getStyles(activeColors).backLinkWrapper}>
        <Text style={[getStyles(activeColors).backLink, { color: activeColors.primary }]}>← Đổi dịch vụ ({selectedService})</Text>
      </TouchableOpacity>
      <Text style={[getStyles(activeColors).stepTitle, { color: activeColors.text }]}>Chọn thời gian</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: theme.spacing.lg }}>
        {[6, 7, 8, 9, 10, 11].map(d => (
          <ScalePress key={d} onPress={() => setSelectedDate(`Ngày ${d}/05`)} style={{ marginRight: theme.spacing.md }}>
            <GlassCard style={[getStyles(activeColors).dateCard, selectedDate === `Ngày ${d}/05` && getStyles(activeColors).selectedCard, selectedDate === `Ngày ${d}/05` && { borderColor: activeColors.primary }]} intensity={selectedDate === `Ngày ${d}/05` ? 40 : 15}>
              <Text style={[getStyles(activeColors).dateText, { color: activeColors.text }]}>{d}</Text>
              <Text style={[getStyles(activeColors).monthText, { color: activeColors.subtext }]}>Tháng 5</Text>
            </GlassCard>
          </ScalePress>
        ))}
      </ScrollView>

      <View style={getStyles(activeColors).timeGrid}>
        {timeSlots.map((time, index) => (
          <ScalePress key={time} style={getStyles(activeColors).timeSlotWrapper} onPress={() => setSelectedTime(time)}>
            <GlassCard style={[getStyles(activeColors).timeCard, selectedTime === time && getStyles(activeColors).selectedCard, selectedTime === time && { borderColor: activeColors.primary }]} intensity={selectedTime === time ? 40 : 15}>
              <Text style={[getStyles(activeColors).timeText, { color: activeColors.subtext }, selectedTime === time && { color: '#fff' }]}>{time}</Text>
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
    <SafeAreaView style={[getStyles(activeColors).container, { backgroundColor: activeColors.background }]} edges={['top']}>
      <View style={getStyles(activeColors).header}>
        <View style={[getStyles(activeColors).headerTopRow, { marginBottom: 15 }]}>
          <ScalePress style={{ width: 44, height: 44, justifyContent: 'center' }} onPress={() => navigation.goBack()}>
            <ChevronLeft color={activeColors.text} size={28} />
          </ScalePress>
          <ScalePress style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }} onPress={() => setSettingsOpen(true)}>
            <Settings color={activeColors.text} size={22} />
          </ScalePress>
        </View>
        <View style={[getStyles(activeColors).tabSwitcher, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }]}>
          <TouchableOpacity onPress={() => setActiveView('booking')} style={[getStyles(activeColors).tab, activeView === 'booking' && [getStyles(activeColors).activeTab, { backgroundColor: activeColors.card }]]}>
            <Text style={[getStyles(activeColors).tabText, { color: activeColors.subtext }, activeView === 'booking' && { color: activeColors.primary }]}>Đặt lịch</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveView('status')} style={[getStyles(activeColors).tab, activeView === 'status' && [getStyles(activeColors).activeTab, { backgroundColor: activeColors.card }]]}>
            <Text style={[getStyles(activeColors).tabText, { color: activeColors.subtext }, activeView === 'status' && { color: activeColors.primary }]}>Đang sửa chữa</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      > {/* Use getStyles for scrollContent */}
        {activeView === 'booking' ? (
          <View style={getStyles(activeColors).bookingContent}>
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

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: colors.spacing.lg, paddingBottom: 120, flexGrow: 1 },
  header: { marginTop: 10, marginBottom: Theme.spacing.xl, paddingHorizontal: Theme.spacing.lg },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, justifyContent: 'center', marginBottom: 15, borderRadius: colors.radius.md },
  tabSwitcher: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 15, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: colors.card },
  tabText: { fontWeight: 'bold', fontSize: 14 },
  activeTabText: { color: colors.primary },

  bookingContent: { flex: 1 }, // Added for the booking view
  progressContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 }, // This is fine
  progressDot: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginHorizontal: 4 },
  activeProgressDot: { backgroundColor: colors.primary }, // This is fine

  stepContainer: { flex: 1 }, // Added for step views
  stepTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: colors.spacing.lg },
  backLinkWrapper: { marginBottom: 8 }, // Wrapper for backLink
  backLink: { fontSize: 14, fontWeight: '600' },

  optionCard: { padding: colors.spacing.md, flexDirection: 'row', alignItems: 'center', marginBottom: colors.spacing.md, borderRadius: colors.radius.lg, borderWidth: 1 },
  optionIconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  optionText: { fontSize: 16, fontWeight: 'bold' },
  optionDesc: { fontSize: 12, marginTop: 2, flex: 1 },
  distanceText: { color: colors.primary, fontSize: 12, fontWeight: 'bold' }, // This is fine

  dateCard: { padding: colors.spacing.md, alignItems: 'center', minWidth: 80, borderRadius: colors.radius.lg, borderWidth: 1, backgroundColor: colors.card },
  dateText: { fontSize: 24, fontWeight: 'bold' },
  monthText: { fontSize: 12, marginTop: 4 },
  selectedCard: { borderColor: colors.primary, borderWidth: 1, backgroundColor: 'rgba(0,122,255,0.05)' },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', flex: 1 },
  timeSlotWrapper: { width: '31%', marginBottom: colors.spacing.md },
  timeCard: { padding: colors.spacing.sm, alignItems: 'center', borderRadius: colors.radius.lg, borderWidth: 1, backgroundColor: colors.card },
  timeText: { fontSize: 15, fontWeight: 'bold' },

  confirmBtn: { backgroundColor: colors.primary, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  approvalSection: { marginTop: 40, paddingBottom: 50 }
});


