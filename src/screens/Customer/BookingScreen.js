import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../theme/Theme';
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

export default function BookingScreen({ navigation }) {
  const toastRef = useRef(null);
  const [activeView, setActiveView] = useState('booking'); // 'booking' or 'status'
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const branches = [
    { id: 'b1', name: 'AnhEm Quận 1', address: '123 Lê Lợi, Quận 1, HCM', distance: '1.2 km' },
    { id: 'b2', name: 'AnhEm Quận 7', address: '456 Nguyễn Văn Linh, Quận 7, HCM', distance: '5.5 km' },
    { id: 'b3', name: 'AnhEm Thủ Đức', address: '789 Võ Văn Ngân, Thủ Đức', distance: '12.0 km' },
  ];

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
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
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
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
      <TouchableOpacity onPress={() => setStep(1)}>
        <Text style={styles.backLink}>← Đổi xe ({selectedVehicle?.name})</Text>
      </TouchableOpacity>
      <Text style={styles.stepTitle}>Chọn chi nhánh gần nhất</Text>
      {branches.map((b, i) => (
        <ScalePress key={i} onPress={() => { setSelectedBranch(b); setStep(3); }}>
          <GlassCard style={styles.optionCard} intensity={15}>
            <View style={[styles.optionIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <MapPin color={Theme.colors.success} size={24} />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.optionText}>{b.name}</Text>
              <Text style={styles.optionDesc}>{b.address}</Text>
            </View>
            <Text style={styles.distanceText}>{b.distance}</Text>
          </GlassCard>
        </ScalePress>
      ))}
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
      <TouchableOpacity onPress={() => setStep(2)}>
        <Text style={styles.backLink}>← Đổi chi nhánh ({selectedBranch?.name})</Text>
      </TouchableOpacity>
      <Text style={styles.stepTitle}>Chọn loại dịch vụ</Text>
      {services.map((s, i) => (
        <ScalePress key={i} onPress={() => { setSelectedService(s.name); setStep(4); }}>
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

  const renderStep4 = () => (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
      <TouchableOpacity onPress={() => setStep(3)}>
        <Text style={styles.backLink}>← Đổi dịch vụ ({selectedService})</Text>
      </TouchableOpacity>
      <Text style={styles.stepTitle}>Chọn thời gian</Text>
      
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

      <View style={styles.timeGrid}>
        {timeSlots.map(time => (
          <ScalePress key={time} style={styles.timeSlotWrapper} onPress={() => setSelectedTime(time)}>
            <GlassCard style={[styles.timeCard, selectedTime === time && styles.selectedCard]} intensity={selectedTime === time ? 40 : 15}>
              <Text style={[styles.timeText, selectedTime === time && { color: '#fff' }]}>{time}</Text>
            </GlassCard>
          </ScalePress>
        ))}
      </View>

      {selectedTime && (
        <ScalePress style={styles.confirmBtn} onPress={handleComplete}>
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
          <ScalePress style={{ width: 44, height: 44, justifyContent: 'center' }} onPress={() => navigation.goBack()}>
              <ChevronLeft color="#fff" size={28} />
          </ScalePress>
          <ScalePress style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('Profile', { openSettings: true })}>
              <Settings color="#fff" size={22} />
          </ScalePress>
        </View>
        <View style={styles.tabSwitcher}>
            <TouchableOpacity onPress={() => setActiveView('booking')} style={[styles.tab, activeView === 'booking' && styles.activeTab]}>
                <Text style={[styles.tabText, activeView === 'booking' && styles.activeTabText]}>Đặt lịch</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveView('status')} style={[styles.tab, activeView === 'status' && styles.activeTab]}>
                <Text style={[styles.tabText, activeView === 'status' && styles.activeTabText]}>Đang sửa chữa</Text>
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {activeView === 'booking' ? (
            <View>
                <View style={styles.progressContainer}>
                    {[1, 2, 3, 4].map(i => (
                        <View key={i} style={[styles.progressDot, step >= i && styles.activeProgressDot]} />
                    ))}
                </View>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scrollContent: { paddingHorizontal: Theme.spacing.lg, paddingBottom: 120, flexGrow: 1 },
  header: { marginTop: 10, marginBottom: Theme.spacing.xl, paddingHorizontal: Theme.spacing.lg },
  backBtn: { width: 44, height: 44, justifyContent: 'center', marginBottom: 15 },
  tabSwitcher: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 15, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: Theme.colors.card },
  tabText: { color: Theme.colors.subtext, fontWeight: 'bold', fontSize: 14 },
  activeTabText: { color: Theme.colors.primary },

  progressContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
  progressDot: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginHorizontal: 4 },
  activeProgressDot: { backgroundColor: Theme.colors.primary },
  
  stepTitle: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: Theme.spacing.lg },
  backLink: { color: Theme.colors.primary, fontSize: 14, fontWeight: '600', marginBottom: 8 },

  optionCard: { padding: Theme.spacing.md, flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.md },
  optionIconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  optionText: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  optionDesc: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2, flex: 1 },
  distanceText: { color: Theme.colors.primary, fontSize: 12, fontWeight: 'bold' },
  
  dateCard: { padding: Theme.spacing.md, alignItems: 'center', minWidth: 80 },
  dateText: { color: Theme.colors.text, fontSize: 24, fontWeight: 'bold' },
  monthText: { color: Theme.colors.subtext, fontSize: 12, marginTop: 4 },
  selectedCard: { borderColor: Theme.colors.primary, borderWidth: 1, backgroundColor: 'rgba(0,122,255,0.05)' },
  
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  timeSlotWrapper: { width: '31%', marginBottom: Theme.spacing.md },
  timeCard: { padding: Theme.spacing.sm, alignItems: 'center' },
  timeText: { color: Theme.colors.subtext, fontSize: 15, fontWeight: 'bold' },

  confirmBtn: { backgroundColor: Theme.colors.primary, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  approvalSection: { marginTop: 40, paddingBottom: 50 }
});

