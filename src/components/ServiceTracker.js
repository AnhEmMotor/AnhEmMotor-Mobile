import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Theme, useActiveColors } from '../theme/Theme';
import { 
  ClipboardCheck, 
  Wrench, 
  SearchCheck, 
  Truck, 
  CalendarClock,
  CheckCircle2
} from 'lucide-react-native';
import PulseView from './PulseView';
import GlassCard from './GlassCard';

const { width } = Dimensions.get('window');

const ServiceTracker = ({ currentStep = 2 }) => {
  const activeColors = useActiveColors();
  const steps = [
    { id: 1, title: 'Đã đặt lịch', icon: CalendarClock },
    { id: 2, title: 'Tiếp nhận', icon: ClipboardCheck },
    { id: 3, title: 'Đang sửa chữa', icon: Wrench },
    { id: 4, title: 'Kiểm tra cuối', icon: SearchCheck },
    { id: 5, title: 'Bàn giao', icon: Truck },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Theo dõi dịch vụ 🛠️</Text>
      <GlassCard style={styles.card} intensity={15}>
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const Icon = step.icon;

            return (
              <View key={step.id} style={styles.stepItem}>
                <View style={styles.iconWrapper}>
                  {isActive ? (
                    <PulseView pulseScale={1.2}>
                      <View style={[styles.iconCircle, styles.activeCircle, { backgroundColor: activeColors.primary, shadowColor: activeColors.primary }]}>
                        <Icon color="#fff" size={20} />
                      </View>
                    </PulseView>
                  ) : (
                    <View style={[
                      styles.iconCircle, 
                      isCompleted ? styles.completedCircle : [styles.pendingCircle, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]
                    ]}>
                      {isCompleted ? (
                        <CheckCircle2 color={activeColors.success} size={20} />
                      ) : (
                        <Icon color={activeColors.subtext} size={20} />
                      )}
                    </View>
                  )}
                  
                  {index < steps.length - 1 && (
                    <View style={[
                      styles.connector, 
                      isCompleted ? [styles.completedConnector, { backgroundColor: activeColors.success }] : [styles.pendingConnector, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]
                    ]} />
                  )}
                </View>
                <Text style={[
                  styles.stepTitle, 
                  isActive ? [styles.activeText, { color: activeColors.primary }] : [styles.pendingText, { color: activeColors.subtext }]
                ]}>
                  {step.title}
                </Text>
              </View>
            );
          })}
        </View>
        
        <View style={[styles.infoBox, { borderTopColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
          <Text style={[styles.infoLabel, { color: activeColors.subtext }]}>Trạng thái hiện tại:</Text>
          <Text style={[styles.infoValue, { color: activeColors.text }]}>
            {steps.find(s => s.id === currentStep)?.title} - Kỹ thuật viên đang kiểm tra tổng quát.
          </Text>
        </View>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  card: { padding: 20 },
  stepsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20 },
  stepItem: { alignItems: 'center', width: (width - 80) / 5 },
  iconWrapper: { alignItems: 'center', height: 40, justifyContent: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  activeCircle: { backgroundColor: Theme.colors.primary, shadowColor: Theme.colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 },
  completedCircle: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  pendingCircle: { backgroundColor: 'rgba(255,255,255,0.05)' },
  connector: { position: 'absolute', right: -((width - 80) / 10) - 10, width: (width - 80) / 5, height: 2, top: 20, zIndex: 0 },
  completedConnector: { backgroundColor: Theme.colors.success },
  pendingConnector: { backgroundColor: 'rgba(255,255,255,0.05)' },
  stepTitle: { fontSize: 9, fontWeight: 'bold', marginTop: 15, textAlign: 'center' },
  activeText: { color: Theme.colors.primary },
  pendingText: { color: Theme.colors.subtext },
  infoBox: { marginTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 15 },
  infoLabel: { color: Theme.colors.subtext, fontSize: 11 },
  infoValue: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginTop: 4 },
});

export default ServiceTracker;
