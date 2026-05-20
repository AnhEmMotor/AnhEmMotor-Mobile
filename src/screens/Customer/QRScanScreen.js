import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, QrCode, Zap, Settings } from 'lucide-react-native';
import { useTheme } from '../../theme/Theme'; // Import useTheme
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';

const { width } = Dimensions.get('window');

export default function QRScanScreen({ navigation }) {
  const scanPos = useSharedValue(0);
  const theme = useTheme(); // Use the useTheme hook

  React.useEffect(() => {
    scanPos.value = withRepeat(withTiming(250, { duration: 2000 }), -1, true);
  }, []);

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanPos.value }] // This is fine
  }));

  return (
    <SafeAreaView style={[getStyles(theme).container, { backgroundColor: '#000' }]} edges={['top']}>
      <View style={getStyles(theme).header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#fff" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quét mã QR</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('CustomerHome', { screen: 'Profile', params: { openSettings: true } })}>
          <Settings color="#fff" size={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[getStyles(theme).hintText, { color: '#fff' }]}>Hướng camera về phía mã QR trên xe hoặc giấy tờ</Text>
        
        <View style={getStyles(theme).scanFrameContainer}>
            <View style={[getStyles(theme).scanFrame, { borderColor: theme.colors.border + '33' }]}>
                <Animated.View style={[styles.scanLine, scanStyle]} />
                
                {/* Corners */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
            </View>
        </View>

        <ScalePress style={[getStyles(theme).flashBtn, { backgroundColor: theme.colors.border + '33' }]}>
            <Zap color="#fff" size={20} />
            <Text style={[getStyles(theme).flashText, { color: '#fff' }]}>Bật đèn Flash</Text>
        </ScalePress>
      </View>

      <View style={getStyles(theme).footer}>
        <Text style={[getStyles(theme).footerText, { color: theme.colors.subtext + '80' }]}>Mã định danh xe giúp bạn truy cập nhanh lịch sử bảo trì và thông tin sở hữu.</Text>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.md, height: 60 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: theme.radius.md },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' }, // Still hardcoded white for dark background
  
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.spacing.xxl },
  hintText: { fontSize: 14, textAlign: 'center', marginBottom: 40, opacity: 0.8 },
  
  scanFrameContainer: { width: width * 0.7, height: width * 0.7, marginBottom: 50 }, // This is fine
  scanFrame: { flex: 1, borderWidth: 1, borderRadius: 30, overflow: 'hidden', position: 'relative' },
  scanLine: { height: 2, width: '100%', backgroundColor: theme.colors.primary, position: 'absolute', top: 20 }, // This is fine
  
  corner: { position: 'absolute', width: 20, height: 20, borderColor: theme.colors.primary, borderWidth: 4 }, // This is fine
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 15 }, // This is fine
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 15 }, // This is fine
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 15 }, // This is fine
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 15 }, // This is fine
  
  flashBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25 },
  flashText: { fontSize: 14, fontWeight: 'bold', marginLeft: 10 },
  
  footer: { padding: theme.spacing.xxl, alignItems: 'center' },
  footerText: { fontSize: 12, textAlign: 'center', lineHeight: 18 }
});
