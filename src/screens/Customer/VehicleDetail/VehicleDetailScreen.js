import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { requestConsultationApi } from '../../../api/customerApi';
import { useActiveColors } from '../../../theme/Theme';
import {
  ChevronLeft,
  RotateCcw,
  Ticket,
  Zap,
  ShieldCheck,
  Key,
  Droplet,
  Star,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import ScalePress from '../../../components/ScalePress';
import Toast from '../../../components/Toast';
import { useCart } from '../../../context/CartContext';
import { styles } from './styles';
import { useVehicleDetail } from './useVehicleDetail';

export default function VehicleDetailScreen({ navigation, route }) {
  const { motor } = route.params || {};
  const logic = useVehicleDetail(motor);
  const activeColors = useActiveColors();
  const [submittingConsultation, setSubmittingConsultation] = useState(false);
  const { addToCart } = useCart();
  const toastRef = useRef(null);

  const isMotorcycle = motor?.categoryId === 8 || motor?.categoryName === 'Xe máy';

  const handleRequestConsultation = async () => {
    if (!motor?.id) {
      Alert.alert('Thông báo', 'Vui lòng chọn sản phẩm hợp lệ để gửi yêu cầu tư vấn.');
      return;
    }
    try {
      setSubmittingConsultation(true);
      await requestConsultationApi(
        motor.id,
        `Khách hàng quan tâm sản phẩm ${motor?.name || ''}`,
        'Trong giờ hành chính'
      );
      Alert.alert(
        'Thành công',
        'Yêu cầu tư vấn của bạn đã được gửi. Nhân viên sẽ liên hệ lại trong thời gian sớm nhất!'
      );
    } catch (err) {
      Alert.alert('Thất bại', err.message || 'Không thể gửi yêu cầu tư vấn. Vui lòng thử lại.');
    } finally {
      setSubmittingConsultation(false);
    }
  };

  const renderOverview = () => (
    <Animated.View entering={FadeInDown.duration(600)}>
      {}
      <View style={styles.statusBadge}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>Còn hàng tại Biên Hòa (Giao ngay)</Text>
      </View>

      {}
      <View style={styles.rewardCard}>
        <Ticket color={activeColors.primary} size={24} />
        <Text style={[styles.rewardText, { color: activeColors.text }]}>
          Bạn có{' '}
          <Text style={[styles.rewardHighlight, { color: activeColors.primary }]}>
            1 Voucher giảm 2.000.000đ
          </Text>{' '}
          đổi xe mới (Hạn dùng: 3 ngày)
        </Text>
      </View>

      {}
      {isMotorcycle && (
        <>
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Tính năng nổi bật</Text>
          <View style={styles.featureGrid}>
            {logic.motor?.technologies?.length > 0
              ? logic.motor.technologies.slice(0, 4).map((tech, i) => (
                  <View
                    key={i}
                    style={[
                      styles.featureCard,
                      { backgroundColor: activeColors.card, borderColor: activeColors.border },
                    ]}
                  >
                    <View style={styles.featureIcon}>
                      <ShieldCheck color={activeColors.primary} size={20} />
                    </View>
                    <Text
                      style={[styles.featureTitle, { color: activeColors.text }]}
                      numberOfLines={1}
                    >
                      {tech.title || 'Công nghệ'}
                    </Text>
                    <Text
                      style={[styles.featureDesc, { color: activeColors.subtext }]}
                      numberOfLines={2}
                    >
                      {tech.description || 'Đang cập nhật'}
                    </Text>
                  </View>
                ))
              : [
                  {
                    icon: <ShieldCheck color={activeColors.primary} size={20} />,
                    title: 'Phanh an toàn',
                    desc: 'Đảm bảo an toàn tối đa.',
                  },
                  {
                    icon: <Key color={activeColors.warning} size={20} />,
                    title: 'Smartkey',
                    desc: 'Chống trộm thông minh.',
                  },
                  {
                    icon: <Droplet color="#E31B23" size={20} />,
                    title: 'Tiết kiệm',
                    desc: 'Tiết kiệm xăng tối đa.',
                  },
                  {
                    icon: <Zap color="#A855F7" size={20} />,
                    title: 'Động cơ mạnh',
                    desc: 'Vận hành êm ái.',
                  },
                ].map((f, i) => (
                  <View
                    key={i}
                    style={[
                      styles.featureCard,
                      { backgroundColor: activeColors.card, borderColor: activeColors.border },
                    ]}
                  >
                    <View style={styles.featureIcon}>{f.icon}</View>
                    <Text style={[styles.featureTitle, { color: activeColors.text }]}>
                      {f.title}
                    </Text>
                    <Text style={[styles.featureDesc, { color: activeColors.subtext }]}>
                      {f.desc}
                    </Text>
                  </View>
                ))}
          </View>

          {}
          <TouchableOpacity
            style={[
              styles.financeTeaser,
              {
                backgroundColor: activeColors.isDark
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.02)',
              },
            ]}
            onPress={() => logic.setActiveTab('finance')}
          >
            <Text style={[styles.teaserTitle, { color: activeColors.text }]}>
              Gợi ý tài chính nhanh 💰
            </Text>
            <Text style={[styles.teaserDesc, { color: activeColors.subtext }]}>
              Sở hữu xe chỉ với 15.000.000đ trả trước - Hỗ trợ lãi suất ưu đãi từ 1.200.000đ/tháng.
            </Text>
            <Text style={[styles.teaserLink, { color: activeColors.primary }]}>
              Tính chi phí trả góp chi tiết ➔
            </Text>
          </TouchableOpacity>
          <View style={styles.specGroup}>
            <Text style={[styles.specGroupTitle, { color: activeColors.primary }]}>
              Khung sườn, Phuộc & An toàn
            </Text>
            <SpecRow
              label="Phanh trước"
              value={logic.motor?.frontBrake || 'Đang cập nhật'}
              activeColors={activeColors}
            />
            <SpecRow
              label="Phanh sau"
              value={logic.motor?.rearBrake || 'Đang cập nhật'}
              activeColors={activeColors}
            />
            <SpecRow
              label="Phuộc trước"
              value={logic.motor?.frontSuspension || 'Đang cập nhật'}
              activeColors={activeColors}
            />
            <SpecRow
              label="Phuộc sau"
              value={logic.motor?.rearSuspension || 'Đang cập nhật'}
              activeColors={activeColors}
            />
            <SpecRow
              label="Lốp trước"
              value={logic.motor?.frontTireSize || 'Đang cập nhật'}
              activeColors={activeColors}
            />
            <SpecRow
              label="Lốp sau"
              value={logic.motor?.rearTireSize || logic.motor?.tireSize || 'Đang cập nhật'}
              activeColors={activeColors}
            />
          </View>

          <View style={styles.specGroup}>
            <Text style={[styles.specGroupTitle, { color: activeColors.primary }]}>
              Tiện ích & Công nghệ
            </Text>
            <SpecRow
              label="Hệ thống đèn"
              value={logic.motor?.lightingSystem || 'Đang cập nhật'}
              activeColors={activeColors}
            />
            <SpecRow
              label="Mặt đồng hồ"
              value={logic.motor?.dashboardType || 'Đang cập nhật'}
              activeColors={activeColors}
            />
            <SpecRow
              label="Hệ thống khóa"
              value={logic.motor?.starterSystem || 'Đang cập nhật'}
              activeColors={activeColors}
            />
            <SpecRow
              label="Bảo hành"
              value={logic.motor?.warrantyPeriod || 'Đang cập nhật'}
              activeColors={activeColors}
            />
          </View>
        </>
      )}
    </Animated.View>
  );

  const renderSpecs = () => (
    <Animated.View entering={FadeInDown.duration(600)}>
      <View style={styles.specGroup}>
        <Text style={[styles.specGroupTitle, { color: activeColors.primary }]}>
          Động cơ & Vận hành
        </Text>
        <SpecRow
          label="Loại động cơ"
          value={logic.motor?.engineType || 'Đang cập nhật'}
          activeColors={activeColors}
        />
        <SpecRow
          label="Dung tích xy-lanh"
          value={logic.motor?.displacement ? `${logic.motor.displacement}cc` : 'Đang cập nhật'}
          activeColors={activeColors}
        />
        <SpecRow
          label="Công suất tối đa"
          value={logic.motor?.maxPower || 'Đang cập nhật'}
          activeColors={activeColors}
        />
        <SpecRow
          label="Mô-men xoắn cực đại"
          value={logic.motor?.maxTorque || 'Đang cập nhật'}
          activeColors={activeColors}
        />
        <SpecRow
          label="Mức tiêu thụ"
          value={logic.motor?.fuelConsumption || 'Đang cập nhật'}
          activeColors={activeColors}
        />
        <SpecRow
          label="Loại truyền động"
          value={logic.motor?.transmissionType || 'Đang cập nhật'}
          activeColors={activeColors}
        />
      </View>

      <View style={styles.specGroup}>
        <Text style={[styles.specGroupTitle, { color: activeColors.primary }]}>
          Kích thước & Trọng lượng
        </Text>
        <SpecRow
          label="Khối lượng"
          value={logic.motor?.weight ? `${logic.motor.weight}kg` : 'Đang cập nhật'}
          activeColors={activeColors}
        />
        <SpecRow
          label="Dài x Rộng x Cao"
          value={
            logic.motor?.length
              ? `${logic.motor.length} x ${logic.motor.width} x ${logic.motor.height} mm`
              : 'Đang cập nhật'
          }
          activeColors={activeColors}
        />
        <SpecRow
          label="Độ cao yên"
          value={logic.motor?.seatHeight ? `${logic.motor.seatHeight}mm` : 'Đang cập nhật'}
          activeColors={activeColors}
        />
        <SpecRow
          label="Khoảng sáng gầm"
          value={
            logic.motor?.groundClearance ? `${logic.motor.groundClearance}mm` : 'Đang cập nhật'
          }
          activeColors={activeColors}
        />
        <SpecRow
          label="Dung tích bình xăng"
          value={logic.motor?.fuelCapacity || 'Đang cập nhật'}
          activeColors={activeColors}
        />
      </View>
    </Animated.View>
  );

  const renderFinance = () => (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.calculator}>
      <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
        Tính toán tài chính 📊
      </Text>

      <View style={{ marginBottom: 25 }}>
        <Text style={[styles.calcLabel, { color: activeColors.subtext }]}>
          Trả trước:{' '}
          <Text style={[styles.calcValue, { color: activeColors.primary }]}>
            {logic.downPaymentPercent}% ({logic.financeResults.downPayment.toLocaleString()}đ)
          </Text>
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={20}
          maximumValue={70}
          step={10}
          value={logic.downPaymentPercent}
          onValueChange={logic.setDownPaymentPercent}
          minimumTrackTintColor={activeColors.primary}
          maximumTrackTintColor={activeColors.border}
          thumbTintColor="#fff"
        />
      </View>

      <View style={{ marginBottom: 25 }}>
        <Text style={[styles.calcLabel, { color: activeColors.subtext }]}>
          Kỳ hạn vay:{' '}
          <Text style={[styles.calcValue, { color: activeColors.primary }]}>
            {logic.loanTerm} tháng
          </Text>
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={6}
          maximumValue={24}
          step={6}
          value={logic.loanTerm}
          onValueChange={logic.setLoanTerm}
          minimumTrackTintColor={activeColors.primary}
          maximumTrackTintColor={activeColors.border}
          thumbTintColor="#fff"
        />
      </View>

      <View style={[styles.resultCard, { backgroundColor: activeColors.card }]}>
        <View style={styles.resultRow}>
          <Text style={[styles.resultLabel, { color: activeColors.subtext }]}>
            Góp mỗi tháng (Dự tính)
          </Text>
          <Text style={styles.monthlyPayment}>
            {logic.financeResults.monthlyPayment.toLocaleString()} đ/tháng
          </Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={[styles.resultLabel, { color: activeColors.subtext }]}>
            Khoản vay giải ngân
          </Text>
          <Text style={{ color: activeColors.text, fontWeight: 'bold', textAlign: 'right' }}>
            {logic.financeResults.loanAmount.toLocaleString()} đ
          </Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={[styles.resultLabel, { color: activeColors.subtext }]}>
            Chênh lệch tổng chi phí
          </Text>
          <Text
            style={{
              color: activeColors.warning,
              fontSize: 12,
              fontWeight: '600',
              textAlign: 'right',
            }}
          >
            + 12.500.000đ so với trả thẳng
          </Text>
        </View>
      </View>

      <Text style={[styles.specGroupTitle, { color: activeColors.primary }]}>
        Hồ sơ chuẩn bị (Checklist)
      </Text>
      <View
        style={[
          styles.checklist,
          {
            backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            borderLeftColor: activeColors.primary,
          },
        ]}
      >
        <Text style={[styles.checkItem, { color: activeColors.subtext }]}>
          • Khách hàng từ 18 tuổi trở lên.
        </Text>
        <Text style={[styles.checkItem, { color: activeColors.subtext }]}>
          • Chỉ cần CCCD gắn chíp.
        </Text>
        <Text style={[styles.checkItem, { color: activeColors.subtext }]}>
          • Duyệt hồ sơ 15-30 phút tại Showroom.
        </Text>
      </View>

      <Text style={[styles.specGroupTitle, { color: activeColors.primary, marginTop: 20 }]}>
        Đối tác liên kết
      </Text>
      <View style={styles.partners}>
        {}
        <Text style={{ color: activeColors.subtext }}>HD Saison • Home Credit • FE Credit</Text>
      </View>
    </Animated.View>
  );

  const renderReviews = () => (
    <Animated.View entering={FadeInDown.duration(600)}>
      <View style={styles.ratingSummary}>
        <Text style={[styles.avgScore, { color: activeColors.text }]}>4.9</Text>
        <View>
          <View style={{ flexDirection: 'row' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} color="#FFB800" fill="#FFB800" size={16} />
            ))}
          </View>
          <Text style={{ color: activeColors.subtext, fontSize: 12, marginTop: 4 }}>
            128 đánh giá xác thực
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, marginBottom: 20 }}
      >
        {['Tất cả (128)', 'Có ảnh (45)', '5 ★ (112)', 'Dịch vụ (18)'].map((f, i) => (
          <View
            key={i}
            style={[
              styles.filterTag,
              { backgroundColor: activeColors.card, borderColor: activeColors.border },
            ]}
          >
            <Text style={[styles.filterTagText, { color: activeColors.text }]}>{f}</Text>
          </View>
        ))}
      </ScrollView>

      {[1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.reviewItem,
            {
              backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            },
          ]}
        >
          <View style={styles.reviewHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.reviewerName, { color: activeColors.text }]}>
                Nguyễn Hoàng L.
              </Text>
              <View style={[styles.verifiedBadge, { marginLeft: 8 }]}>
                <Text style={styles.verifiedText}>✓ ĐÃ MUA XE</Text>
              </View>
            </View>
            <Text style={{ color: activeColors.subtext, fontSize: 10 }}>15/04/2026</Text>
          </View>
          <Text style={[styles.reviewContent, { color: activeColors.subtext }]}>
            Xe chạy rất đằm, nhân viên Biên Hòa hỗ trợ làm biển số cực nhanh, giao xe đúng hẹn. Rất
            hài lòng!
          </Text>

          <View
            style={[
              styles.showroomReply,
              { backgroundColor: activeColors.isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' },
            ]}
          >
            <Text style={[styles.replyTitle, { color: activeColors.primary }]}>
              AnhEmMotor phản hồi:
            </Text>
            <Text style={[styles.replyContent, { color: activeColors.subtext }]}>
              Cảm ơn anh L. đã tin tưởng lựa chọn cửa hàng, chúc anh có những trải nghiệm tuyệt
              vời...
            </Text>
          </View>
        </View>
      ))}
    </Animated.View>
  );

  const renderGallery = () => {
    const defaultGalleryImages = [
      motor?.img || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1000',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000',
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=1000',
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=1000',
      'https://images.unsplash.com/photo-1558981359-219d6364c9c8?q=80&w=1000',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1000',
    ];

    const frames = motor?.frames || [];
    const colors = motor?.colors?.map((c) => c.img).filter(Boolean) || [];
    const galleryImages = Array.from(
      new Set([...colors, ...frames, ...defaultGalleryImages])
    ).slice(0, 6);

    return (
      <Animated.View entering={FadeInDown.duration(600)} style={styles.galleryContainer}>
        <Text style={styles.sectionTitle}>Thư viện hình ảnh 📸</Text>
        <Text style={styles.teaserDesc}>
          Khám phá cận cảnh từng đường nét thiết kế thể thao, động cơ mạnh mẽ và các chi tiết tinh
          tế của dòng xe.
        </Text>

        <View style={styles.galleryGrid}>
          {galleryImages.map((imgUrl, idx) => (
            <View key={idx} style={[styles.galleryItem, idx === 0 && styles.galleryItemLarge]}>
              <Image source={{ uri: imgUrl }} style={styles.galleryImage} resizeMode="cover" />
              <View style={styles.galleryOverlay}>
                <Text style={styles.galleryTag}>
                  {idx === 0
                    ? 'Tổng quan góc 3/4'
                    : idx === 1
                      ? 'Mặt trước thể thao'
                      : idx === 2
                        ? 'Phanh đĩa & Mâm đúc'
                        : idx === 3
                          ? 'Cụm động cơ'
                          : idx === 4
                            ? 'Đèn LED cao cấp'
                            : 'Chi tiết ống xả'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <StatusBar barStyle={activeColors.isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View
          style={[styles.header, { backgroundColor: activeColors.isDark ? '#111111' : '#FFFFFF' }]}
        >
          <View
            style={styles.imageWrapper}
            onMoveShouldSetResponder={(evt) => {
              const { dx, dy } = evt.nativeEvent;
              return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
            }}
            onResponderGrant={logic.handleTouchStart}
            onResponderMove={logic.handleTouchMove}
          >
            <Animated.Image
              entering={FadeIn.duration(800)}
              source={
                typeof logic.currentImage === 'string'
                  ? { uri: logic.currentImage }
                  : logic.currentImage
              }
              style={styles.mainImage}
              resizeMode="contain"
            />
            {motor?.frames && (
              <View style={styles.rotationBadge}>
                <RotateCcw color="#fff" size={14} />
                <Text style={styles.rotationText}>Vuốt ngang để xoay 360°</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.backBtn,
              {
                backgroundColor: activeColors.isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
              },
            ]}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft color={activeColors.text} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: activeColors.text }]}>
                {motor?.name || 'Motorcycle'}
              </Text>
              <Text
                style={[styles.category, { color: activeColors.isDark ? '#CBD5E1' : '#475569' }]}
              >
                {motor?.brand || motor?.brandName || 'Yamaha'} • Phiên bản Thể thao
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: activeColors.primary }]}>
                {motor?.price || motor?.referencePrice || 'Liên hệ'}
              </Text>
              <Text style={[styles.msrp, { color: activeColors.subtext }]}>105.000.000đ</Text>
            </View>
          </View>

          {}
          <View style={styles.colorSection}>
            <View style={styles.colorGrid}>
              {motor?.colors?.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.colorCircle,
                    logic.selectedColor === c.id && styles.activeColorCircle,
                  ]}
                  onPress={() => logic.setSelectedColor(c.id)}
                >
                  <View style={[styles.colorInner, { backgroundColor: c.hex }]} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={styles.tabBarScroll}
            contentContainerStyle={[
              styles.tabBarContent,
              {
                backgroundColor: activeColors.isDark
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.03)',
              },
            ]}
          >
            {[
              { id: 'overview', label: 'Tổng quan' },
              { id: 'specs', label: 'Thông số', isMotorcycleOnly: true },
              { id: 'gallery', label: 'Thư viện' },
              { id: 'finance', label: 'Trả góp', isMotorcycleOnly: true },
              { id: 'reviews', label: 'Đánh giá' },
            ]
              .filter((t) => isMotorcycle || !t.isMotorcycleOnly)
              .map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    logic.activeTab === tab.id && [
                      styles.activeTab,
                      { backgroundColor: activeColors.card },
                    ],
                  ]}
                  onPress={() => logic.setActiveTab(tab.id)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: activeColors.subtext },
                      logic.activeTab === tab.id && [
                        styles.activeTabText,
                        { color: activeColors.primary },
                      ],
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>

          {}
          {logic.activeTab === 'overview' && renderOverview()}
          {logic.activeTab === 'specs' && renderSpecs()}
          {logic.activeTab === 'gallery' && renderGallery()}
          {logic.activeTab === 'finance' && renderFinance()}
          {logic.activeTab === 'reviews' && renderReviews()}

          <View style={{ height: 15 }} />
        </View>
      </ScrollView>

      {}
      <View
        style={[
          styles.stickyActions,
          { backgroundColor: activeColors.background, borderTopColor: activeColors.border },
        ]}
      >
        {isMotorcycle ? (
          <>
            <ScalePress
              style={[
                styles.secondaryBtn,
                {
                  backgroundColor: activeColors.isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.03)',
                },
              ]}
              onPress={() => navigation.navigate('Booking')}
            >
              <Text style={[styles.btnText, { color: activeColors.text }]}>Lái thử</Text>
            </ScalePress>
            <ScalePress
              style={styles.primaryBtn}
              onPress={handleRequestConsultation}
              disabled={submittingConsultation}
            >
              <LinearGradient colors={[activeColors.primary, '#1E3A8A']} style={styles.gradient}>
                {submittingConsultation ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.btnText}>Tư Vấn</Text>
                )}
              </LinearGradient>
            </ScalePress>
          </>
        ) : (
          <>
            <ScalePress
              style={[
                styles.secondaryBtn,
                {
                  backgroundColor: activeColors.isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.03)',
                },
              ]}
              onPress={() => {
                if (logic.loading) {
                  Alert.alert('Thông báo', 'Đang tải dữ liệu sản phẩm, vui lòng đợi...');
                  return;
                }
                const variantId = logic.motor?.variants?.[0]?.id || motor?.variants?.[0]?.id;
                if (!variantId) {
                  Alert.alert(
                    'Lỗi',
                    'Sản phẩm này chưa có phiên bản (variant) hợp lệ từ hệ thống!'
                  );
                  return;
                }
                addToCart({
                  id: motor?.id,
                  productId: motor?.id,
                  variantId: variantId,
                  colorId: logic.motor?.colors?.[0]?.id || motor?.colors?.[0]?.id || null,
                  name: motor?.name || motor?.productName,
                  price: motor?.price || motor?.referencePrice || 0,
                  image: motor?.img || motor?.imageUrl,
                });
                toastRef.current?.show(
                  `Đã thêm ${motor?.name || 'sản phẩm'} vào giỏ hàng`,
                  'success'
                );
              }}
            >
              <Text style={[styles.btnText, { color: activeColors.text }]}>Thêm vào giỏ</Text>
            </ScalePress>
            <ScalePress
              style={styles.primaryBtn}
              onPress={() => {
                if (logic.loading) {
                  Alert.alert('Thông báo', 'Đang tải dữ liệu sản phẩm, vui lòng đợi...');
                  return;
                }
                const variantId = logic.motor?.variants?.[0]?.id || motor?.variants?.[0]?.id;
                if (!variantId) {
                  Alert.alert(
                    'Lỗi',
                    'Sản phẩm này chưa có phiên bản (variant) hợp lệ từ hệ thống!'
                  );
                  return;
                }
                addToCart({
                  id: motor?.id,
                  productId: motor?.id,
                  variantId: variantId,
                  colorId: logic.motor?.colors?.[0]?.id || motor?.colors?.[0]?.id || null,
                  name: motor?.name || motor?.productName,
                  price: motor?.price || motor?.referencePrice || 0,
                  image: motor?.img || motor?.imageUrl,
                });
                navigation.navigate('Cart');
              }}
            >
              <LinearGradient colors={[activeColors.primary, '#1E3A8A']} style={styles.gradient}>
                <Text style={styles.btnText}>Mua ngay</Text>
              </LinearGradient>
            </ScalePress>
          </>
        )}
      </View>
      <Toast ref={toastRef} />
    </View>
  );
}

const SpecRow = ({ label, value, activeColors }) => (
  <View style={[styles.specRow, { borderBottomColor: activeColors.border }]}>
    <Text style={[styles.specLabel, { color: activeColors.subtext }]}>{label}</Text>
    <Text style={[styles.specValue, { color: activeColors.text }]}>{value}</Text>
  </View>
);
