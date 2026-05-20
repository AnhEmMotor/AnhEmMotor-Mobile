import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Clipboard,
  TextInput,
  Animated as RNAnimated,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Share2,
  Calendar,
  User,
  Tag,
  Bell,
  Gift,
  ArrowRight,
  QrCode,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  Bookmark,
  Sparkles,
  Heart,
  ThumbsUp,
  MessageSquare,
  HelpCircle,
  MapPin,
  Map,
  Bike,
  CalendarClock,
  ShieldAlert
} from 'lucide-react-native';
import { useActiveColors, Theme } from '../../theme/Theme';
import GlassCard from '../../components/GlassCard';
import ScalePress from '../../components/ScalePress';
import { horizontalScale, verticalScale, moderateScale } from '../../utils/responsive';

const { width } = Dimensions.get('window');

// Danh sách bài viết liên quan (Mock data cho Carousel)
const MOCK_RELATED_NEWS = [
  {
    id: 'n1',
    title: 'Top 5 mốc bảo dưỡng xe ga quan trọng nhất',
    desc: 'Lọc gió, dầu máy, nước làm mát là những thứ tuyệt đối không được quên...',
    author: 'Khánh AEM',
    date: '16/05/2026',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'n2',
    title: 'Cách phân biệt xăng giả xăng thật bằng mắt',
    desc: 'Chỉ với một số mẹo nhỏ đơn giản, bạn có thể tự bảo vệ động cơ xe của mình...',
    author: 'Minh Motor',
    date: '15/05/2026',
    image: 'https://images.unsplash.com/photo-1525160354320-d8e92641c563?auto=format&fit=crop&w=300&q=80'
  }
];

