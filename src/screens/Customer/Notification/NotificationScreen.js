import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Image, 
  Alert,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalState } from '../../../context/GlobalState';
import { Theme } from '../../../theme/Theme';
import { 
  Bell, 
  Wrench, 
  FileText, 
  ChevronLeft, 
  CalendarClock, 
  ShieldCheck,
  Gift,
  AlertTriangle,
  Map,
  ClipboardCheck,
  Truck,
  CheckCircle,
  Clock,
  UserCheck,
  Share2,
  Copy,
  Download,
  Info,
  Key,
  Lock,
  Unlock,
  MessageSquare,
  Settings
} from 'lucide-react-native';
import GlassCard from '../../../components/GlassCard';
import ScalePress from '../../../components/ScalePress';
import EmptyState from '../../../components/EmptyState';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { moderateScale } from '../../../utils/responsive';
import { useNotification } from './useNotification';
import { styles } from './styles';

export default function NotificationScreen({ navigation }) {
  const { themeMode } = useGlobalState();
  const systemScheme = useColorScheme();
  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  const activeColors = {
    background: isDark ? '#0B0F19' : '#F8FAFC',
    card: isDark ? '#1E293B' : '#FFFFFF',
    cardBg: isDark ? '#1E293B' : '#FFFFFF',
    text: isDark ? '#F8FAFC' : '#0F172A',
    subtext: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
  };

  const logic = useNotification(navigation);
  const [copied, setCopied] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'delivery':
        return <Truck color={Theme.colors.warning} size={22} />;
      case 'process':
        return <FileText color={Theme.colors.primary} size={22} />;
      case 'maintenance':
        return <Wrench color={Theme.colors.warning} size={22} />;
      case 'workshop':
        return <Wrench color="#10B981" size={22} />;
      case 'cleancar':
        return <ShieldCheck color="#10B981" size={22} />;
      case 'loyalty_level':
        return <Gift color="#A855F7" size={22} />;
      case 'voucher_expiry':
      case 'birthday':
        return <Gift color={Theme.colors.primary} size={22} />;
      case 'referral':
        return <Gift color="#3B82F6" size={22} />;
      case 'recall':
      case 'paperwork':
        return <AlertTriangle color={Theme.colors.error} size={22} />;
      case 'invoice':
        return <FileText color="#10B981" size={22} />;
      case 'feedback':
        return <MessageSquare color="#3B82F6" size={22} />;
      case 'security':
        return <Lock color={Theme.colors.error} size={22} />;
      default:
        return <Bell color={Theme.colors.primary} size={22} />;
    }
  };

  const getIconBg = (category) => {
    switch (category) {
      case 'service':
        return styles.iconService;
      case 'loyalty':
        return styles.iconLoyalty;
      case 'system':
        return styles.iconSystem;
      default:
        return { backgroundColor: 'rgba(255,255,255,0.05)' };
    }
  };

  const handleCopy = (text) => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderActiveModalContent = () => {
    if (!logic.selectedNotif) return null;

    switch (logic.activeModal) {
      case 'deliveryMap':
        return (
          <View>
            <View style={[styles.mapContainer, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: activeColors.border }]}>
              {/* Fake Map Grid */}
              <View style={[styles.mapGrid, { opacity: isDark ? 0.15 : 0.08 }]} />
              
              {/* Delivery Route */}
              <View style={styles.roadLine} />
              <View style={[styles.roadActiveLine, { width: '70%', backgroundColor: Theme.colors.warning }]} />
              
              {/* Warehouse Node */}
              <View style={styles.warehouseNode}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
                  <Map color={isDark ? '#94A3B8' : '#64748B'} size={16} />
                </View>
                <Text style={[styles.nodeLabel, { color: activeColors.text }]}>Kho Tổng</Text>
              </View>

              {/* Truck Node */}
              <View style={[styles.truckNode, { left: '55%' }]}>
                <Animated.View entering={FadeInDown.delay(300)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(217, 119, 6, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 4, borderWidth: 1, borderColor: Theme.colors.warning }}>
                  <Truck color={Theme.colors.warning} size={18} />
                </Animated.View>
                <Text style={[styles.nodeLabel, { color: Theme.colors.warning, fontWeight: 'bold' }]}>Đang chở</Text>
              </View>

              {/* Showroom Biên Hòa */}
              <View style={styles.showroomNode}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(16, 185, 129, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 4, borderWidth: 1, borderColor: '#10B981' }}>
                  <Map color="#10B981" size={16} />
                </View>
                <Text style={[styles.nodeLabel, { color: '#10B981', fontWeight: 'bold' }]}>Biên Hòa</Text>
              </View>
              
              <View style={{ position: 'absolute', bottom: 12, left: 12, right: 12, backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: activeColors.border }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 }} />
                <Text style={{ color: activeColors.text, fontSize: moderateScale(10), fontWeight: 'bold' }}>GPS: Xe SH 160i cách Showroom 4.2 km</Text>
              </View>
            </View>
            <Text style={{ color: activeColors.subtext, fontSize: moderateScale(12), lineHeight: 18, marginBottom: 20, textAlign: 'center' }}>
              Hệ thống vận tải của AnhEmMotor đang cập nhật hành trình vận chuyển xe máy từ tổng kho về Biên Hòa. Bạn có thể theo dõi xe tải trung chuyển cập bến trực tiếp để nhận bàn giao xe.
            </Text>
          </View>
        );

      case 'workshop':
        return (
          <View style={[styles.workshopCard, { borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)', backgroundColor: isDark ? 'rgba(16, 185, 129, 0.02)' : 'rgba(16, 185, 129, 0.05)' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: activeColors.border, paddingBottom: 10 }}>
              <Text style={[styles.workshopTitle, { color: '#10B981' }]}>Phiếu dịch vụ #SVC-55555</Text>
              <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ color: '#10B981', fontSize: moderateScale(9), fontWeight: '900' }}>LIVE WORKSHOP</Text>
              </View>
            </View>
            
            <View style={[styles.techRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', padding: 12, borderRadius: 12, marginBottom: 15, borderBottomWidth: 0 }]}>
              <View style={[styles.techAvatar, { backgroundColor: Theme.colors.primary }]}>
                <Text style={styles.techAvatarText}>H</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.techName, { color: activeColors.text }]}>KTV. Nguyễn Văn Hùng</Text>
                <Text style={[styles.techTitle, { color: activeColors.subtext }]}>Kỹ thuật viên trưởng bàn số 3</Text>
              </View>
              <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                <Text style={{ color: '#10B981', fontSize: moderateScale(10), fontWeight: 'bold' }}>Đang bảo dưỡng</Text>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              {[
                { name: '1. Nhớt máy Motul Gold 10W40', status: '✓ Đã thay', color: '#10B981' },
                { name: '2. Lọc gió động cơ Honda chính hãng', status: '✓ Đã thay', color: '#10B981' },
                { name: '3. Vệ sinh buồng đốt & Kim phun', status: '✓ Đã thay', color: '#10B981' },
                { name: '4. Kiểm tra nước làm mát & Điện ắc quy', status: '⚙ Đang đo', color: Theme.colors.warning }
              ].map((item, index) => (
                <View key={index} style={[styles.partItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)', borderBottomWidth: 0, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 }]}>
                  <Text style={[styles.partName, { color: activeColors.text, fontSize: moderateScale(11) }]}>{item.name}</Text>
                  <Text style={[styles.partDone, { color: item.color, fontSize: moderateScale(10), fontWeight: 'bold' }]}>{item.status}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'referral':
        return (
          <View style={{ alignItems: 'center' }}>
            <View style={[styles.couponCard, { backgroundColor: isDark ? '#1E1B4B' : '#F5F3FF', borderWidth: 1, borderColor: isDark ? 'rgba(99, 102, 241, 0.25)' : '#C7D2FE', width: '100%', borderRadius: 16 }]}>
              <Text style={[styles.couponLabel, { color: isDark ? '#818CF8' : '#6366F1' }]}>MÃ GIỚI THIỆU CỦA BẠN</Text>
              <Text style={[styles.couponCodeText, { color: isDark ? '#fff' : '#4338CA', fontSize: moderateScale(22) }]}>{logic.selectedNotif.referralCode || 'AEM-KHOI-GOLD'}</Text>
              <Text style={[styles.couponDesc, { color: activeColors.subtext, fontSize: moderateScale(11), lineHeight: 16 }]}>
                Bạn bè mua xe sử dụng mã này sẽ được giảm thẳng 500.000đ. Bản thân bạn sẽ được tặng ngay Voucher 500.000đ dịch vụ vào ví đặc quyền.
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', width: '100%', marginBottom: 15, marginTop: 15 }}>
              <TouchableOpacity 
                style={{ flex: 1, height: 48, borderRadius: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: activeColors.border }}
                onPress={() => handleCopy(logic.selectedNotif.referralCode)}
              >
                <Copy color={activeColors.text} size={14} />
                <Text style={{ color: activeColors.text, fontSize: moderateScale(12), fontWeight: 'bold', marginLeft: 8 }}>
                  {copied ? 'Đã copy!' : 'Copy mã'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ flex: 1, height: 48, borderRadius: 12, backgroundColor: Theme.colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => Alert.alert('Thành công', 'Đã chia sẻ mã giới thiệu lên mạng xã hội!')}
              >
                <Share2 color="#fff" size={14} />
                <Text style={{ color: '#fff', fontSize: moderateScale(12), fontWeight: 'bold', marginLeft: 8 }}>Chia sẻ mã</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'voucher':
        return (
          <View style={{ alignItems: 'center', width: '100%' }}>
            <View style={[styles.barcodeContainer, { backgroundColor: '#FFFFFF', borderRadius: 16, width: '100%', padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: '#E2E8F0' }]}>
              <Text style={{ color: '#475569', fontSize: moderateScale(9), fontWeight: '900', marginBottom: 15, letterSpacing: 0.8, textAlign: 'center' }}>QUÉT MÃ TẠI QUẦY GIAO DỊCH SHOWROOM</Text>
              
              {/* Mock Barcode lines */}
              <View style={[styles.barcodeFake, { height: 50, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-around', width: '90%' }]}>
                {[1,3,2,1,4,2,3,1,2,4,1,2,3,2,1,3,4,1,2,3,1,2,1,3,1].map((w, i) => (
                  <View key={i} style={[styles.barcodeBar, { width: w, backgroundColor: '#000000', height: '100%' }]} />
                ))}
              </View>
              
              <Text style={[styles.barcodeText, { color: '#000000', fontSize: moderateScale(15), fontWeight: '900', letterSpacing: 3, textAlign: 'center' }]}>{logic.selectedNotif.voucherCode || 'VOUCHER-9982'}</Text>
            </View>
            <Text style={[styles.modalTitle, { color: activeColors.text, fontSize: moderateScale(15), fontWeight: 'bold', textAlign: 'center', marginVertical: 12, borderBottomWidth: 0, marginBottom: 5 }]}>
              {logic.selectedNotif.voucherName}
            </Text>
            <Text style={{ color: activeColors.subtext, fontSize: moderateScale(11), textAlign: 'center', lineHeight: 17, marginBottom: 20 }}>
              Voucher được lưu tự động trong Ví ưu đãi của ứng dụng AnhEmMotor. Đưa mã vạch hoặc đọc mã trên cho nhân viên bán hàng để khấu trừ trực tiếp vào giá hóa đơn.
            </Text>
          </View>
        );

      case 'invoice':
        return (
          <View>
            <View style={[styles.invoiceSheet, { backgroundColor: isDark ? '#1C1917' : '#F8FAFC', borderWidth: 1, borderColor: activeColors.border, borderRadius: 16, padding: 16, marginBottom: 15 }]}>
              <View style={[styles.invoiceHeader, { borderBottomWidth: 1, borderBottomColor: activeColors.border, paddingBottom: 10, marginBottom: 12 }]}>
                <Text style={[styles.invoiceLogo, { color: Theme.colors.primary }]}>AnhEmMotor 🏍️</Text>
                <Text style={[styles.invoiceTitle, { color: activeColors.subtext, fontSize: moderateScale(10), fontWeight: 'bold' }]}>HÓA ĐƠN ĐIỆN TỬ (E-INVOICE)</Text>
              </View>
              
              <View style={{ gap: 8 }}>
                {[
                  { label: 'Mã hóa đơn', val: logic.selectedNotif.invoiceNumber || '#AEM-9982' },
                  { label: 'Khách hàng', val: 'Nguyễn Văn Khôi' },
                  { label: 'Sản phẩm', val: 'Honda SH 160i Thể thao' },
                  { label: 'Nơi cấp hóa đơn', val: 'Tổng cục Thuế Việt Nam' },
                  { label: 'Trạng thái pháp lý', val: '● Hợp lệ / Đã kê khai', color: '#10B981' }
                ].map((row, idx) => (
                  <View key={idx} style={[styles.invoiceRow, { borderBottomWidth: 0, paddingVertical: 2, flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <Text style={[styles.invoiceLabel, { color: activeColors.subtext, fontSize: moderateScale(11) }]}>{row.label}</Text>
                    <Text style={[styles.invoiceVal, { color: row.color || activeColors.text, fontSize: moderateScale(11), fontWeight: 'bold' }]}>{row.val}</Text>
                  </View>
                ))}
              </View>
              
              <View style={[styles.invoiceTotalRow, { borderTopWidth: 1, borderTopColor: activeColors.border, paddingTop: 10, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={{ color: activeColors.subtext, fontWeight: 'bold', fontSize: moderateScale(11) }}>TỔNG CỘNG</Text>
                <Text style={[styles.invoiceTotalVal, { color: '#10B981', fontSize: moderateScale(16), fontWeight: 'bold' }]}>{logic.selectedNotif.invoiceTotal || '105.000.000đ'}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.modalActionBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderWidth: 1, borderColor: activeColors.border, marginBottom: 15, height: 48, borderRadius: 12 }]}
              onPress={() => Alert.alert('Tải xuống', 'Hóa đơn đã được lưu dưới dạng PDF vào thư mục Downloads!')}
            >
              <Download color={activeColors.text} size={14} />
              <Text style={{ color: activeColors.text, fontWeight: 'bold', marginLeft: 8, fontSize: moderateScale(12) }}>Tải về file PDF Hóa đơn</Text>
            </TouchableOpacity>
          </View>
        );

      case 'feedback':
        return (
          <View>
            <View style={[styles.letterPaper, { backgroundColor: isDark ? '#1E1B4B' : '#FEFBF3', borderWidth: 1, borderColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#E5E0D8', borderRadius: 16, padding: 16, marginBottom: 15 }]}>
              <View style={[styles.letterHeader, { borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : '#EBE5DA', paddingBottom: 8, marginBottom: 12 }]}>
                <Text style={[styles.letterLogo, { color: isDark ? '#818CF8' : '#8B5A2B', fontSize: moderateScale(12), fontWeight: 'bold' }]}>ANHEMMOTOR BIÊN HÒA</Text>
                <Text style={[styles.letterDate, { color: activeColors.subtext, fontSize: moderateScale(10) }]}>Ngày 16 tháng 05 năm 2026</Text>
              </View>
              
              <Text style={[styles.letterBody, { color: isDark ? '#fff' : '#4A3E31', fontSize: moderateScale(12), fontStyle: 'italic', lineHeight: 20 }]}>
                "{logic.selectedNotif.feedbackContent}"
              </Text>
              
              <Text style={[styles.letterFooter, { color: isDark ? '#818CF8' : '#8B5A2B', fontSize: moderateScale(11), fontWeight: 'bold', textAlign: 'right', marginTop: 15 }]}>Ban Điều Hành Showroom</Text>
            </View>
            <Text style={{ color: activeColors.subtext, fontSize: moderateScale(11), textAlign: 'center', lineHeight: 16, marginBottom: 20 }}>
              Góp ý của quý khách là động lực to lớn giúp AnhEmMotor cải tiến quy trình phục vụ ngày một tốt hơn.
            </Text>
          </View>
        );

      case 'process':
        return (
          <View style={[styles.workshopCard, { borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)', backgroundColor: isDark ? 'rgba(59, 130, 246, 0.02)' : 'rgba(59, 130, 246, 0.05)' }]}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: activeColors.border, paddingBottom: 10, marginBottom: 12 }}>
              <Text style={[styles.workshopTitle, { color: '#3B82F6' }]}>Quy trình thủ tục Hành chính</Text>
            </View>
            <View style={{ paddingVertical: 5, gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                  <Text style={{ color: '#fff', fontSize: moderateScale(10), fontWeight: 'bold' }}>1</Text>
                </View>
                <Text style={{ color: activeColors.subtext, fontSize: moderateScale(12), flex: 1 }}>Khai thuế trước bạ online (Đã hoàn thành)</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: Theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                  <Text style={{ color: '#fff', fontSize: moderateScale(10), fontWeight: 'bold' }}>2</Text>
                </View>
                <Text style={{ color: activeColors.text, fontSize: moderateScale(12), fontWeight: 'bold', flex: 1 }}>Bấm biển số tại Biên Hòa (Đang tiến hành)</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                  <Text style={{ color: activeColors.subtext, fontSize: moderateScale(10) }}>3</Text>
                </View>
                <Text style={{ color: activeColors.subtext, fontSize: moderateScale(12), flex: 1 }}>Lắp biển, rửa xe giao khách (Chờ xử lý)</Text>
              </View>
            </View>
          </View>
        );

      case 'cleancar':
        return (
          <View style={{ alignItems: 'center', paddingVertical: 15 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(16, 185, 129, 0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#10B981', marginBottom: 15 }}>
              <ShieldCheck color="#10B981" size={32} />
            </View>
            <Text style={{ color: activeColors.text, fontSize: moderateScale(16), fontWeight: 'bold', marginBottom: 10 }}>Chứng nhận Đạt chuẩn Xe Sạch</Text>
            <Text style={{ color: activeColors.subtext, fontSize: moderateScale(12), textAlign: 'center', lineHeight: 18, marginBottom: 20 }}>
              Hệ thống AnhEmMotor xác thực chiếc xe của bạn đã được kiểm tra, thay dầu chính hãng đầy đủ và cập nhật lịch trình chăm sóc kỹ thuật minh bạch trên Blockchain. Xe được cấp nhãn hiệu "Xe Sạch" nâng cao giá trị thanh lý sau này.
            </Text>
          </View>
        );

      case 'insurance':
        return (
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(217, 119, 6, 0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Theme.colors.warning, marginBottom: 15 }}>
              <ShieldCheck color={Theme.colors.warning} size={32} />
            </View>
            <Text style={{ color: activeColors.text, fontSize: moderateScale(15), fontWeight: 'bold', marginBottom: 10 }}>Gia hạn bảo hiểm xe máy trực tuyến</Text>
            <Text style={{ color: activeColors.subtext, fontSize: moderateScale(12), textAlign: 'center', lineHeight: 18, marginBottom: 20 }}>
              Chúng tôi liên kết trực tiếp với các đơn vị bảo hiểm uy tín (PVI, Bảo Việt, PJICO). Bạn có thể bấm nút tiếp tục thanh toán để nhận ngay giấy chứng nhận bảo hiểm điện tử trực tiếp trên app chỉ trong 2 phút.
            </Text>
            <TouchableOpacity 
              style={[styles.modalActionBtn, { marginBottom: 15, height: 48, borderRadius: 12 }]}
              onPress={() => Alert.alert('Thành công', 'Hệ thống đã mở liên kết cổng thanh toán Bảo hiểm PVI!')}
            >
              <Text style={[styles.modalActionText, { fontSize: moderateScale(13) }]}>Gia hạn ngay 🛡️</Text>
            </TouchableOpacity>
          </View>
        );

      case 'security':
        return (
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(225, 29, 72, 0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E11D48', marginBottom: 15 }}>
              <Lock color="#E11D48" size={32} />
            </View>
            <Text style={{ color: activeColors.text, fontSize: moderateScale(15), fontWeight: 'bold', marginBottom: 10 }}>Nâng cấp bảo mật tài khoản</Text>
            <Text style={{ color: activeColors.subtext, fontSize: moderateScale(12), textAlign: 'center', lineHeight: 18, marginBottom: 20 }}>
              Mật khẩu tài khoản của bạn nên được cập nhật định kỳ để tăng tính an toàn, bảo vệ thông tin hóa đơn mua sắm và lịch sử bảo dưỡng xe tại AnhEmMotor.
            </Text>
            <TouchableOpacity 
              style={[styles.modalActionBtn, { marginBottom: 15, height: 48, borderRadius: 12 }]}
              onPress={() => Alert.alert('Thành công', 'Đã gửi mã OTP đổi mật khẩu về số điện thoại của bạn!')}
            >
              <Text style={[styles.modalActionText, { fontSize: moderateScale(13) }]}>Đổi mật khẩu mới 🔒</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return (
          <View>
            <Text style={{ color: activeColors.text, fontSize: moderateScale(13), lineHeight: 18, marginBottom: 25, textAlign: 'center' }}>
              {logic.selectedNotif.desc}
            </Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      {/* HEADER SECTION */}
      <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.header}>
        <ScalePress style={[styles.backBtn, { backgroundColor: activeColors.cardBg, borderColor: activeColors.border }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={activeColors.text} size={24} />
        </ScalePress>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Thông báo 🔔</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={logic.markAllAsRead} style={{ marginRight: 12 }}>
            <Text style={styles.markReadText}>Đọc tất cả</Text>
          </TouchableOpacity>
          <ScalePress 
            style={[styles.backBtn, { backgroundColor: activeColors.cardBg, borderColor: activeColors.border, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }]} 
            onPress={() => navigation.navigate('Profile', { openSettings: true })}
          >
            <Settings color={activeColors.text} size={20} />
          </ScalePress>
        </View>
      </Animated.View>

      {/* FILTER ROW (Unread Toggle) */}
      <View style={styles.controlsRow}>
        <TouchableOpacity 
          style={[styles.filterBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderColor: activeColors.border }, logic.unreadOnly && styles.filterBadgeActive]}
          onPress={() => logic.setUnreadOnly(prev => !prev)}
        >
          <Text style={[styles.filterBadgeText, { color: activeColors.subtext }, logic.unreadOnly && styles.filterBadgeTextActive]}>
            {logic.unreadOnly ? '● Chỉ chưa đọc' : 'Tất cả thông báo'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* TABS SELECTOR */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        style={styles.tabBarScroll}
        contentContainerStyle={[styles.tabBarContent, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }]}
      >
        {[
          { id: 'service', label: '🛠️ Dịch vụ' },
          { id: 'loyalty', label: '🎟️ Quà tặng' },
          { id: 'system', label: '🛡️ Hệ thống' },
          { id: 'feedback', label: '💬 Ý kiến' },
        ].map(tab => {
          const count = logic.tabUnreadCounts[tab.id];
          const isSelected = logic.activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab, 
                isSelected && [styles.activeTab, { backgroundColor: activeColors.cardBg }]
              ]}
              onPress={() => logic.setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabText, 
                { color: activeColors.subtext },
                isSelected && [styles.activeTabText, { color: Theme.colors.primary, fontWeight: 'bold' }]
              ]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* NOTIFICATIONS STREAM */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {logic.activeTab === 'service' ? (
          <View>
            {/* Switch to toggle Active Workshop for demonstration */}
            <View style={[styles.demoToggleContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderColor: activeColors.border }]}>
              <Text style={[styles.demoToggleText, { color: activeColors.subtext }]}>Mô phỏng xe tại xưởng Biên Hòa:</Text>
              <TouchableOpacity 
                style={[
                  styles.demoToggleButton, 
                  logic.hasActiveWorkshop ? styles.demoToggleButtonActive : [styles.demoToggleButtonInactive, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: activeColors.border }]
                ]}
                onPress={() => logic.setHasActiveWorkshop(!logic.hasActiveWorkshop)}
              >
                <Text style={[styles.demoToggleButtonLabel, { color: logic.hasActiveWorkshop ? '#10B981' : activeColors.subtext }]}>
                  {logic.hasActiveWorkshop ? 'ĐANG CÓ XE (BẬT)' : 'KHÔNG CÓ XE (ẨN)'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Block 1: Trạng thái Sửa chữa Trực tuyến */}
            {logic.hasActiveWorkshop && (
              <Animated.View entering={FadeInDown.duration(500)} style={styles.workshopLiveCard}>
                <View style={styles.workshopLiveHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Wrench color="#10B981" size={18} style={{ marginRight: 6 }} />
                    <Text style={styles.workshopLiveTitle}>Trạng thái Sửa chữa Trực tuyến</Text>
                  </View>
                  <View style={styles.livePulseBadge}>
                    <View style={styles.livePulseDot} />
                    <Text style={styles.livePulseText}>TRỰC TIẾP</Text>
                  </View>
                </View>

                <Text style={[styles.vehicleInfoText, { color: activeColors.text }]}>Xe Honda SH 160i (Biển số: 60-A1 555.55)</Text>

                {/* KTV Info */}
                <View style={[styles.ktvRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderColor: activeColors.border }]}>
                  <View style={styles.ktvAvatar}>
                    <Text style={styles.ktvAvatarText}>H</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.ktvName, { color: activeColors.text }]}>KTV. Nguyễn Văn Hùng</Text>
                    <Text style={[styles.ktvSub, { color: activeColors.subtext }]}>Kỹ thuật viên trưởng bàn số 3 (Tay nghề 8 năm)</Text>
                  </View>
                </View>

                {/* Steppers */}
                <View style={styles.stepperContainer}>
                  {[
                    { step: 1, label: '1. Đang khám xe', desc: 'Kiểm tra lỗi tổng quát bằng máy đọc lỗi OBD chính hãng' },
                    { step: 2, label: '2. Đang sửa chữa / thay phụ tùng', desc: 'Đang thay nhớt máy Motul Gold & lọc gió Honda chính hãng' },
                    { step: 3, label: '3. Kiểm tra kỹ thuật cuối', desc: 'KTV trưởng test xe thực tế, đo thông số khí thải, an toàn' },
                    { step: 4, label: '4. Rửa xe & Sẵn sàng giao', desc: 'Rửa bọt tuyết siêu bóng sạch, bàn giao chìa khóa cho khách' }
                  ].map((item) => {
                    const isCompleted = item.step < logic.workshopStep;
                    const isActive = item.step === logic.workshopStep;
                    const isPending = item.step > logic.workshopStep;

                    return (
                      <View key={item.step} style={styles.stepItem}>
                        {/* Step Line */}
                        {item.step < 4 && (
                          <View style={[
                            styles.stepLine, 
                            isCompleted ? styles.stepLineCompleted : [styles.stepLinePending, { backgroundColor: activeColors.border }]
                          ]} />
                        )}

                        {/* Step Indicator Dot */}
                        <View style={[
                          styles.stepIndicator,
                          isCompleted && styles.stepIndicatorCompleted,
                          isActive && styles.stepIndicatorActive,
                          isPending && [styles.stepIndicatorPending, { backgroundColor: activeColors.card, borderColor: activeColors.border }]
                        ]}>
                          {isCompleted ? (
                            <CheckCircle color="#fff" size={12} />
                          ) : isActive ? (
                            <View style={styles.activeDotInner} />
                          ) : (
                            <Text style={[styles.pendingStepText, { color: activeColors.subtext }]}>{item.step}</Text>
                          )}
                        </View>

                        {/* Step Content */}
                        <View style={styles.stepContent}>
                          <Text style={[
                            styles.stepLabel,
                            { color: activeColors.subtext },
                            isActive && styles.stepLabelActive,
                            isCompleted && [styles.stepLabelCompleted, { color: activeColors.text }],
                          ]}>
                            {item.label}
                          </Text>
                          <Text style={[
                            styles.stepDesc,
                            { color: activeColors.subtext, opacity: 0.8 },
                            isActive && styles.stepDescActive
                          ]}>
                            {item.desc}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </Animated.View>
            )}

            {/* Block 2: Nhắc lịch Bảo dưỡng Thông minh */}
            <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CalendarClock color={Theme.colors.warning} size={18} style={{ marginRight: 6 }} />
                  <Text style={styles.alertTitle}>Nhắc Lịch Bảo Dưỡng Thông Minh</Text>
                </View>
                <View style={styles.alertBadge}>
                  <Text style={styles.alertBadgeText}>KHUYÊN DÙNG</Text>
                </View>
              </View>
              
              <Text style={[styles.alertDesc, { color: activeColors.text }]}>
                Xe SH 160i (60-A1 555.55) của bạn đã chạy thêm <Text style={{fontWeight: 'bold', color: Theme.colors.warning}}>2,000km</Text>. Đã đến lúc thay nhớt máy và kiểm tra tổng quát để đảm bảo xe luôn bốc và an toàn.
              </Text>

              <View style={[styles.odoContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.04)' }]}>
                <View style={styles.odoBarBg}>
                  <View style={[styles.odoBarActive, { width: '80%' }]} />
                </View>
                <View style={styles.odoLabels}>
                  <Text style={[styles.odoLabelText, { color: activeColors.subtext }]}>Lần bảo dưỡng trước</Text>
                  <Text style={[styles.odoLabelText, { fontWeight: 'bold', color: Theme.colors.warning }]}>+2,000 km (Thay nhớt máy)</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.alertCtaButton}
                onPress={() => logic.setBookingModalVisible(true)}
              >
                <Text style={styles.alertCtaText}>Đặt lịch ngay</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Block 3: Nhật ký "Xe Sạch" */}
            <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.historySection}>
              <View style={styles.historyHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ShieldCheck color="#10B981" size={18} style={{ marginRight: 6 }} />
                  <Text style={styles.historyTitle}>Nhật Ký "Xe Sạch" (Lịch Sử Dịch Vụ)</Text>
                </View>
              </View>
              <Text style={[styles.historySubtitle, { color: activeColors.subtext }]}>Cuốn sổ bảo hành điện tử thay thế hoàn toàn sổ giấy, lưu trọn đời tại AnhEmMotor</Text>

              {logic.serviceHistory.map((item) => (
                <View key={item.id} style={[styles.historyItemCard, { backgroundColor: activeColors.cardBg, borderColor: activeColors.border }]}>
                  <View style={styles.historyItemHeader}>
                    <View>
                      <Text style={[styles.historyItemDate, { color: activeColors.text }]}>{item.date}</Text>
                      <Text style={[styles.historyItemLocation, { color: activeColors.subtext }]}>{item.location}</Text>
                    </View>
                    <View style={styles.cleanCarBadge}>
                      <ShieldCheck color="#10B981" size={12} style={{ marginRight: 3 }} />
                      <Text style={styles.cleanCarBadgeText}>✓ Đạt chuẩn Xe Sạch</Text>
                    </View>
                  </View>

                  <Text style={[styles.historyPartsTitle, { color: activeColors.subtext }]}>Phụ tùng đã thay & Dịch vụ:</Text>
                  <Text style={[styles.historyPartsText, { color: activeColors.text }]}>{item.parts}</Text>

                  <View style={styles.historyFooter}>
                    <Text style={[styles.historyCost, { color: activeColors.subtext }]}>Hóa đơn: <Text style={{fontWeight: 'bold', color: '#10B981'}}>{item.cost}</Text></Text>
                    <Text style={[styles.historyWarranty, { color: activeColors.subtext }]}>BH phụ tùng: {item.warranty}</Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          </View>
        ) : logic.activeTab === 'loyalty' ? (
          <View>
            {/* Block 1: Loyalty Member Card */}
            <Animated.View entering={FadeInDown.duration(500)} style={styles.loyaltyMemberCard}>
              <View style={styles.loyaltyMemberHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Gift color="#A855F7" size={18} style={{ marginRight: 6 }} />
                  <Text style={styles.loyaltyMemberTitle}>Hạng Thành Viên Đặc Quyền</Text>
                </View>
                <View style={styles.goldBadge}>
                  <Text style={styles.goldBadgeText}>GOLD MEMBER</Text>
                </View>
              </View>

              <View style={styles.memberCardContainer}>
                {/* Virtual Metal Membership Card */}
                <GlassCard style={styles.virtualMemberCard} intensity={25}>
                  <View style={styles.virtualCardHeader}>
                    <Text style={styles.virtualCardBrand}>AnhEmMotor 🏍️</Text>
                    <Text style={styles.virtualCardTier}>GOLD</Text>
                  </View>
                  <Text style={styles.virtualCardName}>NGUYỄN VĂN KHÔI</Text>
                  <View style={styles.virtualCardFooter}>
                    <Text style={styles.virtualCardNumber}>ID: AEM-88992</Text>
                    <Text style={styles.virtualCardPoints}>3,500 Pts</Text>
                  </View>
                </GlassCard>
              </View>

              <Text style={styles.loyaltyMemberDesc}>
                Chúc mừng Anh Khôi đã chính thức thăng hạng lên <Text style={{fontWeight: 'bold', color: '#A855F7'}}>GOLD MEMBER</Text> sau kỳ bảo dưỡng vừa qua. Khám phá ngay các đặc quyền mới dành riêng cho bạn!
              </Text>

              <TouchableOpacity 
                style={styles.loyaltyCtaButton}
                onPress={() => logic.handleAction(logic.notifications.find(n => n.id === 'l1'))}
              >
                <Text style={styles.loyaltyCtaText}>Xem đặc quyền Gold 👑</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Block 2: Active Voucher Card */}
            <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.loyaltyVoucherCard}>
              <View style={styles.loyaltyVoucherHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Gift color={Theme.colors.primary} size={18} style={{ marginRight: 6 }} />
                  <Text style={styles.loyaltyVoucherTitle}>Voucher Đang Kích Hoạt</Text>
                </View>
                <View style={styles.voucherUrgentBadge}>
                  <Text style={styles.voucherUrgentBadgeText}>SẮP HẾT HẠN (3 ngày)</Text>
                </View>
              </View>

              <View style={[styles.dashedVoucherBody, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)', borderColor: activeColors.border }]}>
                <View style={[styles.dashedVoucherLeft, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)', borderRightColor: activeColors.border }]}>
                  <Text style={styles.voucherValBig}>2M</Text>
                  <Text style={styles.voucherValLabel}>ĐỒNG</Text>
                </View>
                <View style={styles.dashedVoucherRight}>
                  <Text style={[styles.voucherNameTitle, { color: activeColors.text }]}>Voucher đổi xe SH</Text>
                  <Text style={styles.voucherCodeLabel}>MÃ: SH-GOLD-2M</Text>
                </View>
              </View>

              <Text style={styles.loyaltyVoucherDesc}>
                Voucher [Ưu đãi đặc quyền đổi xe SH - Giảm 2 Triệu] của bạn sẽ hết hạn trong 3 ngày nữa. Đừng bỏ lỡ!
              </Text>

              <TouchableOpacity 
                style={[styles.loyaltyCtaButton, { backgroundColor: Theme.colors.primary }]}
                onPress={() => logic.handleAction(logic.notifications.find(n => n.id === 'l2'))}
              >
                <Text style={styles.loyaltyCtaText}>Sử dụng ngay 🎟️</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Block 3: Birthday Gift Card */}
            <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.loyaltyBirthdayCard}>
              <View style={styles.loyaltyBirthdayHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Gift color="#EC4899" size={18} style={{ marginRight: 6 }} />
                  <Text style={styles.loyaltyBirthdayTitle}>Quà Tặng Sinh Nhật</Text>
                </View>
                <View style={styles.birthdayBadge}>
                  <Text style={styles.birthdayBadgeText}>HAPPY BDAY 🎉</Text>
                </View>
              </View>

              <View style={[styles.birthdayGiftBox, { backgroundColor: isDark ? 'rgba(236, 72, 153, 0.08)' : 'rgba(236, 72, 153, 0.04)', borderColor: isDark ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.2)' }]}>
                <Text style={[styles.birthdayGiftTitle, { color: activeColors.text }]}>Miễn phí thay nhớt máy tháng sinh nhật 🎂</Text>
                <Text style={styles.birthdayGiftSub}>Dành riêng cho chủ xe SH 160i</Text>
              </View>

              <Text style={styles.loyaltyBirthdayDesc}>
                AnhEmMotor gửi tặng bạn Voucher thay nhớt hoàn toàn miễn phí trong tháng này.
              </Text>

              <TouchableOpacity 
                style={[styles.loyaltyCtaButton, { backgroundColor: '#EC4899' }]}
                onPress={() => logic.handleAction(logic.notifications.find(n => n.id === 'l4'))}
              >
                <Text style={styles.loyaltyCtaText}>Nhận quà sinh nhật 🎁</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Block 4: Referral Card */}
            <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.loyaltyReferralCard}>
              <View style={styles.loyaltyReferralHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Gift color="#3B82F6" size={18} style={{ marginRight: 6 }} />
                  <Text style={styles.loyaltyReferralTitle}>Đồng Hành Giới Thiệu Xe</Text>
                </View>
                <View style={styles.referralActiveBadge}>
                  <Text style={styles.referralActiveBadgeText}>MÃ CỦA BẠN</Text>
                </View>
              </View>

              <View style={[styles.referralCodeDashCard, { backgroundColor: isDark ? '#1E1B4B' : '#F5F3FF', borderColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#C7D2FE' }]}>
                <Text style={[styles.referralCodeTextVal, { color: isDark ? '#fff' : '#4338CA' }]}>AEM-KHOI-GOLD</Text>
                <Text style={[styles.referralCodeSubText, { color: activeColors.subtext }]}>Nhận 500.000đ dịch vụ khi bạn bè mua xe thành công</Text>
              </View>

              <Text style={styles.loyaltyReferralDesc}>
                Gửi mã giới thiệu của bạn cho bạn bè mua xe tại AnhEmMotor để cả hai cùng nhận Voucher 500.000đ dịch vụ.
              </Text>

              <TouchableOpacity 
                style={[styles.loyaltyCtaButton, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 1, borderColor: '#3B82F6' }]}
                onPress={() => logic.handleAction(logic.notifications.find(n => n.id === 'l3'))}
              >
                <Text style={[styles.loyaltyCtaText, { color: '#3B82F6' }]}>Chia sẻ mã ngay 🎁</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        ) : logic.activeTab === 'system' ? (
          <View>
            {/* Block 1: Recall safety */}
            <Animated.View entering={FadeInDown.duration(500)} style={styles.systemRecallCard}>
              <View style={styles.systemRecallHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AlertTriangle color={Theme.colors.error} size={18} style={{ marginRight: 6 }} />
                  <Text style={styles.systemRecallTitle}>Thông báo Triệu hồi Kỹ thuật</Text>
                </View>
                <View style={styles.recallUrgentBadge}>
                  <Text style={styles.recallUrgentBadgeText}>KHẨN CẤP ⚠️</Text>
                </View>
              </View>

              <Text style={styles.systemRecallDesc}>
                Thông báo từ <Text style={{fontWeight: 'bold', color: activeColors.text}}>Honda Việt Nam</Text>: Triệu hồi và cập nhật miễn phí cụm khóa Smartkey cho các dòng xe SH sản xuất trong giai đoạn đầu năm 2025 để nâng cấp bảo mật. Hãy đặt lịch hẹn sớm nhất tại đại lý gần nhất.
              </Text>

              <TouchableOpacity 
                style={styles.systemCtaButton}
                onPress={() => logic.handleAction(logic.notifications.find(n => n.id === 'sys1'))}
              >
                <Text style={styles.systemCtaText}>Đặt lịch kiểm tra ngay 🛠️</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Block 2: Insurance expired */}
            <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.systemInsuranceCard}>
              <View style={styles.systemInsuranceHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ShieldCheck color={Theme.colors.warning} size={18} style={{ marginRight: 6 }} />
                  <Text style={styles.systemInsuranceTitle}>Hạn Bảo Hiểm Dân Sự Xe</Text>
                </View>
                <View style={styles.insuranceWarningBadge}>
                  <Text style={styles.insuranceWarningBadgeText}>SẮP HẾT HẠN</Text>
                </View>
              </View>

              <Text style={styles.systemInsuranceDesc}>
                Bảo hiểm dân sự bắt buộc của xe <Text style={{fontWeight: 'bold', color: activeColors.text}}>60-A1 555.55</Text> sẽ hết hạn vào ngày <Text style={{fontWeight: 'bold', color: Theme.colors.warning}}>20/05/2026</Text>. Hãy gia hạn trực tuyến để tránh bị phạt khi lưu thông trên đường.
              </Text>

              <TouchableOpacity 
                style={[styles.systemCtaButton, { backgroundColor: Theme.colors.warning }]}
                onPress={() => logic.handleAction(logic.notifications.find(n => n.id === 'sys2'))}
              >
                <Text style={styles.systemCtaText}>Gia hạn bảo hiểm trực tuyến 🛡️</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Block 3: e-Invoice */}
            <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.systemInvoiceCard}>
              <View style={styles.systemInvoiceHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FileText color="#10B981" size={18} style={{ marginRight: 6 }} />
                  <Text style={styles.systemInvoiceTitle}>Hóa đơn e-Invoice sẵn sàng</Text>
                </View>
                <View style={styles.invoiceGreenBadge}>
                  <Text style={styles.invoiceGreenBadgeText}>ĐÃ XUẤT 🧾</Text>
                </View>
              </View>

              <View style={[styles.invoiceSummaryBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderColor: activeColors.border }]}>
                <View style={styles.invoiceSummaryRow}>
                  <Text style={styles.invoiceSummaryLabel}>Mã hóa đơn:</Text>
                  <Text style={[styles.invoiceSummaryVal, { color: activeColors.text }]}>#AEM-9982</Text>
                </View>
                <View style={styles.invoiceSummaryRow}>
                  <Text style={styles.invoiceSummaryLabel}>Tổng thanh toán:</Text>
                  <Text style={[styles.invoiceSummaryVal, { color: '#10B981' }]}>105.000.000đ</Text>
                </View>
              </View>

              <Text style={styles.systemInvoiceDesc}>
                Giao dịch thành công! Hóa đơn điện tử (e-Invoice) cho đơn hàng mua xe Honda SH của bạn đã được xuất thành công trên hệ thống của Tổng cục Thuế.
              </Text>

              <TouchableOpacity 
                style={[styles.systemCtaButton, { backgroundColor: '#10B981' }]}
                onPress={() => logic.handleAction(logic.notifications.find(n => n.id === 'sys3'))}
              >
                <Text style={styles.systemCtaText}>Xem và Tải hóa đơn (PDF) 🧾</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Block 5: Security login */}
            <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.systemSecurityCard}>
              <View style={styles.systemSecurityHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Lock color={Theme.colors.error} size={18} style={{ marginRight: 6 }} />
                  <Text style={styles.systemSecurityTitle}>Cảnh báo Đăng nhập lạ</Text>
                </View>
                <View style={styles.securityAlertBadge}>
                  <Text style={styles.securityAlertBadgeText}>NGUY HIỂM 🔒</Text>
                </View>
              </View>

              <Text style={styles.systemSecurityDesc}>
                Phát hiện thiết bị lạ đăng nhập tài khoản của bạn tại <Text style={{fontWeight: 'bold', color: Theme.colors.error}}>Biên Hòa lúc 08:30</Text>. Nếu không phải hành động của bạn, hãy khẩn cấp đổi mật khẩu để bảo vệ tài khoản.
              </Text>

              <TouchableOpacity 
                style={[styles.systemCtaButton, { backgroundColor: '#E11D48' }]}
                onPress={() => logic.handleAction(logic.notifications.find(n => n.id === 'sys5'))}
              >
                <Text style={styles.systemCtaText}>Đổi mật khẩu ngay 🔒</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        ) : (
          <View>
            {/* Block 1: Feedback resolved */}
            <Animated.View entering={FadeInDown.duration(500)} style={styles.systemFeedbackCard}>
              <View style={styles.systemFeedbackHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MessageSquare color="#3B82F6" size={18} style={{ marginRight: 6 }} />
                  <Text style={styles.systemFeedbackTitle}>Phản hồi Ý kiến Đóng góp</Text>
                </View>
                <View style={styles.feedbackBlueBadge}>
                  <Text style={styles.feedbackBlueBadgeText}>ĐÃ GIẢI QUYẾT</Text>
                </View>
              </View>

              <View style={[styles.feedbackParchmentPaper, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderColor: activeColors.border }]}>
                <Text style={[styles.feedbackParchmentBody, { color: activeColors.text, opacity: 0.8 }]}>
                  "Ban showroom AnhEmMotor Biên Hòa xin gửi lời cảm ơn và tiếp thu ý kiến đóng góp chân thành của bạn. Chúng tôi đã xử lý nghiêm khắc sự cố..."
                </Text>
              </View>

              <Text style={styles.systemFeedbackDesc}>
                Ban quản lý showroom đã chính thức phản hồi về góp ý của bạn ngày 15/05. Nhấn nút để xem toàn bộ nội dung cam kết chất lượng.
              </Text>

              <TouchableOpacity 
                style={[styles.systemCtaButton, { backgroundColor: '#3B82F6' }]}
                onPress={() => logic.handleAction(logic.notifications.find(n => n.id === 'sys4'))}
              >
                <Text style={styles.systemCtaText}>Xem nội dung giải quyết 💬</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Block 2: Feedback clean car delay resolved */}
            <Animated.View entering={FadeInDown.duration(500).delay(100)} style={[styles.systemFeedbackCard, { borderColor: 'rgba(16, 185, 129, 0.15)', backgroundColor: 'rgba(16, 185, 129, 0.03)' }]}>
              <View style={styles.systemFeedbackHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MessageSquare color="#10B981" size={18} style={{ marginRight: 6 }} />
                  <Text style={[styles.systemFeedbackTitle, { color: '#10B981' }]}>Góp ý về khu vực rửa xe</Text>
                </View>
                <View style={[styles.feedbackBlueBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Text style={[styles.feedbackBlueBadgeText, { color: '#10B981' }]}>TẶNG VOUCHER 🧼</Text>
                </View>
              </View>

              <View style={[styles.feedbackParchmentPaper, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.02)' : 'rgba(16, 185, 129, 0.06)', borderColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.3)' }]}>
                <Text style={[styles.feedbackParchmentBody, { color: activeColors.text, opacity: 0.8, fontStyle: 'italic' }]}>
                  "Chào Anh Khôi, Ban showroom đã nhận được phản hồi của anh về việc thời gian chờ đợi tại khu vực rửa xe còn hơi lâu vào ngày cuối tuần..."
                </Text>
              </View>

              <Text style={styles.systemFeedbackDesc}>
                Cảm ơn bạn đã đóng góp ý kiến về dịch vụ rửa xe sạch tại chi nhánh Biên Hòa. Đại lý đã ghi nhận và gửi tặng anh mã voucher rửa xe hoàn toàn miễn phí.
              </Text>

              <TouchableOpacity 
                style={[styles.systemCtaButton, { backgroundColor: '#10B981' }]}
                onPress={() => logic.handleAction(logic.notifications.find(n => n.id === 'fb2'))}
              >
                <Text style={styles.systemCtaText}>Xem phản hồi & Tặng quà 🧼</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </ScrollView>

      {/* INTERACTIVE MODAL DETAIL SHEET */}
      <Modal 
        visible={logic.activeModal !== null} 
        transparent 
        animationType="slide"
        onRequestClose={() => logic.setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => logic.setActiveModal(null)} />
          <Animated.View entering={FadeInDown.duration(400)} style={[styles.modalSheet, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }]} />
            
            <View style={styles.modalTitleRow}>
              <Text style={[styles.modalTitle, { color: activeColors.text }]}>
                {logic.selectedNotif?.type === 'delivery' ? 'Bản đồ trung chuyển 🚚' :
                 logic.selectedNotif?.type === 'workshop' ? 'Live Workshop ⚙️' :
                 logic.selectedNotif?.type === 'referral' ? 'Giới thiệu bạn bè 🎁' :
                 logic.selectedNotif?.type === 'voucher_expiry' || logic.selectedNotif?.type === 'birthday' ? 'Ví Voucher 🎟️' :
                 logic.selectedNotif?.type === 'invoice' ? 'Hóa đơn e-Invoice 🧾' :
                 logic.selectedNotif?.type === 'feedback' ? 'Ý kiến đóng góp 💬' : 'Chi tiết thông báo'}
              </Text>
              
              <TouchableOpacity style={styles.closeBtn} onPress={() => logic.setActiveModal(null)}>
                <Text style={{ color: activeColors.subtext, fontSize: 13, fontWeight: 'bold' }}>Đóng</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalSub, { color: activeColors.subtext }]}>{logic.selectedNotif?.time} • Khách hàng Khôi</Text>

            {renderActiveModalContent()}

            <TouchableOpacity style={styles.modalActionBtn} onPress={() => logic.setActiveModal(null)}>
              <Text style={styles.modalActionText}>Xác nhận & Đóng</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* CUSTOM BOOKING MODAL */}
      <Modal
        visible={logic.bookingModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => logic.setBookingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => logic.setBookingModalVisible(false)} />
          <Animated.View entering={FadeInDown.duration(400)} style={[styles.modalSheet, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }]} />
            
            <View style={styles.modalTitleRow}>
              <Text style={[styles.modalTitle, { color: activeColors.text }]}>Đặt lịch bảo dưỡng 📅</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => logic.setBookingModalVisible(false)}>
                <Text style={{ color: activeColors.subtext, fontSize: 13, fontWeight: 'bold' }}>Đóng</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalSub, { color: activeColors.subtext }]}>Honda SH 160i (60-A1 555.55) • Showroom Biên Hòa</Text>

            {/* Date selection list */}
            <Text style={[styles.bookingSectionTitle, { color: activeColors.text }]}>1. Chọn ngày đến xưởng:</Text>
            <View style={styles.bookingDateRow}>
              {[
                { date: '18/05/2026', label: 'T2', day: '18', desc: 'Mai' },
                { date: '19/05/2026', label: 'T3', day: '19', desc: 'Kia' },
                { date: '20/05/2026', label: 'T4', day: '20', desc: '20/05' },
                { date: '21/05/2026', label: 'T5', day: '21', desc: '21/05' },
              ].map(item => (
                <TouchableOpacity 
                  key={item.date}
                  style={[
                    styles.bookingDateCard,
                    { 
                      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', 
                      borderColor: activeColors.border 
                    },
                    logic.selectedDate === item.date && styles.bookingDateCardActive
                  ]}
                  onPress={() => logic.setSelectedDate(item.date)}
                >
                  <Text style={[styles.bookingDateDayLabel, { color: logic.selectedDate === item.date ? '#fff' : activeColors.subtext }]}>{item.label}</Text>
                  <Text style={[styles.bookingDateDayNumber, { color: logic.selectedDate === item.date ? '#fff' : activeColors.text }]}>{item.day}</Text>
                  <Text style={[styles.bookingDateDayDesc, { color: logic.selectedDate === item.date ? '#fff' : activeColors.subtext }]}>{item.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Time selection list */}
            <Text style={[styles.bookingSectionTitle, { color: activeColors.text }]}>2. Chọn khung giờ:</Text>
            <View style={styles.bookingTimeGrid}>
              {['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'].map(time => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.bookingTimeCard,
                    { 
                      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', 
                      borderColor: activeColors.border 
                    },
                    logic.selectedTime === time && styles.bookingTimeCardActive
                  ]}
                  onPress={() => logic.setSelectedTime(time)}
                >
                  <Clock size={12} color={logic.selectedTime === time ? '#fff' : activeColors.subtext} style={{ marginRight: 6 }} />
                  <Text style={[styles.bookingTimeText, { color: logic.selectedTime === time ? '#fff' : activeColors.subtext }]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.modalActionBtn, { marginTop: 25 }]}
              onPress={() => {
                logic.setBookingModalVisible(false);
                Alert.alert(
                  'Đặt lịch thành công!',
                  `Lịch hẹn của bạn đã được xác nhận vào lúc ${logic.selectedTime} ngày ${logic.selectedDate} tại Showroom Biên Hòa. KTV trưởng sẽ sẵn sàng tiếp đón xe của bạn!`
                );
              }}
            >
              <CalendarClock color="#fff" size={20} />
              <Text style={styles.modalActionText}>Xác nhận & Đặt chỗ</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
