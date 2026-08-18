import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme, useActiveColors } from '../../../theme/Theme';
import {
  Award,
  Shield,
  Wrench,
  Clock,
  FileText,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  Sparkles,
  Star,
  Camera,
  LogOut,
  Trash2,
  ChevronRight,
  Settings,
} from 'lucide-react-native';
import ScalePress from '../../../components/ScalePress';
import CustomBottomSheet from '../../../components/CustomBottomSheet';
import { verticalScale } from '../../../utils/responsive';
import {
  useProfileController,
  MOCK_REGIONS,
} from '../../../features/profile/presentation/controller/useProfileController';
import { useGlobalState } from '../../../context/GlobalState';
import { createStyles } from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../../components/GlassCard';

export default function ProfileScreen({ navigation, route }) {
  const bottomSheetRef = useRef(null);
  const [activeRegionList, setActiveRegionList] = useState(null);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  const {
    profile,
    isLoading,
    isSaving,
    activeField,
    tempData,
    setTempData,
    passwordForm,
    setPasswordForm,
    openEditField,
    handleSaveField,
    handleSelectPhoto,
    handleSelectCartoonAvatar,
    handleDeleteAccount,
    handleLogout,
    cartoonAvatars,
    personalOutputs,
    personalRepairs,
  } = useProfileController(navigation, bottomSheetRef);

  const { setSettingsOpen } = useGlobalState();
  const activeColors = useActiveColors();
  const isDark = activeColors.isDark;
  const styles = createStyles(activeColors);
  const blockBg = { backgroundColor: activeColors.cardBg, borderColor: activeColors.border };

  useEffect(() => {
    if (route?.params?.openSettings) {
      setSettingsOpen(true);
      navigation.setParams({ openSettings: undefined });
    }
  }, [route?.params?.openSettings, navigation, setSettingsOpen]);

  const regionList =
    activeRegionList === 'provinces'
      ? MOCK_REGIONS.provinces
      : activeRegionList === 'districts'
        ? MOCK_REGIONS.districts[tempData?.province] || []
        : activeRegionList === 'wards'
          ? MOCK_REGIONS.wards[tempData?.district] || []
          : [];

  const handleRegionSelect = (item) => {
    if (activeRegionList === 'provinces') {
      setTempData((p) => ({ ...p, province: item }));
      setActiveRegionList('districts');
    } else if (activeRegionList === 'districts') {
      setTempData((p) => ({ ...p, district: item }));
      setActiveRegionList('wards');
    } else if (activeRegionList === 'wards') {
      setTempData((p) => ({ ...p, ward: item }));
      setActiveRegionList(null);
    }
  };

  const regionVal = (field, fallback) => (tempData && tempData[field] ? tempData[field] : fallback);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: activeColors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={activeColors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.shell} edges={['top']}>
      <LinearGradient
        colors={[activeColors.gradientStart, activeColors.gradientEnd]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(170) }}
      >
        {}
        <View style={styles.headerBlock}>
          <TouchableOpacity 
            style={styles.settingsBtn} 
            onPress={() => setSettingsModalVisible(true)}
          >
            <Settings color={activeColors.text} size={24} />
          </TouchableOpacity>
          <View style={styles.avatarWrap}>
            <Image
              source={{
                uri:
                  profile.avatar ||
                  'https://img.freepik.com/free-vector/cute-boy-with-glasses-hoodie-pixel-art-style_475147-155.jpg',
              }}
              style={[styles.avatarProfile, { borderColor: activeColors.primary + '66' }]}
            />
            <TouchableOpacity
              style={[styles.camBadge, { backgroundColor: activeColors.primary }]}
              onPress={() => handleSelectPhoto('gallery')}
            >
              <Camera color="#FFFFFF" size={14} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.headerName, { color: activeColors.text }]}>
            {profile.name || 'Khách hàng'}
          </Text>
          <Text style={[styles.headerRole, { color: activeColors.subtext }]}>
            Tài khoản khách hàng
          </Text>
          <View style={styles.scoreRow}>
            <Award color={Theme.staticColors.primary} size={14} />
            <Text style={[styles.scoreText, { color: activeColors.primary }]}>
              Điểm thưởng: 12,500
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => openEditField('profile')}
            style={{
              marginTop: 12,
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: activeColors.primary,
              backgroundColor: activeColors.primary + '11',
              alignSelf: 'center',
            }}
          >
            <Text style={{ color: activeColors.primary, fontSize: 13, fontWeight: '600' }}>
              Chỉnh sửa thông tin
            </Text>
          </TouchableOpacity>
        </View>

        {}
        <GlassCard style={styles.block} contentStyle={{ padding: 0 }}>
          <Text style={[styles.blockTitle, { color: activeColors.text }]}>DỊCH VỤ & BẢO HÀNH</Text>
          <View style={styles.gridRowInner}>
            {[
              {
                i: Wrench,
                c: '#10B981',
                bg: 'rgba(16,185,129,0.1)',
                l: 'Lịch sử dịch vụ',
                a: () => navigation.navigate('ServiceHistory'),
              },
              {
                i: Clock,
                c: '#F59E0B',
                bg: 'rgba(245,158,11,0.1)',
                l: 'Lịch hẹn',
                a: () => navigation.navigate('AppointmentBooking'),
              },
            ].map(({ i: Icon, c, bg, l, a }) => (
              <TouchableOpacity key={l} style={styles.gridCol} onPress={a}>
                <View style={[styles.gridIcon, { backgroundColor: bg }]}>
                  <Icon color={c} size={21} />
                </View>
                <Text style={[styles.gridLabel, { color: activeColors.text }]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {}
        <GlassCard style={styles.block} contentStyle={{ padding: 0 }}>
          <Text style={[styles.blockTitle, { color: activeColors.text }]}>
            TÀI CHÍNH & HỢP ĐỒNG
          </Text>
          <View style={styles.gridRowInner}>
            {[
              {
                i: FileText,
                c: '#E31B23',
                bg: 'rgba(227,27,35,0.1)',
                l: 'Hóa đơn',
                a: () => navigation.navigate('InvoiceScreen'),
              },
              {
                i: CreditCard,
                c: '#A855F7',
                bg: 'rgba(168,85,247,0.1)',
                l: 'Hợp đồng TC',
                a: () => navigation.navigate('FinanceContract'),
              },
            ].map(({ i: Icon, c, bg, l, a }) => (
              <TouchableOpacity key={l} style={styles.gridCol} onPress={a}>
                <View style={[styles.gridIcon, { backgroundColor: bg }]}>
                  <Icon color={c} size={21} />
                </View>
                <Text style={[styles.gridLabel, { color: activeColors.text }]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {}
        <GlassCard style={styles.block} contentStyle={{ padding: 0 }}>
          <Text style={[styles.blockTitle, { color: activeColors.text }]}>
            ĐƠN HÀNG PHỤ TÙNG & PHỤ KIỆN
          </Text>
          <View style={styles.iconRow}>
            {[
              {
                I: Clock,
                l: 'Chờ XN',
                badge: personalOutputs.filter(o => ['pending', 'waiting_deposit', 'waiting_installment'].includes(o.statusId)).length || null,
                c: '#94A3B8',
                m: 'Đơn hàng đang chờ xác nhận.',
              },
              {
                I: Package,
                l: 'Chuẩn bị',
                badge: personalOutputs.filter(o => ['paid_processing', 'confirmed_cod', 'deposit_paid'].includes(o.statusId)).length || null,
                c: '#A855F7',
                m: 'Đơn hàng đang được chuẩn bị.',
              },
              {
                I: Truck,
                l: 'Đang giao',
                badge: personalOutputs.filter(o => o.statusId === 'delivering').length || null,
                c: '#E31B23',
                dot: personalOutputs.some(o => o.statusId === 'delivering'),
                m: 'Đơn hàng đang được giao đến bạn.',
              },
              {
                I: CheckCircle,
                l: 'Hoàn thành',
                badge: personalOutputs.filter(o => o.statusId === 'completed').length || null,
                c: '#10B981',
                m: 'Lịch sử đơn hàng đã hoàn thành.',
              },
            ].map(({ I: Icon, l, badge, c, dot, m }) => (
              <TouchableOpacity
                key={l}
                style={styles.iconCol}
                onPress={() => {
                  const items = personalOutputs.filter(o => {
                    if (l === 'Chờ XN') return ['pending', 'waiting_deposit', 'waiting_installment'].includes(o.statusId);
                    if (l === 'Chuẩn bị') return ['paid_processing', 'confirmed_cod', 'deposit_paid'].includes(o.statusId);
                    if (l === 'Đang giao') return o.statusId === 'delivering';
                    if (l === 'Hoàn thành') return o.statusId === 'completed';
                    return false;
                  });
                  if (items.length > 0) {
                    navigation.navigate('StatusList', { title: l, items, type: 'outputs' });
                  } else {
                    navigation.navigate('StatusList', { title: l, items: [], type: 'outputs' });
                  }
                }}
              >
                <View style={[styles.iconCircle, { backgroundColor: activeColors.listIconBg }]}>
                  <Icon color={c} size={22} />
                  {badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
                    </View>
                  )}
                  {dot && <View style={styles.badgeDot} />}
                </View>
                <Text
                  style={[
                    styles.iconLabel,
                    {
                      color: l === 'Đang giao' ? c : activeColors.subtext,
                      fontWeight: l === 'Đang giao' ? '700' : '400',
                    },
                  ]}
                >
                  {l}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {}
        <GlassCard style={styles.block} contentStyle={{ padding: 0 }}>
          <Text style={[styles.blockTitle, { color: activeColors.text }]}>
            TRẠNG THÁI BẢO DƯỠNG
          </Text>
          <View style={styles.iconRow}>
            {[
              {
                I: Sparkles,
                l: 'Đã nhận',
                c: '#8B5CF6',
                m: 'Xe đang được đội kỹ thuật tiếp nhận & kiểm tra.',
              },
              {
                I: Wrench,
                l: 'Đang sửa',
                c: '#E31B23',
                m: 'Kỹ thuật viên đang thay nhớt, vệ sinh lọc gió.',
              },
              {
                I: Sparkles,
                l: 'Chờ nhận',
                badge: null,
                c: '#10B981',
                m: 'Xe đã hoàn thành & rửa bọt tuyết bóng loáng!',
              },
              {
                I: Star,
                l: 'Hoàn thành',
                badge: personalRepairs.length || null,
                c: '#EC4899',
                m: 'Phiếu bảo dưỡng đã hoàn tất.',
              },
            ].map(({ I: Icon, l, badge, c, m }) => (
              <TouchableOpacity key={l} style={styles.iconCol} onPress={() => {
                navigation.navigate('StatusList', { title: l, items: personalRepairs, type: 'repairs' });
              }}>
                <View style={[styles.iconCircle, { backgroundColor: activeColors.listIconBg }]}>
                  <Icon color={c} size={22} />
                  {badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.iconLabel, { color: activeColors.subtext }]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {}
        <GlassCard style={styles.block} contentStyle={{ padding: 0 }}>
          <Text style={[styles.blockTitle, { color: activeColors.text }]}>ĐÁNH GIÁ</Text>
          <View style={styles.ratingRow}>
            {[
              { I: Star, t: '4.8/5.0', s: '25 đánh giá', c: '#F59E0B' },
              { I: Shield, t: 'Uy tín #1', s: 'Biên Hòa', c: '#10B981' },
              { I: Award, t: '12,500 điểm', s: 'Hạng Vàng', c: Theme.staticColors.primary },
            ].map(({ I: Icon, t, s, c }, i) => (
              <View key={i} style={styles.ratingItem}>
                <Icon color={c} size={24} />
                <Text
                  style={{
                    color: activeColors.text,
                    fontSize: 13,
                    fontWeight: '600',
                    marginTop: 4,
                  }}
                >
                  {t}
                </Text>
                <Text style={{ color: activeColors.subtext, fontSize: 11 }}>{s}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <View style={{ height: 20 }} />
      </ScrollView>

      {}
      <View style={[styles.bottomActions, { borderTopColor: activeColors.border }]}>
        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: 'rgba(227,27,35,0.2)' }]}
          onPress={handleLogout}
        >
          <LogOut color="#E31B23" size={17} />
          <Text style={[styles.actionBtnText, { color: '#E31B23' }]}>Đăng xuất</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: 'rgba(220,38,38,0.2)' }]}
          onPress={handleDeleteAccount}
        >
          <Trash2 color="#E31B23" size={17} />
          <Text style={[styles.actionBtnText, { color: '#E31B23' }]}>Xóa TK</Text>
        </TouchableOpacity>
      </View>



      {}
      <Modal visible={settingsModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: activeColors.background }}>
          <View style={[styles.modalHeader, { borderBottomColor: activeColors.border }]}>
            <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
              <Text style={styles.modalClose}>Đóng</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Cài đặt</Text>
            <View style={{ width: 50 }} />
          </View>
          <ScrollView style={{ flex: 1, padding: 16 }}>
            <GlassCard style={[styles.block, { marginBottom: 12 }]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ marginRight: 10 }}>
                    <Settings color={activeColors.primary} size={20} />
                  </View>
                  <Text style={[styles.settingTitle, { color: activeColors.text }]}>
                    Chế độ Debug
                  </Text>
                </View>
                <View
                  style={[
                    styles.toggleTrack,
                    {
                      backgroundColor: profile.settings?.debugMode
                        ? Theme.staticColors.primary
                        : activeColors.subtext + '44',
                    },
                  ]}
                >
                  <View
                    style={[styles.toggleThumb, profile.settings?.debugMode ? styles.thumbOn : {}]}
                  />
                </View>
              </View>
            </GlassCard>
            <Text style={{ color: activeColors.subtext, fontSize: 12, marginTop: 8 }}>
              Mock Mode: <Text style={{ color: activeColors.primary, fontWeight: '600' }}>ON</Text>{' '}
              — Sửa máy thủ công để kiểm thử
            </Text>
            <TouchableOpacity
              style={[
                styles.logoutBtnRow,
                { backgroundColor: activeColors.cardBg, borderColor: activeColors.border },
              ]}
              onPress={handleLogout}
            >
              <LogOut color="#E31B23" size={18} />
              <Text style={{ color: '#E31B23', fontSize: 15, fontWeight: '600', marginLeft: 8 }}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {}
      <CustomBottomSheet
        ref={bottomSheetRef}
        apiResponse={null}
        loading={false}
        activeField={activeField}
      >
        {isSaving && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
            }}
          >
            <ActivityIndicator size="large" color={activeColors.primary} />
          </View>
        )}

        {activeField === 'profile' && (
          <View>
            <Text style={[styles.bottomTitle, { color: activeColors.text }]}>
              Thông tin cá nhân
            </Text>
            <TextInput
              value={tempData?.name || ''}
              onChangeText={(t) => setTempData((p) => ({ ...p, name: t }))}
              placeholder="Họ và tên"
              placeholderTextColor={activeColors.subtext}
              style={[
                styles.bottomInput,
                { color: activeColors.text, borderColor: activeColors.border },
              ]}
            />
            <TextInput
              value={tempData?.email || ''}
              onChangeText={(t) => setTempData((p) => ({ ...p, email: t }))}
              placeholder="Email"
              placeholderTextColor={activeColors.subtext}
              keyboardType="email-address"
              style={[
                styles.bottomInput,
                { color: activeColors.text, borderColor: activeColors.border },
              ]}
            />
            <Text
              style={{
                color: activeColors.subtext,
                fontSize: 12,
                fontWeight: '600',
                marginTop: 10,
              }}
            >
              Địa chỉ
            </Text>
            {tempData?.province || tempData?.district || tempData?.ward ? (
              <Text
                style={{
                  color: activeColors.text,
                  fontSize: 14,
                  fontWeight: '600',
                  marginBottom: 8,
                }}
              >
                {[tempData.province, tempData.district, tempData.ward].filter(Boolean).join(', ')}
              </Text>
            ) : (
              <Text style={{ color: activeColors.subtext, fontSize: 13, marginBottom: 8 }}>
                Chưa chọn địa chỉ — bấm để chọn
              </Text>
            )}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {['province', 'district', 'ward'].map((field) => (
                <TouchableOpacity
                  key={field}
                  style={[
                    styles.chip,
                    { borderColor: activeColors.border, backgroundColor: activeColors.cardBg },
                  ]}
                  onPress={() => setActiveRegionList(field)}
                >
                  <Text style={{ color: activeColors.text, fontSize: 12 }}>
                    {field === 'province'
                      ? 'Tỉnh/TP'
                      : field === 'district'
                        ? 'Quận/Huyện'
                        : 'Phường/Xã'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {regionList.length > 0 && (
              <ScrollView style={{ maxHeight: 160, marginTop: 6 }} nestedScrollEnabled>
                {regionList.map((item) => {
                  const cur =
                    activeRegionList === 'provinces'
                      ? tempData?.province
                      : activeRegionList === 'districts'
                        ? tempData?.district
                        : tempData?.ward;
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => handleRegionSelect(item)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(255,255,255,0.04)',
                      }}
                    >
                      <Text
                        style={{
                          color: cur === item ? activeColors.primary : activeColors.text,
                          fontSize: 14,
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
            <Text
              style={{
                color: activeColors.subtext,
                fontSize: 12,
                fontWeight: '600',
                marginTop: 10,
              }}
            >
              Giấy phép lái xe
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              {['A1', 'A2', 'B1', 'B2'].map((tier) => (
                <TouchableOpacity
                  key={tier}
                  onPress={() => setTempData((p) => ({ ...p, licenseTier: tier }))}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        tempData?.licenseTier === tier ? activeColors.primary : activeColors.cardBg,
                      borderColor: activeColors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: tempData?.licenseTier === tier ? '#fff' : activeColors.text,
                      fontSize: 13,
                      fontWeight: '600',
                    }}
                  >
                    {tier}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <ScalePress onPress={handleSaveField}>
              <View
                style={[
                  styles.bottomSaveBtn,
                  { backgroundColor: activeColors.primary, marginTop: 18 },
                ]}
              >
                <Text style={styles.bottomSaveBtnText}>Lưu</Text>
              </View>
            </ScalePress>
          </View>
        )}

        {activeField === 'address' && (
          <View>
            <Text style={[styles.bottomTitle, { color: activeColors.text }]}>Địa chỉ</Text>
            {['province', 'district', 'ward'].map((field, idx) => (
              <TouchableOpacity
                key={field}
                onPress={() => setActiveRegionList(field)}
                style={[
                  styles.bottomInput,
                  {
                    justifyContent: 'center',
                    borderColor: activeColors.border,
                    height: 42,
                    marginTop: idx === 0 ? 0 : 8,
                  },
                ]}
              >
                <Text
                  style={{ color: regionVal(field, '') ? activeColors.text : activeColors.subtext }}
                >
                  {regionVal(field, '') || ['Tỉnh/thành', 'Quận/huyện', 'Phường/xã'][idx]}
                </Text>
                <ChevronRight
                  color={activeColors.subtext}
                  size={18}
                  style={{ position: 'absolute', right: 12 }}
                />
              </TouchableOpacity>
            ))}
            {regionList.length > 0 && (
              <ScrollView style={{ maxHeight: 160, marginTop: 4 }} nestedScrollEnabled>
                {regionList.map((item) => {
                  const cur =
                    activeRegionList === 'provinces'
                      ? tempData?.province
                      : activeRegionList === 'districts'
                        ? tempData?.district
                        : tempData?.ward;
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => handleRegionSelect(item)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(255,255,255,0.04)',
                      }}
                    >
                      <Text
                        style={{
                          color: cur === item ? activeColors.primary : activeColors.text,
                          fontSize: 14,
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
            <ScalePress onPress={handleSaveField}>
              <View
                style={[
                  styles.bottomSaveBtn,
                  { backgroundColor: activeColors.primary, marginTop: 18 },
                ]}
              >
                <Text style={styles.bottomSaveBtnText}>Lưu</Text>
              </View>
            </ScalePress>
          </View>
        )}

        {activeField === 'license' && (
          <View>
            <Text style={[styles.bottomTitle, { color: activeColors.text }]}>Giấy phép lái xe</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              {['A1', 'A2', 'B1', 'B2'].map((tier) => (
                <TouchableOpacity
                  key={tier}
                  onPress={() => setTempData((p) => ({ ...p, licenseTier: tier }))}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        tempData?.licenseTier === tier ? activeColors.primary : activeColors.cardBg,
                      borderColor: activeColors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: tempData?.licenseTier === tier ? '#fff' : activeColors.text,
                      fontSize: 13,
                      fontWeight: '600',
                    }}
                  >
                    {tier}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <ScalePress onPress={handleSaveField}>
              <View
                style={[
                  styles.bottomSaveBtn,
                  { backgroundColor: activeColors.primary, marginTop: 18 },
                ]}
              >
                <Text style={styles.bottomSaveBtnText}>Lưu</Text>
              </View>
            </ScalePress>
          </View>
        )}

        {activeField === 'name' && (
          <View>
            <Text style={[styles.bottomTitle, { color: activeColors.text }]}>Tên hiển thị</Text>
            <TextInput
              value={tempData?.name || ''}
              onChangeText={(t) => setTempData((p) => ({ ...p, name: t }))}
              placeholder="Nhập tên"
              placeholderTextColor={activeColors.subtext}
              style={[
                styles.bottomInput,
                { color: activeColors.text, borderColor: activeColors.border },
              ]}
            />
            <ScalePress onPress={handleSaveField}>
              <View
                style={[
                  styles.bottomSaveBtn,
                  { backgroundColor: activeColors.primary, marginTop: 18 },
                ]}
              >
                <Text style={styles.bottomSaveBtnText}>Lưu</Text>
              </View>
            </ScalePress>
          </View>
        )}

        {activeField === 'email' && (
          <View>
            <Text style={[styles.bottomTitle, { color: activeColors.text }]}>Email</Text>
            <TextInput
              value={tempData?.email || ''}
              onChangeText={(t) => setTempData((p) => ({ ...p, email: t }))}
              placeholder="Nhập email"
              placeholderTextColor={activeColors.subtext}
              keyboardType="email-address"
              style={[
                styles.bottomInput,
                { color: activeColors.text, borderColor: activeColors.border },
              ]}
            />
            <ScalePress onPress={handleSaveField}>
              <View
                style={[
                  styles.bottomSaveBtn,
                  { backgroundColor: activeColors.primary, marginTop: 18 },
                ]}
              >
                <Text style={styles.bottomSaveBtnText}>Lưu</Text>
              </View>
            </ScalePress>
          </View>
        )}

        {activeField === 'password' && (
          <View>
            <Text style={[styles.bottomTitle, { color: activeColors.text }]}>Đổi mật khẩu</Text>
            <TextInput
              value={passwordForm.oldPassword}
              onChangeText={(t) => setPasswordForm((p) => ({ ...p, oldPassword: t }))}
              placeholder="Mật khẩu cũ"
              placeholderTextColor={activeColors.subtext}
              secureTextEntry
              style={[
                styles.bottomInput,
                { color: activeColors.text, borderColor: activeColors.border },
              ]}
            />
            <TextInput
              value={passwordForm.newPassword}
              onChangeText={(t) => setPasswordForm((p) => ({ ...p, newPassword: t }))}
              placeholder="Mật khẩu mới"
              placeholderTextColor={activeColors.subtext}
              secureTextEntry
              style={[
                styles.bottomInput,
                { color: activeColors.text, borderColor: activeColors.border },
              ]}
            />
            <TextInput
              value={passwordForm.confirmPassword}
              onChangeText={(t) => setPasswordForm((p) => ({ ...p, confirmPassword: t }))}
              placeholder="Xác nhận mật khẩu"
              placeholderTextColor={activeColors.subtext}
              secureTextEntry
              style={[
                styles.bottomInput,
                { color: activeColors.text, borderColor: activeColors.border },
              ]}
            />
            <ScalePress onPress={handleSaveField}>
              <View
                style={[
                  styles.bottomSaveBtn,
                  { backgroundColor: activeColors.primary, marginTop: 18 },
                ]}
              >
                <Text style={styles.bottomSaveBtnText}>Đổi mật khẩu</Text>
              </View>
            </ScalePress>
          </View>
        )}

        {activeField === 'language' && (
          <View>
            <Text style={[styles.bottomTitle, { color: activeColors.text }]}>Ngôn ngữ</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[
                { c: 'vi', l: '🇻🇳 Tiếng Việt' },
                { c: 'en', l: '🇬🇧 English' },
              ].map((lang) => (
                <TouchableOpacity
                  key={lang.c}
                  onPress={() => setTempData((p) => ({ ...p, language: lang.c }))}
                >
                  <View
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          tempData?.language === lang.c
                            ? activeColors.primary
                            : activeColors.cardBg,
                        borderColor: activeColors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: tempData?.language === lang.c ? '#fff' : activeColors.text,
                        fontSize: 13,
                        fontWeight: '600',
                      }}
                    >
                      {lang.l}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <ScalePress onPress={handleSaveField}>
              <View
                style={[
                  styles.bottomSaveBtn,
                  { backgroundColor: activeColors.primary, marginTop: 18 },
                ]}
              >
                <Text style={styles.bottomSaveBtnText}>Lưu</Text>
              </View>
            </ScalePress>
          </View>
        )}

        {activeField === 'theme' && (
          <View>
            <Text style={[styles.bottomTitle, { color: activeColors.text }]}>Giao diện</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[
                { c: 'light', l: '☀️ Sáng' },
                { c: 'dark', l: '🌙 Tối' },
                { c: 'system', l: '💻 Tự động' },
              ].map((th) => (
                <TouchableOpacity
                  key={th.c}
                  onPress={() => setTempData((p) => ({ ...p, theme: th.c }))}
                >
                  <View
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          tempData?.theme === th.c ? activeColors.primary : activeColors.cardBg,
                        borderColor: activeColors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: tempData?.theme === th.c ? '#fff' : activeColors.text,
                        fontSize: 13,
                        fontWeight: '600',
                      }}
                    >
                      {th.l}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <ScalePress onPress={handleSaveField}>
              <View
                style={[
                  styles.bottomSaveBtn,
                  { backgroundColor: activeColors.primary, marginTop: 18 },
                ]}
              >
                <Text style={styles.bottomSaveBtnText}>Lưu</Text>
              </View>
            </ScalePress>
          </View>
        )}
      </CustomBottomSheet>
    </SafeAreaView>
  );
}