export default function HomeDetailScreen({ route, navigation }) {
  const { type: initialType, item: initialItem } = route.params || {};
  const colors = useActiveColors();
  const theme = useTheme(); // Use the useTheme hook
  const isDark = colors.isDark;

  // Hỗ trợ chuyển đổi bài viết khi nhấn vào Tin liên quan
  const [activeType, setActiveType] = useState(initialType);
  const [activeItem, setActiveItem] = useState(initialItem);

  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // States cho Booking Modal tích hợp trực tiếp
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('18/05/2026');
  const [selectedTime, setSelectedTime] = useState('09:30');

  // States cho Phản ứng (Reactions) trên Tin tức
  const [reactions, setReactions] = useState({
    likes: 42,
    hearts: 28,
    bikes: 19,
    helpful: 35
  });
  const [userReactions, setUserReactions] = useState({
    likes: false,
    hearts: false,
    bikes: false,
    helpful: false
  });

  // State cho phần bình luận bài viết
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { id: '1', author: 'Thành Đạt', text: 'Bài viết hữu ích quá, cuối tuần này mình phải đi bảo dưỡng định kỳ ngay!', time: '10 phút trước', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80' },
    { id: '2', author: 'Quốc Bảo', text: 'Cho mình hỏi cửa hàng có phủ bóng Nano cho xe phân phối lớn không ạ?', time: '30 phút trước', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80' }
  ]);

  // Bộ đếm thời gian khuyến mãi thực tế (Ticking Countdown)
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 14,
    minutes: 45,
    seconds: 59
  });

  useEffect(() => {
    // Chỉ tạo bộ đếm thời gian cho Ưu đãi
    if (activeType !== 'promo') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeType, activeItem]);

  if (!activeItem) {
    return (
      <SafeAreaView style={[getStyles(theme).container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={getStyles(theme).centerContainer}>
          <Text style={{ color: colors.text }}>Không tìm thấy dữ liệu chi tiết.</Text> {/* This is fine */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={[getStyles(theme).backIconBtn, { marginTop: 20, backgroundColor: colors.card }]}>
            <Text style={{ color: colors.primary }}>Quay lại</Text> {/* This is fine */}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${activeItem.title || 'AnhEmMotor'}\n\n${activeItem.desc || activeItem.message || ''}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const copyToClipboard = () => {
    if (activeItem.code) {
      Clipboard.setString(activeItem.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleReaction = (type) => {
    setUserReactions(prev => {
      const active = !prev[type];
      setReactions(r => ({
        ...r,
        [type]: active ? r[type] + 1 : r[type] - 1
      }));
      return { ...prev, [type]: active };
    });
  };

  const handlePostComment = () => {
    if (commentText.trim().length === 0) return;
    const newComment = {
      id: Date.now().toString(),
      author: 'Anh Khôi',
      text: commentText,
      time: 'Vừa xong',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
    };
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  // Render Alert Details (Nhắc nhở quan trọng)
  const renderAlertDetail = () => {
    const isCritical = activeItem.type === 'critical';
    const alertColor = isCritical ? colors.error : '#F59E0B'; // Soft orange for warn alerts
    const alertImg = 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80'; // Modern maintenance bay image

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <GlassCard style={[getStyles(theme).contentCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} intensity={15}>
          {/* Featured Alert Banner Image */}
          <View style={getStyles(theme).voucherImageWrapper}>
            <Image source={{ uri: alertImg }} style={getStyles(theme).voucherImageBanner} />
            <View style={[getStyles(theme).voucherImageOverlayBadge, { backgroundColor: theme.colors.warning }]}>
              <Text style={getStyles(theme).voucherImageOverlayText}>BẢO DƯỠNG ĐỊNH KỲ</Text>
            </View>
          </View>

          {/* Header với Icon */}
          <View style={[styles.alertHeader, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconWrapper, { backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)' }]}>
              {isCritical ? <AlertTriangle color="#EF4444" size={moderateScale(32)} /> : <ShieldAlert color="#F59E0B" size={moderateScale(32)} />}
            </View>
            <Text style={[getStyles(theme).detailTitle, { color: colors.text }]}>{activeItem.title || 'Bảo dưỡng định kỳ'}</Text>
            <View style={[styles.badge, { backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)' }]}>
              <Text style={{ color: isCritical ? '#EF4444' : '#F59E0B', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 }}>
                {isCritical ? 'KHẨN CẤP' : 'CẢNH BÁO'}
              </Text>
            </View>
          </View>

          <View style={styles.alertBody}>
            {/* 1. KHỐI ĐỊNH DANH XE */}
            <View style={[getStyles(theme).vehicleInfoBox, { borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }]}>
              <Text style={[getStyles(theme).vehicleInfoTitle, { color: colors.subtext }]}>Phương tiện cảnh báo:</Text>
              <Text style={[getStyles(theme).vehicleInfoName, { color: colors.primary }]}>Honda SH 125i</Text>
              <Text style={[getStyles(theme).vehicleInfoPlate, { color: colors.text, fontWeight: '600' }]}>Biển số: 60-A1 555.55</Text>
            </View>
            {/* Use getStyles for bodyText */}
            {/* Thông báo số km */}
            <Text style={[styles.bodyText, { color: colors.text, fontSize: 15, lineHeight: 22, marginTop: 15, marginBottom: 15 }]}>
              Xe của bạn đã đi được <Text style={{ fontWeight: 'bold', color: colors.primary }}>5,000 km</Text> kể từ lần bảo dưỡng định kỳ trước.
            </Text>

            {/* Dải phân cách mỏng */}
            <View style={[styles.alertDivider, { backgroundColor: colors.border }]} />

            {/* 2. KHỐI HẠNG MỤC KHUYẾN NGHỊ */}
            <View style={getStyles(theme).alertRecommendations}>
              <Text style={[getStyles(theme).recommendationHeading, { color: colors.text }]}>
                Tại mốc 5,000km, để đảm bảo xe vận hành bốc, tiết kiệm xăng và đạt chuẩn Xe Sạch, kỹ thuật viên khuyến nghị bạn cần thực hiện:
              </Text>

              <View style={getStyles(theme).recommendationList}>
                <View style={getStyles(theme).recommendationItem}>
                  <View style={[getStyles(theme).benefitCheckWrapper, { backgroundColor: theme.colors.success + '1A' }]}>
                    <Check color="#10B981" size={10} strokeWidth={3} />
                  </View>
                  <Text style={[getStyles(theme).recommendationText, { color: colors.text }]}>Thay nhớt máy & Nhớt hộp số (nhớt lốp).</Text>
                </View>

                <View style={getStyles(theme).recommendationItem}>
                  <View style={[getStyles(theme).benefitCheckWrapper, { backgroundColor: theme.colors.success + '1A' }]}>
                    <Check color="#10B981" size={10} strokeWidth={3} />
                  </View>
                  <Text style={[getStyles(theme).recommendationText, { color: colors.text }]}>Kiểm tra vệ sinh lọc gió động cơ.</Text>
                </View>

                <View style={getStyles(theme).recommendationItem}>
                  <View style={[getStyles(theme).benefitCheckWrapper, { backgroundColor: theme.colors.success + '1A' }]}>
                    <Check color="#10B981" size={10} strokeWidth={3} />
                  </View>
                  <Text style={[getStyles(theme).recommendationText, { color: colors.text }]}>Kiểm tra hệ thống phanh an toàn trước & sau.</Text>
                </View>
              </View>
            </View>
            {/* Use getStyles for metaRow */}
            {/* Dải phân cách mỏng */}
            <View style={[styles.alertDivider, { backgroundColor: colors.border }]} />

            {/* Nguồn gửi tin */}
            <View style={[styles.metaRow, { marginTop: 15, justifyContent: 'center' }]}>
              <Clock color={colors.subtext} size={15} />
              <Text style={[styles.metaText, { color: colors.subtext }]}>Hôm nay • Gửi từ hệ thống CRM</Text>
            </View>
          </View>
        </GlassCard>

        {/* 3. KHỐI NÚT BẤM THAY ĐỔI HÀNH ĐỘNG */}
        <View style={getStyles(theme).alertActionContainer}>
          <TouchableOpacity
            style={[getStyles(theme).actionBtn, { backgroundColor: colors.primary, width: '100%' }]}
            onPress={() => {
              setBookingModalVisible(true);
            }}
          >
            <Text style={getStyles(theme).actionBtnText}>ĐẶT LỊCH BẢO DƯỠNG NGAY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.alertSecondaryBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.alertSecondaryBtnText, { color: colors.subtext }]}>Để sau</Text>
          </TouchableOpacity> {/* Use getStyles for alertSecondaryBtnText */}
        </View>
      </ScrollView>
    );
  };

  const getVoucherBenefits = (title) => {
    if (title.includes('Ceramic')) {
      return [
        'Giảm giá 50% chi phí phủ bóng Ceramic cao cấp bảo vệ tối đa nước sơn xe.',
        'Miễn phí 1 lần rửa xe bọt tuyết làm sạch sâu gầm máy trị giá 50.000đ.',
        'Hỗ trợ chế độ bảo hành bong tróc độ bóng Ceramic chính hãng trong 12 tháng.'
      ];
    } else if (title.includes('Nhớt')) {
      return [
        'Tặng hoàn toàn 01 chai nhớt động cơ cao cấp Shell Advance Ultra chính hãng.',
        'Hỗ trợ toàn bộ công thay dầu nhớt và vệ sinh lưới lọc thô hoàn toàn miễn phí.',
        'Kiểm tra, căn chỉnh áp suất lốp xe và bôi trơn hệ xích truyền động miễn phí.'
      ];
    } else {
      return [
        'Giảm giá trực tiếp 15% tổng giá trị hóa đơn sửa chữa hoặc thay thế phụ tùng dịch vụ.',
        'Miễn phí kiểm tra 10 hạng mục an toàn cốt lõi bảo đảm xe vận hành êm ái.',
        'Tặng kèm voucher rửa xe bọt tuyết siêu sạch cho lần làm dịch vụ tiếp theo.'
      ];
    }
  };

  const getVoucherImage = (title) => {
    if (title.includes('Ceramic')) {
      return 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80';
    } else if (title.includes('Nhớt')) {
      return 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80';
    } else {
      return 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80';
    }
  };

  // Render Voucher Details (Voucher dành riêng cho bạn)
  const renderVoucherDetail = () => {
    const benefits = getVoucherBenefits(activeItem.title);
    const voucherImg = getVoucherImage(activeItem.title);

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <GlassCard style={[getStyles(theme).contentCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} intensity={15}>
          {/* Featured Voucher Banner Image */}
          <View style={getStyles(theme).voucherImageWrapper}>
            <Image source={{ uri: voucherImg }} style={getStyles(theme).voucherImageBanner} />
            <View style={[getStyles(theme).voucherImageOverlayBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={getStyles(theme).voucherImageOverlayText}>VIP GIFT</Text>
            </View>
          </View>

          {/* Header */}
          <View style={[getStyles(theme).voucherHeader, { borderBottomColor: colors.border }]}>
            <View style={[getStyles(theme).voucherIconCircle, { backgroundColor: theme.colors.primary + '1A' }]}>
              <Gift color={theme.colors.primary} size={30} />
            </View>
            <Text style={[getStyles(theme).detailTitle, { color: colors.text, textAlign: 'center', marginTop: 15 }]}>{activeItem.title}</Text>
            <Text style={[getStyles(theme).voucherSubtitle, { color: colors.subtext }]}>Mã ưu đãi độc quyền dành cho bạn</Text>
          </View>

          <View style={styles.voucherBody}>
            {/* 1. THỜI GIAN, ĐỐI TƯỢNG, ĐỊA ĐIỂM (STRUCTURED INFO BOARD) */}
            <View style={[styles.voucherInfoBoard, { borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }]}>
              {/* Row 1: Thời gian */}
              <View style={styles.infoBoardRow}>
                <View style={[styles.infoIconBg, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                  <Calendar color="#3B82F6" size={16} />
                </View>
                <View style={styles.infoBoardCol}>
                  <Text style={[styles.infoLabel, { color: colors.subtext }]}>Thời gian áp dụng</Text>
                  <Text style={[styles.infoVal, { color: colors.text }]}>Từ 15/05/2026 đến hết 31/12/2026</Text>
                </View>
              </View>

              {/* Row 2: Đối tượng */}
              <View style={[styles.infoBoardRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
                <View style={[styles.infoIconBg, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                  <User color="#10B981" size={16} />
                </View>
                <View style={styles.infoBoardCol}>
                  <Text style={[styles.infoLabel, { color: colors.subtext }]}>Đối tượng sử dụng</Text>
                  <Text style={[styles.infoVal, { color: colors.text }]}>
                    {activeItem.title.includes('Nhớt') ? 'Hội viên sở hữu Xe Côn Tay' : 'Tất cả Khách hàng thành viên App'}
                  </Text>
                </View>
              </View>

              {/* Row 3: Địa điểm */}
              <View style={[styles.infoBoardRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
                <View style={[styles.infoIconBg, { backgroundColor: 'rgba(245,158,11,0.1)' }]}>
                  <MapPin color="#F59E0B" size={16} />
                </View>
                <View style={styles.infoBoardCol}>
                  <Text style={[styles.infoLabel, { color: colors.subtext }]}>Địa điểm áp dụng</Text>
                  <Text style={[styles.infoVal, { color: colors.text }]}>Hệ thống Showroom & Xưởng sửa chữa AnhEmMotor Biên Hòa</Text>
                </View>
              </View>
            </View>

            {/* 2. MÔ TẢ LỢI ÍCH DÀNH CHO KHÁCH HÀNG */}
            <View style={styles.benefitsSection}>
              <View style={styles.benefitHeaderRow}>
                <Sparkles color={colors.primary} size={18} />
                <Text style={[styles.sectionHeading, { color: colors.text, marginLeft: 8, marginBottom: 0 }]}>Lợi ích của voucher khi sử dụng:</Text>
              </View>

              <View style={styles.benefitList}>
                {benefits.map((benefit, idx) => (
                  <View key={idx} style={styles.benefitItem}>
                    <View style={[styles.benefitCheckWrapper, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                      <Check color="#10B981" size={10} strokeWidth={3} />
                    </View>
                    <Text style={[styles.benefitText, { color: colors.text }]}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* HIỆU ỨNG ĐẶC SẮC: ĐƯỜNG RÃNH BẤM VÉ VẬT LÝ DẠNG TICKET (COUPON DIVIDER) */}
            <View style={styles.couponDividerContainer}>
              <View style={[styles.couponDividerLeftCircle, { backgroundColor: colors.background, borderColor: colors.border }]} />
              <View style={[styles.couponDividerDashLine, { borderColor: colors.border }]} />
              <View style={[styles.couponDividerRightCircle, { backgroundColor: colors.background, borderColor: colors.border }]} />
            </View>

            {/* 3. QR CODE & BARCODE SCANNER */}
            <View style={getStyles(theme).qrSection}>
              <Text style={[styles.sectionHeading, { color: colors.text, textAlign: 'center', marginBottom: 12 }]}>Mã QR thanh toán tại quầy</Text>
              <View style={[styles.qrContainer, { backgroundColor: '#FFFFFF' }]}>
                <QrCode color="#000" size={moderateScale(160)} />
              </View>
              <Text style={{ color: colors.subtext, fontSize: 11, marginTop: 10, textAlign: 'center' }}>Đưa mã này cho lễ tân của showroom AnhEmMotor trước khi thanh toán.</Text>
            </View>

            {/* 4. PROMO CODE COPY BOX */}
            {activeItem.code && ( // Use getStyles for codeBox
              <View style={[getStyles(theme).codeBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderColor: colors.border, borderStyle: 'dashed' }]}>
                <Text style={[getStyles(theme).codeLabel, { color: colors.subtext }]}>MÃ VOUCHER ĐỂ SAO CHÉP</Text>
                <View style={getStyles(theme).codeRow}>
                  <Text style={[getStyles(theme).codeVal, { color: colors.primary }]}>{activeItem.code}</Text>
                  <TouchableOpacity onPress={copyToClipboard} style={styles.copyBtn}>
                    {copied ? <Check color={Theme.colors.success} size={18} /> : <Copy color={colors.subtext} size={18} />}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 5. TÌNH TRẠNG & ĐIỀU KHOẢN KHÁC */}
            <View style={[getStyles(theme).rulesSection, { borderTopColor: colors.border }]}>
              <Text style={[getStyles(theme).sectionHeading, { color: colors.text, fontSize: 13 }]}>Điều khoản bổ sung:</Text>
              <Text style={[getStyles(theme).ruleItem, { color: colors.subtext }]}>• Vui lòng xuất trình mã ưu đãi trước khi lập hóa đơn thanh toán.</Text>
              <Text style={[getStyles(theme).ruleItem, { color: colors.subtext }]}>• Voucher không có giá trị quy đổi thành tiền mặt hoặc thặng dư khác.</Text>
              <Text style={[getStyles(theme).ruleItem, { color: colors.subtext }]}>• Không áp dụng đồng thời với các chương trình khuyến mãi nội bộ khác.</Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    );
  };

  // Render Promo Details (Khám phá ưu đãi - HIỆU ỨNG CAO CẤP TƯƠNG TÁC)
  const renderPromoDetail = () => {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}> {/* This is fine */}
        {activeItem.image && (
          <View style={getStyles(theme).heroContainer}>
            <Image source={{ uri: activeItem.image }} style={getStyles(theme).heroImage} />
            <TouchableOpacity style={[getStyles(theme).floatingBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={getStyles(theme).floatingBadgeText}>{activeItem.category || 'ƯU ĐÃI'}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.detailsBody}>
          <Text style={[styles.detailTitle, { color: colors.text, fontSize: 22, lineHeight: 28, marginBottom: 15 }]}>{activeItem.title}</Text>

          {/* TẦNG ĐẶC SẮC 1: BỘ ĐẾM THỜI GIAN NGƯỢC THỜI GIAN THỰC */}
          <GlassCard style={[getStyles(theme).countdownCard, { borderColor: theme.colors.secondary + '33', backgroundColor: theme.colors.card }]} intensity={15}>
            <View style={getStyles(theme).countdownTitleRow}>
              <Clock color={theme.colors.secondary} size={16} />
              <Text style={[getStyles(theme).countdownHeadingText, { color: theme.colors.secondary }]}>Hết hạn trong:</Text>
            </View>
            <View style={getStyles(theme).timerRow}>
              <View style={[getStyles(theme).timeBox, { backgroundColor: isDark ? theme.colors.border + '33' : theme.colors.border + '1A' }]}>
                <Text style={[getStyles(theme).timeText, { color: colors.text }]}>{countdown.days}</Text>
                <Text style={[getStyles(theme).timeLabel, { color: colors.subtext }]}>Ngày</Text>
              </View>
              <Text style={[getStyles(theme).timeDivider, { color: colors.text }]}>:</Text>
              <View style={[getStyles(theme).timeBox, { backgroundColor: isDark ? theme.colors.border + '33' : theme.colors.border + '1A' }]}>
                <Text style={[getStyles(theme).timeText, { color: colors.text }]}>{countdown.hours.toString().padStart(2, '0')}</Text>
                <Text style={[getStyles(theme).timeLabel, { color: colors.subtext }]}>Giờ</Text>
              </View>
              <Text style={[getStyles(theme).timeDivider, { color: colors.text }]}>:</Text>
              <View style={[getStyles(theme).timeBox, { backgroundColor: isDark ? theme.colors.border + '33' : theme.colors.border + '1A' }]}>
                <Text style={[getStyles(theme).timeText, { color: colors.text }]}>{countdown.minutes.toString().padStart(2, '0')}</Text>
                <Text style={[getStyles(theme).timeLabel, { color: colors.subtext }]}>Phút</Text>
              </View>
              <Text style={[getStyles(theme).timeDivider, { color: colors.text }]}>:</Text>
              <View style={[getStyles(theme).timeBox, { backgroundColor: isDark ? theme.colors.border + '33' : theme.colors.border + '1A' }]}>
                <Text style={[getStyles(theme).timeText, { color: theme.colors.secondary }]}>{countdown.seconds.toString().padStart(2, '0')}</Text>
                <Text style={[getStyles(theme).timeLabel, { color: colors.subtext }]}>Giây</Text>
              </View>
            </View>
          </GlassCard>

          {/* TẦNG ĐẶC SẮC 2: THANH TIẾN TRÌNH GIỚI HẠN LƯỢT ĐĂNG KÝ */}
          <View style={styles.limitContainer}>
            <View style={styles.limitTextRow}>
              <Text style={[styles.limitLabel, { color: colors.text }]}>Lượt đăng ký ưu đãi còn lại:</Text>
              <Text style={[styles.limitCount, { color: colors.primary }]}>14/100</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]}>
              <View style={[styles.progressBarFill, { width: '86%', backgroundColor: colors.primary }]} />
            </View>
            <Text style={{ color: colors.subtext, fontSize: 11, marginTop: 5 }}>Ưu đãi áp dụng giới hạn, vui lòng đăng ký sớm!</Text>
          </View>

          {/* Nội dung chương trình */}
          <GlassCard style={styles.promoDescCard}>
            <Text style={[styles.bodyText, { color: colors.text, fontSize: 15, lineHeight: 24 }]}>
              Chương trình khuyến mãi đặc biệt dành riêng cho các hội viên của AnhEmMotor. Cơ hội nâng cấp, bảo trì xe máy của bạn với mức phí ưu đãi cực tốt cùng quà tặng đi kèm có giá trị.
            </Text>
            <Text style={[styles.bodyText, { color: colors.text, fontSize: 15, lineHeight: 24, marginTop: 15 }]}>
              • Giảm ngay giá trị trực tiếp trên hóa đơn sửa chữa.{"\n"}
              • Tặng kèm gói phủ bóng Nano bảo vệ bề mặt sơn chống xước dăm.{"\n"}
              • Rửa xe bọt tuyết làm sạch toàn diện miễn phí sau khi hoàn thành.
            </Text>
          </GlassCard>

          {/* TẦNG ĐẶC SẮC 3: QUY TRÌNH 3 BƯỚC NHẬN QUÀ DỄ HIỂU */}
          <Text style={[getStyles(theme).sectionTitleDetail, { color: colors.text, marginTop: 25, marginBottom: 15 }]}>Quy trình nhận ưu đãi:</Text>
          <View style={getStyles(theme).stepsContainer}>
            <View style={getStyles(theme).stepItem}>
              <View style={[getStyles(theme).stepIconCircle, { backgroundColor: theme.colors.primary }]}>
                <Gift color="#fff" size={16} />
              </View>
              <View style={getStyles(theme).stepTextContent}>
                <Text style={[getStyles(theme).stepTitleText, { color: colors.text }]}>Bước 1: Nhận mã ưu đãi</Text>
                <Text style={[getStyles(theme).stepDescText, { color: colors.subtext }]}>Nhấp vào nút "Nhận ưu đãi ngay" ở chân màn hình.</Text>
              </View>
            </View>
            <View style={[getStyles(theme).stepConnectorLine, { backgroundColor: colors.border }]} />

            <View style={getStyles(theme).stepItem}>
              <View style={[getStyles(theme).stepIconCircle, { backgroundColor: theme.colors.primary }]}>
                <Calendar color="#fff" size={16} />
              </View>
              <View style={getStyles(theme).stepTextContent}>
                <Text style={[getStyles(theme).stepTitleText, { color: colors.text }]}>Bước 2: Đặt lịch hẹn sửa chữa</Text>
                <Text style={[getStyles(theme).stepDescText, { color: colors.subtext }]}>Đặt lịch làm dịch vụ trước để tránh phải xếp hàng lâu.</Text>
              </View>
            </View>
            <View style={[getStyles(theme).stepConnectorLine, { backgroundColor: colors.border }]} />

            <View style={styles.stepItem}>
              <View style={[styles.stepIconCircle, { backgroundColor: colors.primary }]}>
                <MapPin color="#fff" size={16} />
              </View>
              <View style={styles.stepTextContent}>
                <Text style={[styles.stepTitleText, { color: colors.text }]}>Bước 3: Ghé Showroom làm dịch vụ</Text>
                <Text style={[styles.stepDescText, { color: colors.subtext }]}>Đưa mã ưu đãi cho lễ tân trước khi thanh toán.</Text>
              </View>
            </View>
          </View>

          <ScalePress
            style={[styles.actionBtn, { backgroundColor: colors.primary, marginTop: 30 }]}
            onPress={() => {
              Clipboard.setString("AEM_PROMO_50K");
              alert("Đăng ký ưu đãi thành công! Mã ưu đãi AEM_PROMO_50K đã được sao chép vào bộ nhớ đệm.");
            }}
          >
            <Text style={styles.actionBtnText}>Nhận ưu đãi ngay</Text>
            <ArrowRight color="#fff" size={18} style={{ marginLeft: 8 }} />
          </ScalePress>
        </View>
      </ScrollView>
    );
  };

  // Render News Details (Tin tức & Đời sống xe - HIỆU ỨNG TRANG BÁO HIỆN ĐẠI BẬC NHẤT)
  const renderNewsDetail = () => {
    return (
      <View style={{ flex: 1 }}> {/* This is fine */}
        {/* TẦNG ĐẶC SẮC 1: THANH ĐỌC TIẾN TRÌNH SCROLL PHÍA TRÊN CÙNG */}
        <View style={[getStyles(theme).progressIndicatorBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#E2E8F0' }]}>
          <View style={[getStyles(theme).progressIndicatorFill, { width: `${scrollProgress * 100}%`, backgroundColor: colors.primary }]} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          onScroll={(event) => {
            const { y } = event.nativeEvent.contentOffset;
            const height = event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height; // This is fine
            if (height > 0) {
              setScrollProgress(Math.min(Math.max(y / height, 0), 1));
            }
          }}
          scrollEventThrottle={16}
        > {/* This is fine */}
          {activeItem.image && (
            <View style={styles.heroContainer}>
              <Image source={{ uri: activeItem.image }} style={styles.heroImage} />
            </View>
          )}

          <View style={styles.detailsBody}>
            <View style={getStyles(theme).newsMeta}>
              <View style={[getStyles(theme).newsBadge, { backgroundColor: theme.colors.primary + '1A' }]}>
                <Text style={[getStyles(theme).newsBadgeText, { color: theme.colors.primary }]}>TIN TỨC XE</Text>
              </View>
              <Text style={[getStyles(theme).newsDate, { color: colors.subtext }]}>{activeItem.date || '17/05/2026'}</Text>
            </View>

            <Text style={[getStyles(theme).detailTitle, { color: colors.text, fontSize: 22, lineHeight: 30, marginBottom: 15 }]}>{activeItem.title}</Text>

            <View style={[getStyles(theme).authorCard, { borderBottomColor: colors.border, borderTopColor: colors.border }]}>
              <View style={[getStyles(theme).authorAvatar, { backgroundColor: theme.colors.border + '1A' }]}>
                <User color={theme.colors.subtext} size={18} />
              </View> {/* Use getStyles for authorAvatar */}
              <View>
                <Text style={[styles.authorName, { color: colors.text }]}>{activeItem.author || 'AnhEmMotor Editor'}</Text>
                <Text style={{ color: colors.subtext, fontSize: 11 }}>Biên tập viên đời sống xe • 5 phút đọc</Text>
              </View>
            </View>

            {/* TẦNG ĐẶC SẮC 2: HỘP TÓM TẮT THÔNG MINH BẰNG AI (AI SUMMARY BOX) */}
            <GlassCard style={[getStyles(theme).aiSummaryCard, { borderColor: theme.colors.info + '33', backgroundColor: theme.colors.card }]} intensity={15}>
              <View style={getStyles(theme).aiSummaryHeader}>
                <Sparkles color="#A855F7" size={18} />
                <Text style={[getStyles(theme).aiSummaryTitle, { color: theme.colors.info }]}>Tóm tắt nhanh bằng AI:</Text>
              </View>
              <View style={styles.aiSummaryBullets}>
                <Text style={[styles.aiBulletText, { color: colors.text }]}>💡 Bảo dưỡng định kỳ giúp tăng tuổi thọ động cơ thêm 35% và tiết kiệm 12% xăng tiêu thụ.</Text>
                <Text style={[styles.aiBulletText, { color: colors.text }]}>💡 Ba hạng mục bắt buộc kiểm tra mỗi 5.000 km bao gồm: dầu nhớt, bộ lọc gió động cơ, bugi đánh lửa.</Text>
                <Text style={[styles.aiBulletText, { color: colors.text }]}>💡 Lốp xe cần kiểm tra áp suất định kỳ mỗi tuần để ngăn ngừa nguy cơ mòn vẹt và nổ lốp đột ngột.</Text>
              </View>
            </GlassCard>

            {/* Body bài viết */}
            <Text style={[styles.bodyText, { color: colors.text, fontSize: 15, lineHeight: 26, marginTop: 20 }]}>
              {activeItem.desc || 'Đời sống xe và tin tức nóng hổi luôn được cập nhật liên tục hàng giờ. AnhEmMotor cam kết mang lại cho khách hàng những thông tin bổ ích nhất về bảo dưỡng xe, kỹ năng lái xe an toàn, luật giao thông đường bộ mới nhất.'}
            </Text>

            <Text style={[styles.bodyText, { color: colors.text, fontSize: 15, lineHeight: 26, marginTop: 15 }]}>
              Theo nghiên cứu mới nhất của Hiệp hội Motor Việt Nam, việc bảo dưỡng xe định kỳ giúp tăng tuổi thọ động cơ lên đến 35%, đồng thời giảm mức tiêu hao nhiên liệu khoảng 12% so với thông thường. Đây là lý do vì sao người sử dụng xe máy nên chú trọng mốc km thay dầu và vệ sinh lọc gió định kỳ để có trải nghiệm lái êm ái nhất.
            </Text>

            <Text style={[styles.bodyText, { color: colors.text, fontSize: 15, lineHeight: 26, marginTop: 15, fontStyle: 'italic', fontWeight: '500' }]}>
              "Chiếc xe chính là người bạn đường trung thành. Chăm chút kỹ càng cho khối động cơ sẽ mang lại sự an tâm tuyệt đối trên mọi nẻo đường hành trình của bạn."
            </Text>

            {/* TẦNG ĐẶC SẮC 3: BỘ PHẢN ỨNG THẢ TIM TƯƠNG TÁC (INTERACTIVE REACTIONS CHIPS) */}
            <View style={[getStyles(theme).reactionContainer, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
              <Text style={[getStyles(theme).reactionHeading, { color: colors.text }]}>Bài viết này có hữu ích không?</Text>
              <View style={getStyles(theme).reactionRow}>
                <TouchableOpacity
                  style={[
                    styles.reactionChip,
                    { backgroundColor: userReactions.likes ? 'rgba(59,130,246,0.15)' : (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9') },
                    userReactions.likes && { borderColor: colors.primary }
                  ]}
                  onPress={() => handleToggleReaction('likes')}
                >
                  <ThumbsUp color={userReactions.likes ? theme.colors.primary : colors.subtext} size={15} />
                  <Text style={[getStyles(theme).reactionCountText, { color: userReactions.likes ? theme.colors.primary : colors.text }]}>{reactions.likes}</Text>
                </TouchableOpacity> {/* Use getStyles for reactionChip, reactionCountText */}

                <TouchableOpacity
                  style={[
                    styles.reactionChip,
                    { backgroundColor: userReactions.hearts ? 'rgba(239,68,68,0.15)' : (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9') },
                    userReactions.hearts && { borderColor: '#EF4444' }
                  ]}
                  onPress={() => handleToggleReaction('hearts')}
                >
                  <Heart color={userReactions.hearts ? theme.colors.secondary : colors.subtext} size={15} />
                  <Text style={[getStyles(theme).reactionCountText, { color: userReactions.hearts ? theme.colors.secondary : colors.text }]}>{reactions.hearts}</Text>
                </TouchableOpacity> {/* Use getStyles for reactionChip, reactionCountText */}

                <TouchableOpacity
                  style={[
                    styles.reactionChip,
                    { backgroundColor: userReactions.bikes ? 'rgba(16,185,129,0.15)' : (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9') },
                    userReactions.bikes && { borderColor: '#10B981' }
                  ]}
                  onPress={() => handleToggleReaction('bikes')}
                >
                  <Bike color={userReactions.bikes ? theme.colors.success : colors.subtext} size={15} />
                  <Text style={[getStyles(theme).reactionCountText, { color: userReactions.bikes ? theme.colors.success : colors.text }]}>{reactions.bikes}</Text>
                </TouchableOpacity> {/* Use getStyles for reactionChip, reactionCountText */}

                <TouchableOpacity
                  style={[
                    styles.reactionChip,
                    { backgroundColor: userReactions.helpful ? 'rgba(168,85,247,0.15)' : (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9') },
                    userReactions.helpful && { borderColor: '#A855F7' }
                  ]}
                  onPress={() => handleToggleReaction('helpful')}
                >
                  <Sparkles color={userReactions.helpful ? theme.colors.info : colors.subtext} size={15} />
                  <Text style={[getStyles(theme).reactionCountText, { color: userReactions.helpful ? theme.colors.info : colors.text }]}>{reactions.helpful}</Text>
                </TouchableOpacity> {/* Use getStyles for reactionChip, reactionCountText */}
              </View>
            </View>

            {/* TẦNG ĐẶC SẮC 4: BÌNH LUẬN TRỰC TIẾP HÀNH ĐỘNG (COMMUNITY COMMENTS FEED) */}
            <View style={getStyles(theme).commentSection}>
              <Text style={[getStyles(theme).sectionTitleDetail, { color: colors.text, marginBottom: 15 }]}>Bình luận cộng đồng ({comments.length})</Text>

              {/* Ô Nhập bình luận */}
              <View style={[getStyles(theme).commentInputBox, { backgroundColor: isDark ? theme.colors.border + '33' : theme.colors.border + '1A', borderColor: colors.border }]}>
                <TextInput
                  style={[getStyles(theme).commentTextInput, { color: colors.text }]} // This is fine
                  placeholder="Gửi ý kiến đóng góp của bạn..."
                  placeholderTextColor={colors.subtext}
                  value={commentText}
                  onChangeText={setCommentText}
                />
                <TouchableOpacity onPress={handlePostComment} style={[styles.postCommentBtn, { backgroundColor: colors.primary }]}>
                  <ArrowRight color="#fff" size={16} />
                </TouchableOpacity>
              </View> {/* Use getStyles for postCommentBtn */}

              {/* Danh sách bình luận */}
              {comments.map((comment) => ( // Use getStyles for commentItem
                <View key={comment.id} style={[styles.commentItem, { borderBottomColor: colors.border }]}>
                  <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                  <View style={styles.commentTextCol}>
                    <View style={styles.commentMetaRow}>
                      <Text style={[styles.commentAuthorName, { color: colors.text }]}>{comment.author}</Text>
                      <Text style={{ color: colors.subtext, fontSize: 10 }}>{comment.time}</Text>
                    </View>
                    <Text style={[styles.commentBodyText, { color: colors.text }]}>{comment.text}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* TẦNG ĐẶC SẮC 5: CAROUSEL NGANG - BÀI VIẾT LIÊN QUAN */}
            <View style={[getStyles(theme).relatedSection, { borderTopColor: colors.border }]}>
              <Text style={[getStyles(theme).sectionTitleDetail, { color: colors.text, marginBottom: 15 }]}>Bài viết liên quan:</Text>
              <ScrollView
                horizontal // This is fine
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedCarousel}
              >
                {MOCK_RELATED_NEWS.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.relatedCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF', borderColor: colors.border }]}
                    onPress={() => { // This is fine
                      // Cập nhật lại tin đang xem
                      setActiveItem(item);
                      setActiveType('news');
                      // Reset reading progress
                      setScrollProgress(0);
                    }}
                  >
                    <Image source={{ uri: item.image }} style={getStyles(theme).relatedCardImg} />
                    <View style={styles.relatedCardInfo}>
                      <Text style={[styles.relatedCardTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
                      <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '600', marginTop: 4 }}>Đọc tiếp →</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[getStyles(theme).container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Dynamic Header - Use getStyles for header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backIconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {activeType === 'alert' && 'Chi tiết nhắc nhở'}
          {activeType === 'voucher' && 'Chi tiết Voucher'}
          {activeType === 'promo' && 'Chi tiết ưu đãi'}
          {activeType === 'news' && 'Chi tiết bài viết'}
        </Text>

        <View style={getStyles(theme).headerRight}>
          {activeType === 'news' && (
            <TouchableOpacity
              style={[styles.backIconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', marginRight: 10 }]}
              onPress={() => setIsSaved(!isSaved)}
            >
              <Bookmark color={isSaved ? colors.primary : colors.text} fill={isSaved ? colors.primary : 'transparent'} size={20} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[getStyles(theme).backIconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
            onPress={handleShare}
          >
            <Share2 color={colors.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dynamic Detail Body Renderer */}
      {activeType === 'alert' && renderAlertDetail()}
      {activeType === 'voucher' && renderVoucherDetail()}
      {activeType === 'promo' && renderPromoDetail()}
      {activeType === 'news' && renderNewsDetail()}

      {/* INTEGRATED INTERACTIVE BOOKING MODAL */}
      <Modal
        visible={bookingModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBookingModalVisible(false)}
      > {/* This is fine */}
        <View style={getStyles(theme).modalOverlay}>
          <TouchableOpacity style={getStyles(theme).modalBackdrop} activeOpacity={1} onPress={() => setBookingModalVisible(false)} />
          <View style={[getStyles(theme).modalSheet, { backgroundColor: isDark ? theme.colors.card : '#FFFFFF', borderColor: colors.border }]}>
            <View style={[getStyles(theme).modalHandle, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }]} />

            <View style={getStyles(theme).modalTitleRow}>
              <Text style={[getStyles(theme).modalTitle, { color: colors.text }]}>Đặt lịch bảo dưỡng 📅</Text>
              <TouchableOpacity style={[getStyles(theme).closeBtn, { backgroundColor: theme.colors.border + '33' }]} onPress={() => setBookingModalVisible(false)}>
                <Text style={[getStyles(theme).closeBtnText, { color: colors.subtext }]}>Đóng</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSub, { color: colors.subtext }]}>Honda SH 160i (60-A1 555.55)</Text>

            {/* Date selection list */}
            <Text style={[styles.bookingSectionTitle, { color: colors.text, marginTop: 5 }]}>1. Chọn ngày đến xưởng:</Text>
            <View style={getStyles(theme).bookingDateRow}>
              {[
                { date: '18/05/2026', label: 'T2', day: '18', desc: 'Mai' },
                { date: '19/05/2026', label: 'T3', day: '19', desc: 'Kia' }, // This is fine
                { date: '20/05/2026', label: 'T4', day: '20', desc: '20/05' },
                { date: '21/05/2026', label: 'T5', day: '21', desc: '21/05' },
              ].map(item => (
                <TouchableOpacity
                  key={item.date}
                  style={[
                    styles.bookingDateCard,
                    {
                      backgroundColor: isDark ? theme.colors.border + '33' : theme.colors.border + '1A',
                      borderColor: colors.border
                    }, // This is fine
                    selectedDate === item.date && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setSelectedDate(item.date)}
                >
                  <Text style={[styles.bookingDateDayLabel, { color: selectedDate === item.date ? '#fff' : colors.subtext }]}>{item.label}</Text>
                  <Text style={[styles.bookingDateDayNumber, { color: selectedDate === item.date ? '#fff' : colors.text }]}>{item.day}</Text>
                  <Text style={[styles.bookingDateDayDesc, { color: selectedDate === item.date ? '#fff' : colors.subtext }]}>{item.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Time selection list */}
            <Text style={[getStyles(theme).bookingSectionTitle, { color: colors.text }]}>2. Chọn khung giờ:</Text>
            <View style={getStyles(theme).bookingTimeGrid}>
              {['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'].map(time => (
                <TouchableOpacity // This is fine
                  key={time}
                  style={[
                    styles.bookingTimeCard,
                    {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                      borderColor: colors.border
                    },
                    selectedTime === time && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Clock size={12} color={selectedTime === time ? '#fff' : colors.subtext} style={{ marginRight: 6 }} />
                  <Text style={[styles.bookingTimeText, { color: selectedTime === time ? '#fff' : colors.subtext }]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[getStyles(theme).modalActionBtn, { marginTop: 25, backgroundColor: colors.primary }]}
              onPress={() => {
                setBookingModalVisible(false);
                Alert.alert(
                  'Đặt lịch thành công!',
                  `Lịch hẹn của bạn đã được xác nhận vào lúc ${selectedTime} ngày ${selectedDate} tại Cửa hàng AnhEmMotor. KTV trưởng sẽ sẵn sàng tiếp đón xe của bạn!`
                );
              }}
            >
              <CalendarClock color="#fff" size={20} /> {/* This is fine */}
              <Text style={styles.modalActionText}>Xác nhận & Đặt chỗ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.md },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 15,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
  },
  contentCard: {
    borderRadius: Theme.radius.lg,
    padding: moderateScale(20),
  },
  // Alert styles
  alertHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  alertBody: {
    paddingVertical: 5,
  },
  bodyText: {
    fontSize: moderateScale(14),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: moderateScale(12),
    marginLeft: 8,
  },
  actionBtn: {
    height: verticalScale(48),
    borderRadius: Theme.radius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },

  // Voucher styles
  voucherHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  voucherIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voucherSubtitle: {
    fontSize: moderateScale(12),
    marginTop: 4,
  },
  voucherBody: {
    paddingTop: 20,
  },
  qrSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  qrContainer: {
    padding: 15,
    borderRadius: 15,
    boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
  },
  codeBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  codeVal: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  copyBtn: {
    marginLeft: 15,
    padding: 6,
  },
  rulesSection: {
    borderTopWidth: 1,
    paddingTop: 20,
  },
  sectionHeading: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ruleItem: {
    fontSize: moderateScale(12),
    lineHeight: 18,
    marginBottom: 6,
  },

  // Promo & News common Hero styles
  heroContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingBadge: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  floatingBadgeText: {
    color: '#fff',
    fontSize: moderateScale(11),
    fontWeight: 'bold',
  },
  detailsBody: {
    padding: 20,
  },
  promoDescCard: {
    padding: 15,
    borderRadius: 12,
  },

  // News specific styles
  newsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  newsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 4,
    marginRight: 10,
  },
  newsDate: {
    fontSize: moderateScale(12),
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorName: {
    fontSize: moderateScale(13),
    fontWeight: 'bold',
  },

  /* ================== PREMIUM FEATURES STYLES ================== */

  // Progress Reading scroll indicator
  progressIndicatorBg: {
    width: '100%',
    height: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
  },
  progressIndicatorFill: {
    height: '100%',
  },

  // Promo Timer Styles
  countdownCard: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  countdownTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  countdownHeadingText: {
    fontSize: moderateScale(13),
    color: '#EF4444',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBox: {
    width: 50,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  timeLabel: {
    fontSize: moderateScale(9),
    marginTop: 2,
    fontWeight: '500',
  },
  timeDivider: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginHorizontal: 8,
  },

  // Limit indicators (Vouchers / Promos)
  limitContainer: {
    marginBottom: 20,
  },
  limitTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  limitLabel: {
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
  limitCount: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Step Indicators (Promotion Claim workflow)
  stepsContainer: {
    paddingLeft: 10,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTextContent: {
    marginLeft: 12,
    flex: 1,
  },
  stepTitleText: {
    fontSize: moderateScale(13),
    fontWeight: 'bold',
  },
  stepDescText: {
    fontSize: moderateScale(11),
    marginTop: 2,
  },
  stepConnectorLine: {
    width: 2,
    height: 16,
    marginLeft: 13,
    marginVertical: 4,
  },
  sectionTitleDetail: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },

  // AI Summary Styles
  aiSummaryCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(168,85,247,0.03)',
    marginVertical: 15,
  },
  aiSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiSummaryTitle: {
    color: '#A855F7',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    marginLeft: 8,
  },
  aiSummaryBullets: {
    paddingLeft: 4,
  },
  aiBulletText: {
    fontSize: moderateScale(12.5),
    lineHeight: 19,
    marginBottom: 8,
  },

  // Reaction Container
  reactionContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 15,
    marginVertical: 20,
  },
  reactionHeading: {
    fontSize: moderateScale(13),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  reactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  reactionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  reactionCountText: {
    fontSize: moderateScale(11),
    fontWeight: 'bold',
    marginLeft: 6,
  },

  // Comment Section Styles
  commentSection: {
    marginTop: 10,
  },
  commentInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 6,
    height: 48,
    marginBottom: 15,
  },
  commentTextInput: {
    flex: 1,
    fontSize: moderateScale(13),
    height: '100%',
  },
  postCommentBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  commentMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthorName: {
    fontSize: moderateScale(12.5),
    fontWeight: 'bold',
  },
  commentBodyText: {
    fontSize: moderateScale(13),
    lineHeight: 18,
  },

  // Related Section
  relatedSection: {
    borderTopWidth: 1,
    paddingTop: 20,
    marginTop: 25,
  },
  relatedCarousel: {
    paddingBottom: 5,
  },
  relatedCard: {
    width: 180,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 15,
  },
  relatedCardImg: {
    width: '100%',
    height: 100,
  },
  relatedCardInfo: {
    padding: 10,
  },
  relatedCardTitle: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    lineHeight: 16,
  },
  /* ================== EXTRA VOUCHER DETAILS STYLES ================== */
  voucherInfoBoard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 5,
    marginBottom: 20,
    marginTop: 5,
  },
  infoBoardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  infoIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoBoardCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    marginBottom: 2,
  },
  infoVal: {
    fontSize: moderateScale(12.5),
    fontWeight: 'bold',
  },
  benefitsSection: {
    marginBottom: 25,
  },
  benefitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitList: {
    paddingLeft: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  benefitCheckWrapper: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  benefitText: {
    fontSize: moderateScale(13),
    lineHeight: 18,
    flex: 1,
  },
  /* ================== DYNAMIC PHYSICAL COUPON TICKET DIVIDER ================== */
  couponDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
    position: 'relative',
    height: 20,
    justifyContent: 'center',
  },
  couponDividerLeftCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    left: -31, // exact half overlap with card padding
    borderWidth: 1,
  },
  couponDividerRightCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    right: -31, // exact half overlap with card padding
    borderWidth: 1,
  },
  couponDividerDashLine: {
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    height: 1,
  },
  /* ================== VOUCHER BANNER IMAGE STYLES ================== */
  voucherImageWrapper: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
  },
  voucherImageBanner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  voucherImageOverlayBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  voucherImageOverlayText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  /* ================== EXTRA ALERT DETAILS STYLES ================== */
  vehicleInfoBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  vehicleInfoTitle: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  vehicleInfoName: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
  },
  vehicleInfoPlate: {
    fontSize: moderateScale(12.5),
    marginTop: 2,
  },
  alertDivider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  alertRecommendations: {
    marginVertical: 5,
  },
  recommendationHeading: {
    fontSize: moderateScale(13),
    lineHeight: 19,
    marginBottom: 12,
    fontWeight: '500',
  },
  recommendationList: {
    paddingLeft: 2,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: moderateScale(13),
    lineHeight: 18,
    flex: 1,
  },
  alertActionContainer: {
    marginTop: 25,
    alignItems: 'center',
    width: '100%',
  },
  alertSecondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  alertSecondaryBtnText: {
    fontSize: moderateScale(13.5),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  // Modals Styling
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)' },
  modalSheet: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 40, borderWidth: 1, borderBottomWidth: 0 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modalTitle: { fontSize: moderateScale(22), fontWeight: 'bold' },
  modalSub: { fontSize: moderateScale(13), marginBottom: 25 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  modalActionBtn: { height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%' },
  modalActionText: { color: '#fff', fontSize: moderateScale(15), fontWeight: 'bold', marginLeft: 10 },

  // Booking Modal styling
  bookingSectionTitle: { fontSize: moderateScale(14), fontWeight: 'bold', marginTop: 18, marginBottom: 12 },
  bookingDateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  bookingDateCard: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginHorizontal: 3 },
  bookingDateCardActive: { backgroundColor: '#2E5BFF', borderColor: '#2E5BFF' },
  bookingDateDayLabel: { fontSize: moderateScale(11), fontWeight: 'bold' },
  bookingDateDayNumber: { fontSize: moderateScale(18), fontWeight: '900', marginVertical: 3 },
  bookingDateDayDesc: { fontSize: moderateScale(10) },

  bookingTimeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  bookingTimeCard: { width: '31%', borderWidth: 1, borderRadius: 10, paddingVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  bookingTimeCardActive: { backgroundColor: '#2E5BFF', borderColor: '#2E5BFF' },
  bookingTimeText: { fontSize: moderateScale(12), fontWeight: 'bold' },
});
