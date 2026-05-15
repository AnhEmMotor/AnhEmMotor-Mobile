import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, QrCode, Zap } from 'lucide-react-native';
import { Theme } from '../../theme/Theme';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';

const { width } = Dimensions.get('window');

export default function QRScanScreen({ navigation }) {
  const scanPos = useSharedValue(0);

  React.useEffect(() => {
    scanPos.value = withRepeat(withTiming(250, { duration: 2000 }), -1, true);
  }, []);

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanPos.value }]
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#fff" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quét mã QR</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.hintText}>Hướng camera về phía mã QR trên xe hoặc giấy tờ</Text>
        
        <View style={styles.scanFrameContainer}>
            <View style={styles.scanFrame}>
                <Animated.View style={[styles.scanLine, scanStyle]} />
                
                {/* Corners */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
            </View>
        </View>

        <ScalePress style={styles.flashBtn}>
            <Zap color="#fff" size={20} />
            <Text style={styles.flashText}>Bật đèn Flash</Text>
        </ScalePress>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Mã định danh xe giúp bạn truy cập nhanh lịch sử bảo trì và thông tin sở hữu.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, height: 60 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  hintText: { color: '#fff', fontSize: 14, textAlign: 'center', marginBottom: 40, opacity: 0.8 },
  
  scanFrameContainer: { width: width * 0.7, height: width * 0.7, marginBottom: 50 },
  scanFrame: { flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 30, overflow: 'hidden', position: 'relative' },
  scanLine: { height: 2, width: '100%', backgroundColor: Theme.colors.primary, position: 'absolute', top: 20 },
  
  corner: { position: 'absolute', width: 20, height: 20, borderColor: Theme.colors.primary, borderWidth: 4 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 15 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 15 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 15 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 15 },
  
  flashBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25 },
  flashText: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 10 },
  
  footer: { padding: 40, alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, textAlign: 'center', lineHeight: 18 }
});
