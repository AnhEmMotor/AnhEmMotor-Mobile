import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { Theme, useActiveColors } from '../../../theme/Theme';
import {
  ChevronLeft,
  Wrench,
  ShieldCheck,
  Cpu,
  Smartphone,
  Gauge,
  Calendar,
  AlertCircle,
  FileText,
  ChevronRight,
  BookOpen,
  Edit2,
  CheckCircle2,
  FileDown,
  Info
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import GlassCard from '../../../components/GlassCard';
import ScalePress from '../../../components/ScalePress';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import Toast from '../../../components/Toast';

const { width: screenWidth } = Dimensions.get('window');

/**
 * @file MyVehicleDetailScreen.js
 * @framework React Native (Clean Architecture - Presentation Layer)
 * @description Beautiful personal vehicle details page fulfilling Feedback.md.
 */
export default function MyVehicleDetailScreen({ navigation, route }) {
  const activeColors = useActiveColors();
  const toastRef = useRef(null);

  // Vehicle data passed from navigation or default mock
  const { bike } = route.params || {};
  const activeBike = bike || {
    id: '1',
    name: 'Honda SH 125i',
    plate: '60-A1 555.55',
    vin: 'SH125-2024-VNBK888',
    engine: 'ESP-PLUS-9999',
    color: 'Xám Xi Măng',
    type: 'Xe ga',
    version: 'Cao cấp (ABS)',
    capacity: '124.8 cc',
    regDate: '15/05/2024',
    status: 'Hoạt động tốt',
    odo: '5.200 km',
  };

  // State handles
  const [nickname, setNickname] = useState('Chiến mã của Khôi 🏍️');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState(nickname);
  const [manualVisible, setManualVisible] = useState(false);
  const [invoiceVisible, setInvoiceVisible] = useState(false);

  const saveNickname = () => {
    if (tempNickname.trim()) {
      setNickname(tempNickname);
      toastRef.current?.show('Đã cập nhật biệt danh mới!');
    }
    setIsEditingNickname(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <StatusBar barStyle={activeColors.isDark ? 'light-content' : 'dark-content'} />

      {/* FIXED HEADER */}
      <View style={[styles.header, { borderBottomColor: activeColors.border }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backBtn, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
        >
          <ChevronLeft color={activeColors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Chi tiết xe của tôi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TẦNG 1: ĐỊNH DANH TÀI SẢN (Vehicle Identity) */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1620939511593-299312d1666c?q=80&w=1070' }} 
            style={styles.vehicleImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', activeColors.background]}
            style={styles.gradientOverlay}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.sectionContainer}>
          {/* Brand & Name */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.brandText, { color: activeColors.primary }]}>HONDA MOTORCYCLE</Text>
              <Text style={[styles.nameText, { color: activeColors.text }]}>{activeBike.name}</Text>
              
              {/* Custom Nickname Input/Display */}
              {isEditingNickname ? (
                <View style={styles.nicknameEditContainer}>
                  <TextInput 
                    style={[styles.nicknameInput, { color: activeColors.text, borderColor: activeColors.primary }]}
                    value={tempNickname}
                    onChangeText={setTempNickname}
                    autoFocus
                    maxLength={30}
                  />
                  <TouchableOpacity style={styles.saveBtn} onPress={saveNickname}>
                    <Text style={styles.saveBtnText}>Lưu</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.nicknameDisplayRow} 
                  onPress={() => {
                    setTempNickname(nickname);
                    setIsEditingNickname(true);
                  }}
                >
                  <Text style={[styles.nicknameText, { color: activeColors.subtext }]}>"{nickname}"</Text>
                  <Edit2 color={activeColors.subtext} size={14} style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              )}
            </View>

            {/* Simulated License Plate Component */}
            <View style={styles.plateContainer}>
              <View style={styles.plateContent}>
                <Text style={styles.plateHeader}>60-A1</Text>
                <Text style={styles.plateBody}>555.55</Text>
              </View>
            </View>
          </View>

          {/* Legal Vehicle IDs (Số khung / Số máy) */}
          <GlassCard 
            style={[styles.idCard, { borderColor: activeColors.glassBorder, backgroundColor: activeColors.glassBg }]}
            tint={activeColors.isDark ? 'dark' : 'light'}
          >
            <View style={styles.idRow}>
              <View style={styles.idCol}>
                <Text style={[styles.idLabel, { color: activeColors.subtext }]}>Số khung</Text>
                <Text style={[styles.idValue, { color: activeColors.text }]}>{activeBike.vin}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.idCol}>
                <Text style={[styles.idLabel, { color: activeColors.subtext }]}>Số máy</Text>
                <Text style={[styles.idValue, { color: activeColors.text }]}>{activeBike.engine}</Text>
              </View>
            </View>
            <View style={[styles.idRow, { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' }]}>
              <View style={styles.idCol}>
                <Text style={[styles.idLabel, { color: activeColors.subtext }]}>Phiên bản</Text>
                <Text style={[styles.idValue, { color: activeColors.text }]}>{activeBike.version}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.idCol}>
                <Text style={[styles.idLabel, { color: activeColors.subtext }]}>Màu sắc</Text>
                <Text style={[styles.idValue, { color: activeColors.text }]}>{activeBike.color}</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* TẦNG 2: TRẠNG THÁI VẬN HÀNH & BẢO HÀNH (Live Status) */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>⏳ Trạng thái Vận hành & Bảo hành</Text>
          
          <View style={styles.liveGrid}>
            {/* ODO Estimator */}
            <View style={[styles.liveCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
              <Gauge color={activeColors.primary} size={22} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.liveLabel, { color: activeColors.subtext }]}>ODO Dự kiến</Text>
                <Text style={[styles.liveValue, { color: activeColors.text }]}>{activeBike.odo}</Text>
                <Text style={[styles.liveHint, { color: activeColors.subtext }]}>Hệ thống CRM ước tính</Text>
              </View>
            </View>

            {/* Warranty Status */}
            <View style={[styles.liveCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
              <Calendar color="#10B981" size={22} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.liveLabel, { color: activeColors.subtext }]}>Bảo hành gốc</Text>
                <Text style={[styles.liveValue, { color: '#10B981' }]}>Còn 14 tháng</Text>
                <Text style={[styles.liveHint, { color: activeColors.subtext }]}>Tương đương 425 ngày</Text>
              </View>
            </View>
          </View>

          {/* Warranty Progress Bar */}
          <View style={[styles.progressWrapper, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: activeColors.border }]}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressLabel, { color: activeColors.subtext }]}>Tiến trình hạn bảo hành</Text>
              <Text style={[styles.progressPercent, { color: activeColors.text }]}>65%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { backgroundColor: '#10B981', width: '65%' }]} />
            </View>
            <Text style={[styles.warrantyDetailsText, { color: activeColors.subtext }]}>
              Hạn dùng đến: <Text style={{ color: activeColors.text, fontWeight: 'bold' }}>15/05/2027</Text> · Bảo hành chính hãng 5 sao tại AnhEmMotor
            </Text>
          </View>
        </Animated.View>

        {/* TẦNG 3: SỨC KHỎE & NHẬT KÝ HAO MÒN (Health Monitor) */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>🩺 Sức khỏe phụ tùng & Hao mòn</Text>
          
          <View style={[styles.healthCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            
            {/* Part 1: Nhớt máy (Warning) */}
            <View style={styles.partItem}>
              <View style={styles.partHeaderRow}>
                <Text style={[styles.partName, { color: activeColors.text }]}>Nhớt động cơ máy</Text>
                <Text style={[styles.partStatus, { color: '#EF4444' }]}>⚠️ Cần thay ngay</Text>
              </View>
              <View style={styles.partBarBg}>
                <View style={[styles.partBarFill, { backgroundColor: '#EF4444', width: '12%' }]} />
              </View>
              <Text style={[styles.partDetail, { color: activeColors.subtext }]}>Còn khoảng <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>300 km</Text> lăn bánh. Lần thay nhớt cuối tại ODO 4.000 km.</Text>
            </View>

            {/* Part 2: Má phanh (Tốt) */}
            <View style={[styles.partItem, { marginTop: 18 }]}>
              <View style={styles.partHeaderRow}>
                <Text style={[styles.partName, { color: activeColors.text }]}>Má phanh an toàn (Trước/Sau)</Text>
                <Text style={[styles.partStatus, { color: '#10B981' }]}>✓ Đang tốt</Text>
              </View>
              <View style={styles.partBarBg}>
                <View style={[styles.partBarFill, { backgroundColor: '#10B981', width: '85%' }]} />
              </View>
              <Text style={[styles.partDetail, { color: activeColors.subtext }]}>Độ dày má phanh an toàn. Dự báo sử dụng thêm <Text style={{ color: activeColors.text, fontWeight: 'bold' }}>8.000 km</Text>.</Text>
            </View>

            {/* Part 3: Lọc gió (Sắp đến hạn) */}
            <View style={[styles.partItem, { marginTop: 18 }]}>
              <View style={styles.partHeaderRow}>
                <Text style={[styles.partName, { color: activeColors.text }]}>Lọc gió động cơ</Text>
                <Text style={[styles.partStatus, { color: '#F59E0B' }]}>⚠️ Cần kiểm tra</Text>
              </View>
              <View style={styles.partBarBg}>
                <View style={[styles.partBarFill, { backgroundColor: '#F59E0B', width: '42%' }]} />
              </View>
              <Text style={[styles.partDetail, { color: activeColors.subtext }]}>Đã tích tụ bụi ODO 5.200 km. Khuyến nghị vệ sinh tại xưởng Biên Hòa.</Text>
            </View>
          </View>

          {/* Lối tắt xem Bệnh Án */}
          <TouchableOpacity 
            style={[styles.historyShortcut, { backgroundColor: activeColors.isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)', borderColor: activeColors.isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)' }]}
            onPress={() => navigation.navigate('ServiceHistory')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Wrench color={activeColors.primary} size={20} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.shortcutTitle, { color: activeColors.text }]}>Lối tắt xem "Bệnh án" lịch sử xe</Text>
                <Text style={[styles.shortcutSubtitle, { color: activeColors.subtext }]}>Xem hóa đơn dịch vụ, linh kiện đã chi tại AnhEmMotor</Text>
              </View>
            </View>
            <ChevronRight color={activeColors.primary} size={18} />
          </TouchableOpacity>
        </Animated.View>

        {/* TẦNG 4: HỒ SƠ PHÁP LÝ & HÀNH CHÍNH (Legal Documents) */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>📄 Giấy tờ & Hồ sơ pháp lý xe</Text>
          
          <GlassCard 
            style={[styles.docsCard, { borderColor: activeColors.glassBorder, backgroundColor: activeColors.glassBg }]}
            tint={activeColors.isDark ? 'dark' : 'light'}
          >
            {/* Bảo hiểm dân sự */}
            <View style={styles.docItem}>
              <View style={styles.docLeft}>
                <View style={[styles.docIconBg, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
                  <AlertCircle color="#EF4444" size={20} />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={[styles.docName, { color: activeColors.text }]}>Bảo hiểm dân sự bắt buộc</Text>
                  <Text style={[styles.docStatus, { color: '#EF4444' }]}>Hết hạn: 20/05/2026 (Còn 3 ngày)</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.renewBtn} 
                onPress={() => toastRef.current?.show('Chuyển hướng mua bảo hiểm xe trực tuyến!')}
              >
                <Text style={styles.renewBtnText}>Gia hạn</Text>
              </TouchableOpacity>
            </View>

            {/* Hóa đơn điện tử PDF */}
            <TouchableOpacity 
              style={[styles.docItem, { marginTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 15 }]}
              onPress={() => setInvoiceVisible(true)}
            >
              <View style={styles.docLeft}>
                <View style={[styles.docIconBg, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                  <FileText color={activeColors.primary} size={20} />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.docName, { color: activeColors.text }]}>Hóa đơn mua xe điện tử (e-Invoice)</Text>
                  <Text style={[styles.docStatus, { color: activeColors.subtext }]}>Mã số: HD-SH125-99882 · File gốc PDF</Text>
                </View>
              </View>
              <ChevronRight color={activeColors.subtext} size={18} />
            </TouchableOpacity>

            {/* Trạng thái duyệt hồ sơ */}
            <View style={[styles.docItem, { marginTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 15 }]}>
              <View style={styles.docLeft}>
                <View style={[styles.docIconBg, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                  <CheckCircle2 color="#10B981" size={20} />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.docName, { color: activeColors.text }]}>Hồ sơ đăng ký chính chủ & biển số</Text>
                  <Text style={[styles.docStatus, { color: '#10B981' }]}>Đã hoàn tất cấp biển số 100%</Text>
                </View>
              </View>
              <View style={styles.statusCompletedBadge}>
                <Text style={styles.completedText}>Xong</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <View style={{ height: 10 }} />
      </ScrollView>

      {/* TẦNG 5: CỤM HÀNH ĐỘNG NHANH CỐ ĐỊNH Ở ĐÁY (Sticky Bottom Actions) */}
      <BlurView intensity={35} tint={activeColors.isDark ? 'dark' : 'light'} style={styles.stickyFooter}>
        <View style={styles.footerRow}>
          {/* Nút Phụ: Sách HDSD */}
          <TouchableOpacity 
            style={[styles.manualBtn, { borderColor: activeColors.border, backgroundColor: activeColors.card }]}
            onPress={() => setManualVisible(true)}
          >
            <BookOpen color={activeColors.text} size={20} />
            <Text style={[styles.manualBtnText, { color: activeColors.text }]}>SÁCH HDSD</Text>
          </TouchableOpacity>

          {/* Nút Chính: Đặt lịch sửa chữa */}
          <TouchableOpacity 
            style={styles.bookingBtn}
            onPress={() => navigation.navigate('Booking', { prefillVehicle: activeBike })}
          >
            <LinearGradient
              colors={[activeColors.primary, '#1E3A8A']}
              style={styles.gradientBtn}
            >
              <Wrench color="#FFF" size={20} />
              <Text style={styles.bookingBtnText}>ĐẶT LỊCH SỬA CHỮA</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* MODAL 1: SÁCH HƯỚNG DẪN SỬ DỤNG (User Manual) */}
      <Modal
        visible={manualVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setManualVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[styles.modalContent, { backgroundColor: activeColors.card }]}>
            <View style={styles.modalHeader}>
              <BookOpen color={activeColors.primary} size={24} />
              <Text style={[styles.modalTitle, { color: activeColors.text }]}>Hướng dẫn sử dụng Honda SH</Text>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
              <View style={[styles.manualTipCard, { backgroundColor: activeColors.background }]}>
                <Text style={[styles.tipTitle, { color: activeColors.text }]}>🔑 1. Cách vận hành Smartkey thông minh</Text>
                <Text style={[styles.tipDesc, { color: activeColors.subtext }]}>• Bấm giữ nút biểu tượng chìa khóa 2 giây đến khi đèn chuyển từ đỏ sang xanh để mở nguồn.</Text>
                <Text style={[styles.tipDesc, { color: activeColors.subtext }]}>• Nhấn nhẹ vào núm khóa xoay trên xe, còi xe sẽ tít nhẹ báo nhận diện sóng Smartkey. Quay núm về vị trí ON để khởi động xe máy.</Text>
              </View>

              <View style={[styles.manualTipCard, { backgroundColor: activeColors.background, marginTop: 12 }]}>
                <Text style={[styles.tipTitle, { color: activeColors.text }]}>💨 2. Áp suất lốp tiêu chuẩn khi đi 1-2 người</Text>
                <Text style={[styles.tipDesc, { color: activeColors.subtext }]}>• Lốp trước: 2.0 bar (hoặc 29 psi) - Đảm bảo tay lái đánh nhẹ và linh hoạt.</Text>
                <Text style={[styles.tipDesc, { color: activeColors.subtext }]}>• Lốp sau: 2.25 bar (hoặc 33 psi) khi đi một mình. Bơm lên 2.5 bar (36 psi) khi chở thêm người hoặc đồ nặng để phanh an toàn.</Text>
              </View>

              <View style={[styles.manualTipCard, { backgroundColor: activeColors.background, marginTop: 12 }]}>
                <Text style={[styles.tipTitle, { color: activeColors.text }]}>🔋 3. Cổng sạc USB & Khóa an toàn Smart Trunk</Text>
                <Text style={[styles.tipDesc, { color: activeColors.subtext }]}>• Xe trang bị đầu sạc USB 12W trong cốp. Khuyến nghị chỉ cắm sạc khi xe đang nổ máy để tránh tiêu hao ắc quy gốc của xe.</Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setManualVisible(false)}>
              <Text style={styles.closeBtnText}>Đóng lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: HÓA ĐƠN MUA XE PDF */}
      <Modal
        visible={invoiceVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setInvoiceVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[styles.modalContent, { backgroundColor: activeColors.card, width: '90%', maxHeight: '75%' }]}>
            <View style={styles.modalHeader}>
              <FileText color={activeColors.primary} size={24} />
              <Text style={[styles.modalTitle, { color: activeColors.text }]}>Hóa đơn điện tử PDF</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={[styles.invoiceScroll, { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 15 }]}>
              <View style={{ alignItems: 'center', marginBottom: 15 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111111' }}>CÔNG TY CỔ PHẦN ANHEMMOTOR</Text>
                <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Showroom 5 Sao Biên Hòa, Đồng Nai</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#E31B23', marginTop: 8 }}>HÓA ĐƠN GIÁ TRỊ GIA TĂNG (GTGT)</Text>
                <Text style={{ fontSize: 10, color: '#64748B' }}>Mẫu số: HD-SH125-99882 · Ngày: 15/05/2024</Text>
              </View>

              <View style={styles.invoiceDivider} />

              <View style={styles.invoiceRow}>
                <Text style={styles.invLabel}>Người mua hàng:</Text>
                <Text style={styles.invVal}>Nguyễn Văn Khôi</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invLabel}>Số điện thoại:</Text>
                <Text style={styles.invVal}>0901 234 567</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invLabel}>Địa chỉ:</Text>
                <Text style={styles.invVal}>Thành phố Biên Hòa, Đồng Nai</Text>
              </View>

              <View style={styles.invoiceDivider} />

              <View style={styles.invoiceRow}>
                <Text style={styles.invLabel}>Tên xe:</Text>
                <Text style={styles.invVal}>Honda SH 125i (Phiên bản ABS)</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invLabel}>Số khung / Số máy:</Text>
                <Text style={styles.invVal}>{activeBike.vin}</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invLabel}>Màu sắc:</Text>
                <Text style={styles.invVal}>Xám Xi Măng</Text>
              </View>

              <View style={styles.invoiceDivider} />

              <View style={styles.invoiceRow}>
                <Text style={[styles.invLabel, { fontWeight: 'bold' }]}>Thành tiền (đã thuế):</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#EF4444' }}>89.500.000 đ</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invLabel}>Hình thức TT:</Text>
                <Text style={styles.invVal}>Chuyển khoản Ngân hàng</Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, padding: 10, borderWidth: 1, borderColor: '#10B981', borderStyle: 'dashed', borderRadius: 8 }}>
                <CheckCircle2 color="#10B981" size={16} />
                <Text style={{ color: '#10B981', fontSize: 11, fontWeight: 'bold', marginLeft: 6 }}>HÓA ĐƠN ĐÃ ĐƯỢC KÝ SỐ HỢP LỆ</Text>
              </View>
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
              <TouchableOpacity 
                style={[styles.invoiceActionBtn, { backgroundColor: 'rgba(59,130,246,0.1)' }]} 
                onPress={() => toastRef.current?.show('Đã tải hóa đơn xuống thư mục Downloads!')}
              >
                <FileDown color={activeColors.primary} size={18} />
                <Text style={{ color: activeColors.primary, fontWeight: 'bold', fontSize: 13, marginLeft: 6 }}>Tải PDF</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.invoiceActionBtn, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]} 
                onPress={() => setInvoiceVisible(false)}
              >
                <Text style={{ color: activeColors.text, fontWeight: 'bold', fontSize: 13 }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Toast ref={toastRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    height: 60, 
    marginTop: 40,
    borderBottomWidth: 1 
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  
  scrollContent: { paddingBottom: 80 },
  
  imageContainer: { height: 280, position: 'relative' },
  vehicleImage: { width: '100%', height: '100%' },
  gradientOverlay: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0, 
    height: 100 
  },
  
  sectionContainer: { paddingHorizontal: 20, marginTop: 15 },
  
  titleRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 15
  },
  brandText: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  nameText: { fontSize: 24, fontWeight: 'bold', marginTop: 2 },
  
  nicknameDisplayRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  nicknameText: { fontSize: 14, fontStyle: 'italic' },
  
  nicknameEditContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  nicknameInput: { 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    flex: 1, 
    fontSize: 13,
    marginRight: 8 
  },
  saveBtn: { backgroundColor: '#E31B23', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  saveBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  
  plateContainer: { 
    borderWidth: 2, 
    borderColor: '#111111', 
    backgroundColor: '#FFF', 
    borderRadius: 8, 
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  plateContent: { 
    borderWidth: 1, 
    borderColor: '#64748B', 
    borderRadius: 4, 
    paddingHorizontal: 8, 
    paddingVertical: 2,
    alignItems: 'center' 
  },
  plateHeader: { fontSize: 12, fontWeight: '900', color: '#111111' },
  plateBody: { fontSize: 16, fontWeight: '900', color: '#111111', marginTop: 1 },
  
  idCard: { padding: 15, borderRadius: 16, marginTop: 5 },
  idRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  idCol: { flex: 1 },
  idLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  idValue: { fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  divider: { width: 1, height: 25, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 12 },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  
  liveGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  liveCard: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    borderRadius: 14, 
    borderWidth: 1 
  },
  liveLabel: { fontSize: 10 },
  liveValue: { fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  liveHint: { fontSize: 9, marginTop: 1 },
  
  progressWrapper: { 
    padding: 15, 
    borderRadius: 14, 
    borderWidth: 1 
  },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12 },
  progressPercent: { fontSize: 12, fontWeight: 'bold' },
  progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  warrantyDetailsText: { fontSize: 10, marginTop: 8, fontStyle: 'italic' },
  
  healthCard: { padding: 15, borderRadius: 16, borderWidth: 1 },
  partItem: {},
  partHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  partName: { fontSize: 13, fontWeight: 'bold' },
  partStatus: { fontSize: 11, fontWeight: 'bold' },
  partBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' },
  partBarFill: { height: '100%', borderRadius: 3 },
  partDetail: { fontSize: 10, marginTop: 6 },
  
  historyShortcut: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 12, 
    borderRadius: 14, 
    borderWidth: 1, 
    marginTop: 12 
  },
  shortcutTitle: { fontSize: 13, fontWeight: 'bold' },
  shortcutSubtitle: { fontSize: 10, marginTop: 2 },
  
  docsCard: { padding: 15, borderRadius: 16 },
  docItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  docIconBg: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  docName: { fontSize: 13, fontWeight: 'bold' },
  docStatus: { fontSize: 10, marginTop: 2 },
  
  renewBtn: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  renewBtnText: { color: '#EF4444', fontSize: 11, fontWeight: 'bold' },
  
  statusCompletedBadge: { backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  completedText: { color: '#10B981', fontSize: 11, fontWeight: 'bold' },
  
  stickyFooter: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 90, 
    paddingBottom: 25, 
    paddingHorizontal: 20, 
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)'
  },
  footerRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  manualBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    height: 48, 
    borderRadius: 12, 
    borderWidth: 1,
    paddingHorizontal: 16 
  },
  manualBtnText: { fontSize: 12, fontWeight: 'bold', marginLeft: 8 },
  bookingBtn: { flex: 1, height: 48, borderRadius: 12, overflow: 'hidden' },
  gradientBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  bookingBtnText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },

  // Modal styles
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalBody: { maxHeight: 300, marginBottom: 15 },
  manualTipCard: { padding: 12, borderRadius: 12 },
  tipTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 6 },
  tipDesc: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  closeModalBtn: { backgroundColor: '#E31B23', height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { color: '#FFF', fontWeight: 'bold' },

  invoiceScroll: { maxHeight: 320, padding: 12 },
  invoiceDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12, borderStyle: 'dashed' },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  invLabel: { color: '#64748B', fontSize: 12 },
  invVal: { color: '#111111', fontSize: 12, fontWeight: 'bold', textAlign: 'right', flex: 1, marginLeft: 15 },
  invoiceActionBtn: { flex: 1, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }
});

