import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useActiveColors, useTheme } from '../theme/Theme'; // Import useTheme
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
    <View style={getStyles(activeColors).container}>
      <Text style={[getStyles(activeColors).sectionTitle, { color: activeColors.text }]}>Theo dõi dịch vụ 🛠️</Text>
      <GlassCard style={getStyles(activeColors).card} intensity={15}>
        <View style={getStyles(activeColors).stepsContainer}>
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const Icon = step.icon;

            return (
              <View key={step.id} style={getStyles(activeColors).stepItem}>
                <View style={getStyles(activeColors).iconWrapper}>
                  {isActive ? (
                    <PulseView pulseScale={1.2}>
                      <View style={[getStyles(activeColors).iconCircle, getStyles(activeColors).activeCircle, { backgroundColor: activeColors.primary, shadowColor: activeColors.primary }]}>
                        <Icon color="#fff" size={20} />
                      </View>
                    </PulseView>
                  ) : (
                    <View style={[
                      getStyles(activeColors).iconCircle,
                      isCompleted ? getStyles(activeColors).completedCircle : [getStyles(activeColors).pendingCircle, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]
                    ]}>
                      {isCompleted ? (
                        <CheckCircle2 color={activeColors.success} size={20} />
                      ) : (
                        <Icon color={activeColors.subtext} size={20} />
                      )}
                    </View>
                  )}

                  {index < steps.length - 1 && (
                    <View style={[ // Use getStyles for connector
                      getStyles(activeColors).connector,
                      isCompleted ? [getStyles(activeColors).completedConnector, { backgroundColor: activeColors.success }] : [getStyles(activeColors).pendingConnector, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]
                    ]} />
                  )}
                </View>
                <Text style={[ // Use getStyles for stepTitle
                  getStyles(activeColors).stepTitle,
                  isActive ? [getStyles(activeColors).activeText, { color: activeColors.primary }] : [getStyles(activeColors).pendingText, { color: activeColors.subtext }]
                ]}>
                  {step.title}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={[styles.infoBox, { borderTopColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
          <Text style={[getStyles(activeColors).infoLabel, { color: activeColors.subtext }]}>Trạng thái hiện tại:</Text>
          <Text style={[getStyles(activeColors).infoValue, { color: activeColors.text }]}>
            {steps.find(s => s.id === currentStep)?.title} - Kỹ thuật viên đang kiểm tra tổng quát.
          </Text>
        </View>
      </GlassCard>
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: { marginTop: 20 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  card: { padding: 20 },
  stepsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20 },
  stepItem: { alignItems: 'center', width: (width - 80) / 5 },
  iconWrapper: { alignItems: 'center', height: 40, justifyContent: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  activeCircle: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 }, // Use colors.primary
  completedCircle: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  pendingCircle: { backgroundColor: 'rgba(255,255,255,0.05)' },
  connector: { position: 'absolute', right: -((width - 80) / 10) - 10, width: (width - 80) / 5, height: 2, top: 20, zIndex: 0 },
  completedConnector: { backgroundColor: colors.success }, // Use colors.success
  pendingConnector: { backgroundColor: 'rgba(255,255,255,0.05)' },
  stepTitle: { fontSize: 9, fontWeight: 'bold', marginTop: 15, textAlign: 'center' },
  activeText: { color: colors.primary },
  pendingText: { color: colors.subtext },
  infoBox: { marginTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 15 },
  infoLabel: { color: colors.subtext, fontSize: 11 },
  infoValue: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginTop: 4 },
});

export default ServiceTracker;
