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
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useActiveColors } from '../../../theme/Theme';
import {
  ChevronLeft,
  Wrench,
  Gauge,
  Calendar,
  AlertCircle,
  FileText,
  ChevronRight,
  BookOpen,
  Edit2,
  CheckCircle2,
  FileDown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import GlassCard from '../../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Toast from '../../../components/Toast';
import { useMyVehicleDetail } from './hooks/useMyVehicleDetail';

const { width: _screenWidth } = Dimensions.get('window');

export default function MyVehicleDetailScreen({ navigation, route }) {
  const activeColors = useActiveColors();
  const toastRef = useRef(null);

  const { bike } = route.params || {};
  const {
    vehicle: loadedBike,
    loading,
    error,
    retry,
    saving,
    saveError,
    saveVehicle,
  } = useMyVehicleDetail(bike);

  const fallbackBike = {
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
    warrantyUntil: '15/05/2027',
    warrantyFrom: '15/05/2024',
    insuranceUntil: '20/05/2026',
    nextService: { odo: '6.500 km', date: '12/08/2026', items: ['Thay nhớt', 'Kiểm tra phanh'] },
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleDateString('vi-VN');
  };

  const activeBike = loadedBike || bike || fallbackBike;
  const plateParts = (activeBike.plate || '').split(' ');
  const plateHeader = plateParts[0] || '---';
  const plateBody = plateParts.slice(1).join(' ') || activeBike.plate || '---';
  const warrantyLabel =
    activeBike.warrantyRemainingDays != null ? `${activeBike.warrantyRemainingDays} ngày` : 'N/A';
  const warrantyUntilLabel = formatDate(activeBike.warrantyUntil);

  const [nickname, setNickname] = useState('Chiến mã của Khôi 🏍️');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState(nickname);
  const [manualVisible, setManualVisible] = useState(false);
  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [editVehicleVisible, setEditVehicleVisible] = useState(false);
  const [formData, setFormData] = useState({
    plate: activeBike?.plate || '',
    color: activeBike?.color || '',
    vin: activeBike?.vin || '',
    engine: activeBike?.engine || '',
    currentOdo: (activeBike?.currentOdo ?? activeBike?.odo?.replace(/\D/g, '')) || '',
  });

  const saveNickname = () => {
    if (tempNickname.trim()) {
      setNickname(tempNickname);
      toastRef.current?.show('Đã cập nhật biệt danh mới!');
    }
    setIsEditingNickname(false);
  };

  const openEditVehicle = () => {
    setFormData({
      plate: activeBike?.plate || '',
      color: activeBike?.color || '',
      vin: activeBike?.vin || '',
      engine: activeBike?.engine || '',
      currentOdo: (activeBike?.currentOdo ?? activeBike?.odo?.replace(/\D/g, '')) || '',
    });
    setEditVehicleVisible(true);
  };

  const handleSaveVehicle = async () => {
    try {
      const payload = {
        licensePlate: formData.plate?.trim(),
        color: formData.color?.trim(),
        vinNumber: formData.vin?.trim(),
        engineNumber: formData.engine?.trim(),
        currentOdo: formData.currentOdo === '' ? null : Number(formData.currentOdo),
      };

      await saveVehicle(activeBike.id, payload);
      toastRef.current?.show('Đã lưu thay đổi thông tin xe');
      setEditVehicleVisible(false);
    } catch (saveErr) {
      toastRef.current?.show(saveErr?.message || 'Không thể lưu thông tin xe');
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: activeColors.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <ActivityIndicator size="large" color={activeColors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <StatusBar barStyle={activeColors.isDark ? 'light-content' : 'dark-content'} />

      {}
      <View style={[styles.header, { borderBottomColor: activeColors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backBtn,
            {
              backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            },
          ]}
        >
          <ChevronLeft color={activeColors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Chi tiết xe của tôi</Text>
        <TouchableOpacity
          onPress={openEditVehicle}
          style={[
            styles.backBtn,
            {
              backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            },
          ]}
        >
          <Edit2 color={activeColors.text} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.imageContainer}>
          <Image
            source={
              activeBike.image
                ? { uri: activeBike.image }
                : {
                    uri: 'https://images.unsplash.com/photo-1620939511593-299312d1666c?q=80&w=1070',
                  }
            }
            style={styles.vehicleImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', activeColors.background]}
            style={styles.gradientOverlay}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(600).delay(100)}
          style={styles.sectionContainer}
        >
          {}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.brandText, { color: activeColors.primary }]}>
                HONDA MOTORCYCLE
              </Text>
              <Text style={[styles.nameText, { color: activeColors.text }]}>{activeBike.name}</Text>

              {}
              {isEditingNickname ? (
                <View style={styles.nicknameEditContainer}>
                  <TextInput
                    style={[
                      styles.nicknameInput,
                      { color: activeColors.text, borderColor: activeColors.primary },
                    ]}
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
                  <Text style={[styles.nicknameText, { color: activeColors.subtext }]}>
                    "{nickname}"
                  </Text>
                  <Edit2 color={activeColors.subtext} size={14} style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              )}
            </View>

            {}
            <View style={styles.plateContainer}>
              <View style={styles.plateContent}>
                <Text style={styles.plateHeader}>{plateHeader}</Text>
                <Text style={styles.plateBody}>{plateBody}</Text>
              </View>
            </View>
          </View>

          {}
          <GlassCard
            style={[
              styles.idCard,
              { borderColor: activeColors.glassBorder, backgroundColor: activeColors.glassBg },
            ]}
            tint={activeColors.isDark ? 'dark' : 'light'}
          >
            {error ? (
              <View
                style={[
                  styles.errorBanner,
                  { backgroundColor: activeColors.card, borderColor: activeColors.border },
                ]}
              >
                <Text style={[styles.errorTitle, { color: activeColors.text }]}>
                  Không tải được chi tiết xe
                </Text>
                <Text style={[styles.errorDescription, { color: activeColors.subtext }]}>
                  {error}
                </Text>
                <TouchableOpacity
                  style={[styles.retryButton, { backgroundColor: activeColors.primary }]}
                  onPress={retry}
                >
                  <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {saveError ? (
              <View style={styles.errorBanner2}>
                <Text style={styles.errorTitle2}>{saveError}</Text>
              </View>
            ) : null}
            <View style={styles.idRow}>
              <View style={styles.idCol}>
                <Text style={[styles.idLabel, { color: activeColors.subtext }]}>Số khung</Text>
                <Text style={[styles.idValue, { color: activeColors.text }]}>{activeBike.vin}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.idCol}>
                <Text style={[styles.idLabel, { color: activeColors.subtext }]}>Số máy</Text>
                <Text style={[styles.idValue, { color: activeColors.text }]}>
                  {activeBike.engine}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.idRow,
                {
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(255,255,255,0.05)',
                },
              ]}
            >
              <View style={styles.idCol}>
                <Text style={[styles.idLabel, { color: activeColors.subtext }]}>Phiên bản</Text>
                <Text style={[styles.idValue, { color: activeColors.text }]}>
                  {activeBike.version}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.idCol}>
                <Text style={[styles.idLabel, { color: activeColors.subtext }]}>Màu sắc</Text>
                <Text style={[styles.idValue, { color: activeColors.text }]}>
                  {activeBike.color}
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {}
        <Animated.View
          entering={FadeInDown.duration(600).delay(200)}
          style={styles.sectionContainer}
        >
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
            ⏳ Trạng thái Vận hành & Bảo hành
          </Text>

          <View style={styles.liveGrid}>
            {}
            <View
              style={[
                styles.liveCard,
                { backgroundColor: activeColors.card, borderColor: activeColors.border },
              ]}
            >
              <Gauge color={activeColors.primary} size={22} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.liveLabel, { color: activeColors.subtext }]}>
                  ODO hiện tại
                </Text>
                <Text style={[styles.liveValue, { color: activeColors.text }]}>
                  {activeBike.odo || 'N/A'}
                </Text>
                <Text style={[styles.liveHint, { color: activeColors.subtext }]}>
                  Dữ liệu từ hệ thống CRM
                </Text>
              </View>
            </View>

            {}
            <View
              style={[
                styles.liveCard,
                { backgroundColor: activeColors.card, borderColor: activeColors.border },
              ]}
            >
              <Calendar color="#10B981" size={22} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.liveLabel, { color: activeColors.subtext }]}>
                  Bảo hành còn lại
                </Text>
                <Text style={[styles.liveValue, { color: '#10B981' }]}>{warrantyLabel}</Text>
                <Text style={[styles.liveHint, { color: activeColors.subtext }]}>
                  {warrantyUntilLabel}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.progressWrapper,
              {
                backgroundColor: activeColors.isDark
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.02)',
                borderColor: activeColors.border,
              },
            ]}
          >
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressLabel, { color: activeColors.subtext }]}>
                Tiến trình hạn bảo hành
              </Text>
              <Text style={[styles.progressPercent, { color: activeColors.text }]}>
                {activeBike.warrantyRemainingDays != null
                  ? `${Math.min(activeBike.warrantyRemainingDays, 100)}%`
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: '#10B981',
                    width:
                      activeBike.warrantyRemainingDays != null
                        ? `${Math.min(activeBike.warrantyRemainingDays, 100)}%`
                        : '0%',
                  },
                ]}
              />
            </View>
            <Text style={[styles.warrantyDetailsText, { color: activeColors.subtext }]}>
              Hạn dùng đến:{' '}
              <Text style={{ color: activeColors.text, fontWeight: 'bold' }}>
                {warrantyUntilLabel}
              </Text>{' '}
              · Bảo hành chính hãng 5 sao tại AnhEmMotor
            </Text>
          </View>
        </Animated.View>

        {}
        <Animated.View
          entering={FadeInDown.duration(600).delay(300)}
          style={styles.sectionContainer}
        >
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
            🩺 Sức khỏe phụ tùng & Hao mòn
          </Text>

          <View
            style={[
              styles.healthCard,
              { backgroundColor: activeColors.card, borderColor: activeColors.border },
            ]}
          >
            {}
            <View style={styles.partItem}>
              <View style={styles.partHeaderRow}>
                <Text style={[styles.partName, { color: activeColors.text }]}>
                  Nhớt động cơ máy
                </Text>
                <Text style={[styles.partStatus, { color: '#EF4444' }]}>⚠️ Cần thay ngay</Text>
              </View>
              <View style={styles.partBarBg}>
                <View style={[styles.partBarFill, { backgroundColor: '#EF4444', width: '12%' }]} />
              </View>
              <Text style={[styles.partDetail, { color: activeColors.subtext }]}>
                Còn khoảng <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>300 km</Text> lăn
                bánh. Lần thay nhớt cuối tại ODO 4.000 km.
              </Text>
            </View>

            {}
            <View style={[styles.partItem, { marginTop: 18 }]}>
              <View style={styles.partHeaderRow}>
                <Text style={[styles.partName, { color: activeColors.text }]}>
                  Má phanh an toàn (Trước/Sau)
                </Text>
                <Text style={[styles.partStatus, { color: '#10B981' }]}>✓ Đang tốt</Text>
              </View>
              <View style={styles.partBarBg}>
                <View style={[styles.partBarFill, { backgroundColor: '#10B981', width: '85%' }]} />
              </View>
              <Text style={[styles.partDetail, { color: activeColors.subtext }]}>
                Độ dày má phanh an toàn. Dự báo sử dụng thêm{' '}
                <Text style={{ color: activeColors.text, fontWeight: 'bold' }}>8.000 km</Text>.
              </Text>
            </View>

            {}
            <View style={[styles.partItem, { marginTop: 18 }]}>
              <View style={styles.partHeaderRow}>
                <Text style={[styles.partName, { color: activeColors.text }]}>Lọc gió động cơ</Text>
                <Text style={[styles.partStatus, { color: '#F59E0B' }]}>⚠️ Cần kiểm tra</Text>
              </View>
              <View style={styles.partBarBg}>
                <View style={[styles.partBarFill, { backgroundColor: '#F59E0B', width: '42%' }]} />
              </View>
              <Text style={[styles.partDetail, { color: activeColors.subtext }]}>
                Đã tích tụ bụi ODO 5.200 km. Khuyến nghị vệ sinh tại xưởng Biên Hòa.
              </Text>
            </View>
          </View>

          {}
          <TouchableOpacity
            style={[
              styles.historyShortcut,
              {
                backgroundColor: activeColors.isDark
                  ? 'rgba(59,130,246,0.1)'
                  : 'rgba(59,130,246,0.05)',
                borderColor: activeColors.isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)',
              },
            ]}
            onPress={() => navigation.navigate('ServiceHistory', { vehicle: activeBike })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Wrench color={activeColors.primary} size={20} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.shortcutTitle, { color: activeColors.text }]}>
                  Lối tắt xem "Bệnh án" lịch sử xe
                </Text>
                <Text style={[styles.shortcutSubtitle, { color: activeColors.subtext }]}>
                  Xem hóa đơn dịch vụ, linh kiện đã chi tại AnhEmMotor
                </Text>
              </View>
            </View>
            <ChevronRight color={activeColors.primary} size={18} />
          </TouchableOpacity>
        </Animated.View>

        {}
        <Animated.View
          entering={FadeInDown.duration(600).delay(400)}
          style={styles.sectionContainer}
        >
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
            📄 Giấy tờ & Hồ sơ pháp lý xe
          </Text>

          <GlassCard
            style={[
              styles.docsCard,
              { borderColor: activeColors.glassBorder, backgroundColor: activeColors.glassBg },
            ]}
            tint={activeColors.isDark ? 'dark' : 'light'}
          >
            {}
            <View style={styles.docItem}>
              <View style={styles.docLeft}>
                <View style={[styles.docIconBg, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
                  <AlertCircle color="#EF4444" size={20} />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={[styles.docName, { color: activeColors.text }]}>
                    Bảo hiểm dân sự bắt buộc
                  </Text>
                  <Text style={[styles.docStatus, { color: '#EF4444' }]}>
                    Hết hạn: 20/05/2026 (Còn 3 ngày)
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.renewBtn}
                onPress={() => toastRef.current?.show('Chuyển hướng mua bảo hiểm xe trực tuyến!')}
              >
                <Text style={styles.renewBtnText}>Gia hạn</Text>
              </TouchableOpacity>
            </View>

            {}
            <TouchableOpacity
              style={[
                styles.docItem,
                {
                  marginTop: 15,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(255,255,255,0.05)',
                  paddingTop: 15,
                },
              ]}
              onPress={() => setInvoiceVisible(true)}
            >
              <View style={styles.docLeft}>
                <View style={[styles.docIconBg, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                  <FileText color={activeColors.primary} size={20} />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.docName, { color: activeColors.text }]}>
                    Hóa đơn mua xe điện tử (e-Invoice)
                  </Text>
                  <Text style={[styles.docStatus, { color: activeColors.subtext }]}>
                    Mã số: HD-SH125-99882 · File gốc PDF
                  </Text>
                </View>
              </View>
              <ChevronRight color={activeColors.subtext} size={18} />
            </TouchableOpacity>

            {}
            <View
              style={[
                styles.docItem,
                {
                  marginTop: 15,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(255,255,255,0.05)',
                  paddingTop: 15,
                },
              ]}
            >
              <View style={styles.docLeft}>
                <View style={[styles.docIconBg, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                  <CheckCircle2 color="#10B981" size={20} />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.docName, { color: activeColors.text }]}>
                    Hồ sơ đăng ký chính chủ & biển số
                  </Text>
                  <Text style={[styles.docStatus, { color: '#10B981' }]}>
                    Đã hoàn tất cấp biển số 100%
                  </Text>
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

      {}
      <BlurView
        intensity={35}
        tint={activeColors.isDark ? 'dark' : 'light'}
        style={styles.stickyFooter}
      >
        <View style={styles.footerRow}>
          {}
          <TouchableOpacity
            style={[
              styles.manualBtn,
              { borderColor: activeColors.border, backgroundColor: activeColors.card },
            ]}
            onPress={() => setManualVisible(true)}
          >
            <BookOpen color={activeColors.text} size={20} />
            <Text style={[styles.manualBtnText, { color: activeColors.text }]}>SÁCH HDSD</Text>
          </TouchableOpacity>

          {}
          <TouchableOpacity
            style={styles.bookingBtn}
            onPress={() => navigation.navigate('Booking', { prefillVehicle: activeBike })}
          >
            <LinearGradient colors={[activeColors.primary, '#1E3A8A']} style={styles.gradientBtn}>
              <Wrench color="#FFF" size={20} />
              <Text style={styles.bookingBtnText}>ĐẶT LỊCH SỬA CHỮA</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </BlurView>

      <Modal
        visible={editVehicleVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditVehicleVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: activeColors.card, borderColor: activeColors.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: activeColors.text }]}>
              Cập nhật thông tin xe
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                { color: activeColors.text, borderColor: activeColors.border },
              ]}
              value={formData.plate}
              onChangeText={(value) => setFormData((prev) => ({ ...prev, plate: value }))}
              placeholder="Biển số"
              placeholderTextColor={activeColors.subtext}
            />
            <TextInput
              style={[
                styles.modalInput,
                { color: activeColors.text, borderColor: activeColors.border },
              ]}
              value={formData.color}
              onChangeText={(value) => setFormData((prev) => ({ ...prev, color: value }))}
              placeholder="Màu sắc"
              placeholderTextColor={activeColors.subtext}
            />
            <TextInput
              style={[
                styles.modalInput,
                { color: activeColors.text, borderColor: activeColors.border },
              ]}
              value={formData.vin}
              onChangeText={(value) => setFormData((prev) => ({ ...prev, vin: value }))}
              placeholder="Số khung"
              placeholderTextColor={activeColors.subtext}
            />
            <TextInput
              style={[
                styles.modalInput,
                { color: activeColors.text, borderColor: activeColors.border },
              ]}
              value={formData.engine}
              onChangeText={(value) => setFormData((prev) => ({ ...prev, engine: value }))}
              placeholder="Số máy"
              placeholderTextColor={activeColors.subtext}
            />
            <TextInput
              style={[
                styles.modalInput,
                { color: activeColors.text, borderColor: activeColors.border },
              ]}
              value={String(formData.currentOdo)}
              onChangeText={(value) => setFormData((prev) => ({ ...prev, currentOdo: value }))}
              placeholder="ODO hiện tại"
              keyboardType="numeric"
              placeholderTextColor={activeColors.subtext}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  styles.modalCancelBtn,
                  { borderColor: activeColors.border },
                ]}
                onPress={() => setEditVehicleVisible(false)}
              >
                <Text style={[styles.modalBtnText, { color: activeColors.text }]}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  styles.modalSaveBtn,
                  { backgroundColor: activeColors.primary },
                ]}
                onPress={handleSaveVehicle}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalBtnText}>Lưu</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {}
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
              <Text style={[styles.modalTitle, { color: activeColors.text }]}>
                Hướng dẫn sử dụng Honda SH
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
              <View style={[styles.manualTipCard, { backgroundColor: activeColors.background }]}>
                <Text style={[styles.tipTitle, { color: activeColors.text }]}>
                  🔑 1. Cách vận hành Smartkey thông minh
                </Text>
                <Text style={[styles.tipDesc, { color: activeColors.subtext }]}>
                  • Bấm giữ nút biểu tượng chìa khóa 2 giây đến khi đèn chuyển từ đỏ sang xanh để mở
                  nguồn.
                </Text>
                <Text style={[styles.tipDesc, { color: activeColors.subtext }]}>
                  • Nhấn nhẹ vào núm khóa xoay trên xe, còi xe sẽ tít nhẹ báo nhận diện sóng
                  Smartkey. Quay núm về vị trí ON để khởi động xe máy.
                </Text>
              </View>

              <View
                style={[
                  styles.manualTipCard,
                  { backgroundColor: activeColors.background, marginTop: 12 },
                ]}
              >
                <Text style={[styles.tipTitle, { color: activeColors.text }]}>
                  💨 2. Áp suất lốp tiêu chuẩn khi đi 1-2 người
                </Text>
                <Text style={[styles.tipDesc, { color: activeColors.subtext }]}>
                  • Lốp trước: 2.0 bar (hoặc 29 psi) - Đảm bảo tay lái đánh nhẹ và linh hoạt.
                </Text>
                <Text style={[styles.tipDesc, { color: activeColors.subtext }]}>
                  • Lốp sau: 2.25 bar (hoặc 33 psi) khi đi một mình. Bơm lên 2.5 bar (36 psi) khi
                  chở thêm người hoặc đồ nặng để phanh an toàn.
                </Text>
              </View>

              <View
                style={[
                  styles.manualTipCard,
                  { backgroundColor: activeColors.background, marginTop: 12 },
                ]}
              >
                <Text style={[styles.tipTitle, { color: activeColors.text }]}>
                  🔋 3. Cổng sạc USB & Khóa an toàn Smart Trunk
                </Text>
                <Text style={[styles.tipDesc, { color: activeColors.subtext }]}>
                  • Xe trang bị đầu sạc USB 12W trong cốp. Khuyến nghị chỉ cắm sạc khi xe đang nổ
                  máy để tránh tiêu hao ắc quy gốc của xe.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setManualVisible(false)}>
              <Text style={styles.closeBtnText}>Đóng lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {}
      <Modal
        visible={invoiceVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setInvoiceVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} />
          <View
            style={[
              styles.modalContent,
              { backgroundColor: activeColors.card, width: '90%', maxHeight: '75%' },
            ]}
          >
            <View style={styles.modalHeader}>
              <FileText color={activeColors.primary} size={24} />
              <Text style={[styles.modalTitle, { color: activeColors.text }]}>
                Hóa đơn điện tử PDF
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[
                styles.invoiceScroll,
                { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 15 },
              ]}
            >
              <View style={{ alignItems: 'center', marginBottom: 15 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111111' }}>
                  CÔNG TY CỔ PHẦN ANHEMMOTOR
                </Text>
                <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                  Showroom 5 Sao Biên Hòa, Đồng Nai
                </Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#E31B23', marginTop: 8 }}>
                  HÓA ĐƠN GIÁ TRỊ GIA TĂNG (GTGT)
                </Text>
                <Text style={{ fontSize: 10, color: '#64748B' }}>
                  Mẫu số: HD-SH125-99882 · Ngày: 15/05/2024
                </Text>
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
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#EF4444' }}>
                  89.500.000 đ
                </Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invLabel}>Hình thức TT:</Text>
                <Text style={styles.invVal}>Chuyển khoản Ngân hàng</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: '#10B981',
                  borderStyle: 'dashed',
                  borderRadius: 8,
                }}
              >
                <CheckCircle2 color="#10B981" size={16} />
                <Text style={{ color: '#10B981', fontSize: 11, fontWeight: 'bold', marginLeft: 6 }}>
                  HÓA ĐƠN ĐÃ ĐƯỢC KÝ SỐ HỢP LỆ
                </Text>
              </View>
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
              <TouchableOpacity
                style={[styles.invoiceActionBtn, { backgroundColor: 'rgba(59,130,246,0.1)' }]}
                onPress={() => toastRef.current?.show('Đã tải hóa đơn xuống thư mục Downloads!')}
              >
                <FileDown color={activeColors.primary} size={18} />
                <Text
                  style={{
                    color: activeColors.primary,
                    fontWeight: 'bold',
                    fontSize: 13,
                    marginLeft: 6,
                  }}
                >
                  Tải PDF
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.invoiceActionBtn,
                  {
                    backgroundColor: activeColors.isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.03)',
                  },
                ]}
                onPress={() => setInvoiceVisible(false)}
              >
                <Text style={{ color: activeColors.text, fontWeight: 'bold', fontSize: 13 }}>
                  Đóng
                </Text>
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
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    height: 100,
  },

  sectionContainer: { paddingHorizontal: 20, marginTop: 15 },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
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
    marginRight: 8,
  },
  saveBtn: {
    backgroundColor: '#E31B23',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  plateContainer: {
    borderWidth: 2,
    borderColor: '#111111',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 4,
    elevation: 3,
    ...Platform.select({
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  plateContent: {
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
  },
  plateHeader: { fontSize: 12, fontWeight: '900', color: '#111111' },
  plateBody: { fontSize: 16, fontWeight: '900', color: '#111111', marginTop: 1 },

  idCard: { padding: 15, borderRadius: 16, marginTop: 5 },
  idRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  idCol: { flex: 1 },
  idLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  idValue: { fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  divider: {
    width: 1,
    height: 25,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 12,
  },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginBottom: 15,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  loadingText: { marginLeft: 8, fontSize: 13, fontWeight: '600' },
  errorBanner: {
    padding: 14,
    marginBottom: 15,
    borderRadius: 16,
    borderWidth: 1,
  },
  errorTitle: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  errorBanner2: {
    padding: 10,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
  },
  errorTitle2: { fontSize: 12, fontWeight: '600', color: '#DC2626' },
  errorDescription: { fontSize: 12, lineHeight: 18 },
  retryButton: { marginTop: 10, paddingVertical: 10, borderRadius: 14, alignItems: 'center' },
  retryButtonText: { color: '#fff', fontWeight: '700' },

  liveGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  liveCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  liveLabel: { fontSize: 10 },
  liveValue: { fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  liveHint: { fontSize: 9, marginTop: 1 },

  progressWrapper: {
    padding: 15,
    borderRadius: 14,
    borderWidth: 1,
  },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12 },
  progressPercent: { fontSize: 12, fontWeight: 'bold' },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 4 },
  warrantyDetailsText: { fontSize: 10, marginTop: 8, fontStyle: 'italic' },

  healthCard: { padding: 15, borderRadius: 16, borderWidth: 1 },
  partItem: {},
  partHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  partName: { fontSize: 13, fontWeight: 'bold' },
  partStatus: { fontSize: 11, fontWeight: 'bold' },
  partBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  partBarFill: { height: '100%', borderRadius: 3 },
  partDetail: { fontSize: 10, marginTop: 6 },

  historyShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
  },
  shortcutTitle: { fontSize: 13, fontWeight: 'bold' },
  shortcutSubtitle: { fontSize: 10, marginTop: 2 },

  docsCard: { padding: 15, borderRadius: 16 },
  docItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  docIconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docName: { fontSize: 13, fontWeight: 'bold' },
  docStatus: { fontSize: 10, marginTop: 2 },

  renewBtn: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  renewBtnText: { color: '#EF4444', fontSize: 11, fontWeight: 'bold' },

  statusCompletedBadge: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
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
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  footerRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  manualBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  manualBtnText: { fontSize: 12, fontWeight: 'bold', marginLeft: 8 },
  bookingBtn: { flex: 1, height: 48, borderRadius: 12, overflow: 'hidden' },
  gradientBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bookingBtnText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', borderRadius: 20, padding: 18, borderWidth: 1 },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
    fontSize: 14,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 10 },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  modalCancelBtn: { borderWidth: 1 },
  modalSaveBtn: {},
  modalBtnText: { fontSize: 13, fontWeight: '700' },
  modalContent: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    elevation: 5,
    ...Platform.select({
      web: { boxShadow: '0px 10px 10px rgba(0,0,0,0.25)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
    }),
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalBody: { maxHeight: 300, marginBottom: 15 },
  manualTipCard: { padding: 12, borderRadius: 12 },
  tipTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 6 },
  tipDesc: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  closeModalBtn: {
    backgroundColor: '#E31B23',
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: { color: '#FFF', fontWeight: 'bold' },

  invoiceScroll: { maxHeight: 320, padding: 12 },
  invoiceDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
    borderStyle: 'dashed',
  },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  invLabel: { color: '#64748B', fontSize: 12 },
  invVal: {
    color: '#111111',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
    marginLeft: 15,
  },
  invoiceActionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
