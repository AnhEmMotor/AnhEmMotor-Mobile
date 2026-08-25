import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActiveColors, useTheme } from '../../theme/Theme';
import {
  ChevronRight,
  Wrench,
  ShieldAlert,
  Sparkles,
  Bike,
  ChevronLeft,
  Settings,
} from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';
import ServiceTracker from '../../components/ServiceTracker';
import RemoteApproval from '../../components/RemoteApproval';
import Toast from '../../components/Toast';
import { useGlobalState } from '../../context/GlobalState';
import { useDependency } from '../../di/DependencyContext';
import { createBookingApi } from '../../api/customerApi';

export default function BookingScreen({ navigation, route }) {
  const activeColors = useActiveColors();
  const theme = useTheme();
  const styles = getStyles(theme, activeColors);
  const { setSettingsOpen } = useGlobalState();
  const { getCustomerVehiclesUseCase } = useDependency();
  const toastRef = useRef(null);
  const [activeView, setActiveView] = useState('booking');
  const [step, setStep] = useState(() => (route?.params?.prefillVehicle?.id ? 2 : 1));
  const [selectedVehicle, setSelectedVehicle] = useState(() => {
    const p = route?.params?.prefillVehicle;
    return p?.id ? { id: String(p.id), name: p.name || 'Xe của tôi', plate: p.plate || '' } : null;
  });
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [myBikes, setMyBikes] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const vehicles = await getCustomerVehiclesUseCase.execute();
        if (!mounted) return;
        setMyBikes(
          (Array.isArray(vehicles) ? vehicles : []).map((v) => ({
            id: String(v.id ?? ''),
            name: v.name || 'Xe của tôi',
            plate: v.plate || '',
          }))
        );
      } catch (loadError) {
        console.error('Error loading vehicles for booking:', loadError);
        if (mounted) setMyBikes([]);
      } finally {
        if (mounted) setVehiclesLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [getCustomerVehiclesUseCase]);

  const upcomingDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      iso: d.toISOString().slice(0, 10),
      day: d.getDate(),
      month: d.getMonth() + 1,
    };
  });

  const canSubmit = Boolean(selectedVehicle && selectedService && selectedDate && selectedTime);

  const services = [
    {
      name: 'Bảo dưỡng định kỳ',
      icon: <Wrench color={activeColors.primary} size={24} />,
      desc: 'Kiểm tra tổng quát 24 hạng mục',
    },
    {
      name: 'Khắc phục sự cố',
      icon: <ShieldAlert color={activeColors.secondary} size={24} />,
      desc: 'Xử lý lỗi động cơ, phanh, điện',
    },
    {
      name: 'Vệ sinh & Làm đẹp',
      icon: <Sparkles color={activeColors.info} size={24} />,
      desc: 'Rửa xe chi tiết & phủ Ceramic',
    },
  ];

  const timeSlots = ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'];

  const renderStep1 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: activeColors.text }]}>Chọn xe cần dịch vụ</Text>
      {vehiclesLoading ? (
        <ActivityIndicator color={activeColors.primary} style={{ marginTop: 30 }} />
      ) : myBikes.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <Text style={{ color: activeColors.subtext, textAlign: 'center' }}>
            Bạn chưa có xe nào trong hệ thống.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyVehicles', { openAddModal: true })}
            style={{ marginTop: 14, paddingVertical: 10, paddingHorizontal: 20 }}
          >
            <Text style={{ color: activeColors.primary, fontWeight: '600' }}>Đăng ký xe ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        myBikes.map((bike) => (
          <ScalePress
            key={bike.id}
            onPress={() => {
              setSelectedVehicle(bike);
              setStep(2);
            }}
          >
            <GlassCard
              style={[
                styles.optionCard,
                { borderColor: activeColors.border, backgroundColor: activeColors.card },
              ]}
              intensity={15}
            >
              <View style={[styles.optionIconBox, { backgroundColor: activeColors.border + '33' }]}>
                <Bike color={activeColors.primary} size={24} />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={[styles.optionText, { color: activeColors.text }]}>{bike.name}</Text>
                <Text style={[styles.optionDesc, { color: activeColors.subtext }]}>
                  {bike.plate}
                </Text>
              </View>
              <ChevronRight color={activeColors.subtext} size={20} />
            </GlassCard>
          </ScalePress>
        ))
      )}
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
      <TouchableOpacity onPress={() => setStep(1)} style={styles.backLinkWrapper}>
        <Text style={[styles.backLink, { color: activeColors.primary }]}>
          ← Đổi xe ({selectedVehicle?.name})
        </Text>
      </TouchableOpacity>
      <Text style={[styles.stepTitle, { color: activeColors.text }]}>Chọn loại dịch vụ</Text>
      {services.map((s, i) => (
        <ScalePress
          key={i}
          onPress={() => {
            setSelectedService(s.name);
            setStep(3);
          }}
        >
          <GlassCard
            style={[
              styles.optionCard,
              { borderColor: activeColors.border, backgroundColor: activeColors.card },
            ]}
            intensity={15}
          >
            <View style={[styles.optionIconBox, { backgroundColor: activeColors.border + '33' }]}>
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
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
      <TouchableOpacity onPress={() => setStep(2)} style={styles.backLinkWrapper}>
        <Text style={[styles.backLink, { color: activeColors.primary }]}>
          ← Đổi dịch vụ ({selectedService})
        </Text>
      </TouchableOpacity>
      <Text style={[styles.stepTitle, { color: activeColors.text }]}>Chọn thời gian</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: theme.spacing.lg }}
      >
        {upcomingDates.map((d) => (
          <ScalePress
            key={d.iso}
            onPress={() => setSelectedDate(d.iso)}
            style={{ marginRight: theme.spacing.md }}
          >
            <GlassCard
              style={[
                styles.dateCard,
                selectedDate === d.iso && styles.selectedCard,
                selectedDate === d.iso && { borderColor: activeColors.primary },
              ]}
              intensity={selectedDate === d.iso ? 40 : 15}
            >
              <Text style={[styles.dateText, { color: activeColors.text }]}>{d.day}</Text>
              <Text style={[styles.monthText, { color: activeColors.subtext }]}>
                Tháng {d.month}
              </Text>
            </GlassCard>
          </ScalePress>
        ))}
      </ScrollView>

      <View style={styles.timeGrid}>
        {timeSlots.map((time, _index) => (
          <ScalePress
            key={time}
            style={styles.timeSlotWrapper}
            onPress={() => setSelectedTime(time)}
          >
            <GlassCard
              style={[
                styles.timeCard,
                selectedTime === time && styles.selectedCard,
                selectedTime === time && { borderColor: activeColors.primary },
              ]}
              intensity={selectedTime === time ? 40 : 15}
            >
              <Text
                style={[
                  styles.timeText,
                  { color: activeColors.subtext },
                  selectedTime === time && { color: '#fff' },
                ]}
              >
                {time}
              </Text>
            </GlassCard>
          </ScalePress>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.confirmBtn,
          { backgroundColor: activeColors.primary, opacity: canSubmit ? 1 : 0.45 },
        ]}
        onPress={handleComplete}
        disabled={!canSubmit || submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmBtnText}>
            {canSubmit
              ? 'Xác nhận & Gửi yêu cầu'
              : selectedDate
                ? 'Chọn khung giờ để tiếp tục'
                : 'Chọn ngày & khung giờ để tiếp tục'}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const handleComplete = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await createBookingApi({
        vehicleId: parseInt(selectedVehicle.id, 10),
        serviceType: selectedService,
        appointmentDate: selectedDate,
        appointmentTime: `${selectedTime}:00`,
        notes: '',
      });
      toastRef.current?.show('Đặt lịch thành công!');
      setSelectedDate(null);
      setSelectedTime(null);
      setTimeout(() => {
        setStep(1);
        setActiveView('status');
      }, 1200);
    } catch (bookingError) {
      console.error('Error creating booking:', bookingError);
      toastRef.current?.show(bookingError?.message || 'Không thể đặt lịch. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: activeColors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <View style={[styles.headerTopRow, { marginBottom: 15 }]}>
          <ScalePress
            style={{ width: 44, height: 44, justifyContent: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft color={activeColors.text} size={28} />
          </ScalePress>
          <ScalePress
            style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => setSettingsOpen(true)}
          >
            <Settings color={activeColors.text} size={22} />
          </ScalePress>
        </View>
        <View
          style={[
            styles.tabSwitcher,
            {
              backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => setActiveView('booking')}
            style={[
              styles.tab,
              activeView === 'booking' && [
                styles.activeTab,
                { backgroundColor: activeColors.card },
              ],
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeColors.subtext },
                activeView === 'booking' && { color: activeColors.primary },
              ]}
            >
              Đặt lịch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveView('status')}
            style={[
              styles.tab,
              activeView === 'status' && [styles.activeTab, { backgroundColor: activeColors.card }],
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeColors.subtext },
                activeView === 'status' && { color: activeColors.primary },
              ]}
            >
              Đang sửa chữa
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {' '}
        {}
        {activeView === 'booking' ? (
          <View style={styles.bookingContent}>
            <View style={styles.progressContainer}>
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor: activeColors.isDark
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.08)',
                    },
                    step >= i && [
                      styles.activeProgressDot,
                      { backgroundColor: activeColors.primary },
                    ],
                  ]}
                />
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

const getStyles = (theme, activeColors) =>
  StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: theme.spacing.lg, paddingBottom: 120, flexGrow: 1 },
    header: { marginTop: 10, marginBottom: theme.spacing.xl, paddingHorizontal: theme.spacing.lg },
    headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    backBtn: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      marginBottom: 15,
      borderRadius: theme.radius.md,
    },
    tabSwitcher: {
      flexDirection: 'row',
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: 15,
      padding: 4,
    },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
    activeTab: { backgroundColor: activeColors.card },
    tabText: { fontWeight: 'bold', fontSize: 14 },
    activeTabText: { color: activeColors.primary },

    bookingContent: { flex: 1 },
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    progressDot: {
      width: 40,
      height: 4,
      backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
      borderRadius: 2,
      marginHorizontal: 4,
    },
    activeProgressDot: { backgroundColor: activeColors.primary },

    stepContainer: { flex: 1 },
    stepTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: theme.spacing.lg },
    backLinkWrapper: { marginBottom: 8 },
    backLink: { fontSize: 14, fontWeight: '600' },

    optionCard: {
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
    },
    optionIconBox: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.md,
      backgroundColor: activeColors.border + '33',
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionText: { fontSize: 16, fontWeight: 'bold' },
    optionDesc: { fontSize: 12, marginTop: 2, flex: 1 },
    distanceText: { color: activeColors.primary, fontSize: 12, fontWeight: 'bold' },

    dateCard: {
      padding: theme.spacing.md,
      alignItems: 'center',
      minWidth: 80,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      backgroundColor: activeColors.card,
    },
    dateText: { fontSize: 24, fontWeight: 'bold' },
    monthText: { fontSize: 12, marginTop: 4 },
    selectedCard: {
      borderColor: activeColors.primary,
      borderWidth: 1,
      backgroundColor: 'rgba(0,122,255,0.05)',
    },

    timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', flex: 1 },
    timeSlotWrapper: { width: '31%', marginBottom: theme.spacing.md },
    timeCard: {
      padding: theme.spacing.sm,
      alignItems: 'center',
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      backgroundColor: activeColors.card,
    },
    timeText: { fontSize: 15, fontWeight: 'bold' },

    confirmBtn: {
      backgroundColor: activeColors.primary,
      height: 60,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    approvalSection: { marginTop: 40, paddingBottom: 50 },
  });
