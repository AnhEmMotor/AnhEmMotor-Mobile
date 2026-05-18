import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme, useActiveColors } from '../../../theme/Theme';
import { useGlobalState } from '../../../context/GlobalState';
import { horizontalScale, verticalScale, moderateScale } from '../../../utils/responsive';
import {
  ChevronLeft,
  MessageSquare,
  PhoneCall,
  Plus,
  Trash2,
  Camera,
  ChevronDown,
  ChevronUp,
  Search,
  MapPin,
  Clock,
  Navigation,
  HelpCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  Settings
} from 'lucide-react-native';
import GlassCard from '../../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ScalePress from '../../../components/ScalePress';
import CustomBottomSheet from '../../../components/CustomBottomSheet';
import { useSupport } from './useSupport';
import { styles } from './styles';
import { ISSUE_TYPES, FAQ_CATEGORIES } from './constants';

export default function SupportScreen({ navigation }) {
  const activeColors = useActiveColors();
  const isDark = activeColors.isDark;
  const { themeMode } = useGlobalState();

  const {
    selectedIssue,
    feedbackText,
    setFeedbackText,
    attachedImages,
    searchQuery,
    setSearchQuery,
    activeFaqId,
    tickets,
    selectedTicket,
    selectedFaq,
    isIssueSheetVisible,

    issueSheetRef,
    ticketDetailSheetRef,
    faqDetailSheetRef,

    handleOpenIssueSheet,
    handleSelectIssue,
    handleCloseIssueSheet,
    handleOpenTicketDetail,
    handleCloseTicketDetail,
    handleCloseFaqDetail,
    handleAttachImage,
    handleRemoveImage,
    handleSubmitFeedback,
    handleCallAdvisor,
    handleEmailSupport,
    handleNavigateMaps,
    handleToggleFaq,
    handleApproveCloseTicket
  } = useSupport();

  // Lọc câu hỏi FAQ động theo tìm kiếm
  const filteredFaqCategories = FAQ_CATEGORIES.map(category => {
    const matchedItems = category.items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...category,
      items: matchedItems
    };
  }).filter(category => category.items.length > 0);

  const isFormValid = feedbackText.trim().length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      {/* HEADER */}
      <View style={[styles.header, { paddingHorizontal: 20, justifyContent: 'space-between', width: '100%' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 12, width: 44, height: 44, justifyContent: 'center', alignItems: 'center', marginRight: 15 }]}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft color={activeColors.text} size={moderateScale(24)} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: activeColors.text }]}>Hỗ trợ khách hàng</Text>
        </View>
        <TouchableOpacity
          style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 12 }}
          onPress={() => navigation.navigate('CustomerHome', { screen: 'Profile', params: { openSettings: true } })}
        >
          <Settings color={activeColors.text} size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >

        {/* TẦNG 1: SPOTLIGHT – TRỢ LÝ SỐ AI & KẾT NỐI CHUYÊN VIÊN */}
        <Animated.View entering={FadeInUp.duration(600).delay(100)}>
          <GlassCard style={styles.spotlightCard}>
            <Text style={[styles.greeting, { color: activeColors.subtext }]}>Xin chào, Anh Khôi 👋</Text>
            <Text style={[styles.spotlightTitle, { color: activeColors.text }]}>AnhEmMotor có thể giúp gì cho bạn hôm nay?</Text>

            <View style={styles.spotlightActions}>
              <ScalePress style={styles.primaryBtn} onPress={() => navigation.navigate('AIChat')}>
                <MessageSquare color="#fff" size={moderateScale(18)} />
                <Text style={styles.primaryBtnText}>Hỏi Trợ lý AI</Text>
              </ScalePress>

              <ScalePress
                style={[styles.secondaryBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)', borderColor: activeColors.border }]}
                onPress={() => navigation.navigate('ContactStaff')}
              >
                <User color={Theme.colors.primary} size={moderateScale(18)} />
                <Text style={[styles.secondaryBtnText, { color: activeColors.text }]}>Hỗ Trợ Viên</Text>
              </ScalePress>
            </View>
          </GlassCard>
        </Animated.View>

        {/* TẦNG 2: VẬN HÀNH – FORM GỬI PHẢN HỒI VĂN BẢN */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <Text style={[styles.sectionLabel, { color: activeColors.text }]}>Gửi ý kiến phản hồi 📣</Text>
          <GlassCard style={styles.formCard}>
            {/* Chọn Nhóm Vấn đề */}
            <Text style={[styles.dropdownLabel, { color: activeColors.subtext }]}>Nhóm vấn đề cần hỗ trợ</Text>
            <TouchableOpacity
              style={[styles.dropdownSelector, { backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : '#F8FAFC', borderColor: activeColors.border }]}
              onPress={handleOpenIssueSheet}
              activeOpacity={0.7}
            >
              <Text style={[styles.dropdownVal, { color: activeColors.text }]}>{selectedIssue}</Text>
              <ChevronDown color={activeColors.subtext} size={moderateScale(18)} />
            </TouchableOpacity>

            {/* Viết Nội dung */}
            <Text style={[styles.dropdownLabel, { color: activeColors.subtext }]}>Mô tả chi tiết yêu cầu</Text>
            <View style={[styles.textareaContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : '#F8FAFC', borderColor: activeColors.border }]}>
              <TextInput
                style={[styles.textarea, { color: activeColors.text }]}
                placeholder="Vui lòng nhập phản hồi, ý kiến đóng góp hoặc thắc mắc của bạn (tối đa 500 ký tự)..."
                placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.4)'}
                multiline
                maxLength={500}
                value={feedbackText}
                onChangeText={setFeedbackText}
              />
              <Text style={[styles.charCounter, { color: activeColors.subtext }]}>{feedbackText.length}/500</Text>
            </View>

            {/* Đính kèm hình ảnh và Gửi */}
            <View style={styles.formFooter}>
              <View style={styles.attachRow}>
                <TouchableOpacity
                  style={[styles.attachIconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC', borderWidth: 1, borderColor: activeColors.border }]}
                  onPress={handleAttachImage}
                  activeOpacity={0.7}
                >
                  <Camera color={Theme.colors.primary} size={moderateScale(20)} />
                </TouchableOpacity>

                {attachedImages.map((uri, idx) => (
                  <View key={idx} style={styles.attachPreview}>
                    <Image source={{ uri }} style={styles.attachImg} />
                    <TouchableOpacity
                      style={styles.attachRemove}
                      onPress={() => handleRemoveImage(idx)}
                    >
                      <Text style={styles.attachRemoveText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={isFormValid ? styles.submitBtn : [styles.submitBtnDisabled, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#E2E8F0', borderColor: activeColors.border }]}
                onPress={handleSubmitFeedback}
                disabled={!isFormValid}
                activeOpacity={0.8}
              >
                <Text style={isFormValid ? styles.submitBtnText : [styles.submitBtnTextDisabled, { color: isDark ? 'rgba(255, 255, 255, 0.25)' : '#94A3B8' }]}>Gửi phản hồi</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </Animated.View>

        {/* LỊCH SỬ YÊU CẦU - PHẢN HỒI CỦA TÔI */}
        {tickets.length > 0 && (
          <Animated.View entering={FadeInDown.duration(600).delay(250)}>
            <Text style={[styles.sectionLabel, { color: activeColors.text }]}>Phản hồi của tôi ({tickets.length})</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ticketScroll}
            >
              {tickets.map((ticket) => (
                <TouchableOpacity
                  key={ticket.id}
                  activeOpacity={0.9}
                  onPress={() => handleOpenTicketDetail(ticket)}
                >
                  <GlassCard style={styles.ticketCard}>
                    <View style={styles.ticketHeader}>
                      <Text style={styles.ticketType}>{ticket.issueType}</Text>
                      <Text style={[
                        styles.ticketStatus,
                        { color: ticket.status === 'resolved' ? Theme.colors.success : Theme.colors.warning }
                      ]}>
                        {ticket.statusLabel}
                      </Text>
                    </View>
                    <Text style={[styles.ticketContent, { color: activeColors.text }]} numberOfLines={2}>
                      {ticket.content}
                    </Text>
                    <View style={styles.ticketFooter}>
                      <Text style={[styles.ticketDate, { color: activeColors.subtext }]}>{ticket.date}</Text>
                      <Text style={styles.ticketCta}>Xem chi tiết</Text>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* TẦNG 3: TỰ PHỤC VỤ – TRUNG TÂM CÂU HỎI THƯỜNG GẶP (SMART FAQ) */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={{ marginTop: verticalScale(15) }}>
          <Text style={[styles.sectionLabel, { color: activeColors.text }]}>Câu hỏi thường gặp FAQ 🔍</Text>

          {/* Thanh tìm kiếm thông minh */}
          <View style={[styles.searchBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: activeColors.border }]}>
            <Search color={activeColors.subtext} size={moderateScale(18)} />
            <TextInput
              style={[styles.searchInput, { color: activeColors.text }]}
              placeholder="Tìm kiếm thủ tục trả góp, bảo hành, xe sạch..."
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Danh sách câu hỏi thả xuống */}
          {filteredFaqCategories.length > 0 ? (
            filteredFaqCategories.map((category) => (
              <View key={category.id} style={styles.faqCatBox}>
                <View style={styles.faqCatHeader}>
                  <category.icon color={category.iconColor} size={moderateScale(18)} />
                  <Text style={[styles.faqCatTitle, { color: activeColors.text }]}>{category.title}</Text>
                </View>

                {category.items.map((item) => {
                  return (
                    <View key={item.id} style={[styles.faqAccordion, { backgroundColor: activeColors.card, borderColor: activeColors.border, borderWidth: 1 }]}>
                      <TouchableOpacity
                        style={styles.faqHeader}
                        onPress={() => handleToggleFaq(item.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.faqQuestion, { color: activeColors.text }]}>{item.question}</Text>
                        <ChevronDown color={activeColors.subtext} size={moderateScale(16)} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ))
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <HelpCircle color={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} size={40} />
              <Text style={{ color: activeColors.subtext, fontSize: 13, marginTop: 10 }}>Không tìm thấy câu hỏi phù hợp</Text>
            </View>
          )}
        </Animated.View>

        {/* TẦNG 4: HỆ THỐNG – BẢN ĐỒ & THÔNG TIN CỬA HÀNG */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={{ marginTop: verticalScale(15) }}>
          <Text style={[styles.sectionLabel, { color: activeColors.text }]}>Cửa hàng kinh doanh xe máy 📍</Text>
          <GlassCard style={styles.systemCard}>
            <View style={styles.systemHeader}>
              <MapPin color={Theme.colors.primary} size={moderateScale(20)} />
              <Text style={[styles.systemTitle, { color: activeColors.text }]}>Showroom AnhEmMotor Biên Hòa</Text>
            </View>
            <Text style={[styles.systemAddress, { color: activeColors.text }]}>Số 28, Đường Đồng Khởi, Phường Tân Phong, Thành phố Biên Hòa, Tỉnh Đồng Nai</Text>

            <View style={[styles.systemHeader, { marginBottom: verticalScale(15), marginTop: verticalScale(5) }]}>
              <Clock color={activeColors.subtext} size={moderateScale(16)} />
              <Text style={[styles.systemHours, { color: activeColors.subtext }]}>Giờ mở cửa: 08:00 - 20:00 (Hằng ngày)</Text>
            </View>

            {/* Hotline & Email liên hệ */}
            <View style={[styles.systemContactContainer, { borderTopColor: activeColors.border }]}>
              <TouchableOpacity
                style={styles.systemContactItem}
                onPress={handleCallAdvisor}
                activeOpacity={0.7}
              >
                <Phone color="#10B981" size={moderateScale(16)} />
                <Text style={[styles.systemContactText, { color: activeColors.text }]}>Hotline: 0912 345 678</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.systemContactItem}
                onPress={handleEmailSupport}
                activeOpacity={0.7}
              >
                <Mail color="#3B82F6" size={moderateScale(16)} />
                <Text style={[styles.systemContactText, { color: activeColors.text }]}>support@anhemmotor.vn</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.mapBtn}
              onPress={handleNavigateMaps}
              activeOpacity={0.8}
            >
              <Navigation color="#fff" size={moderateScale(18)} />
              <Text style={styles.mapBtnText}>Chỉ đường qua Google Maps</Text>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        <View style={{ height: verticalScale(60) }} />
      </ScrollView>

      {/* BOTTOM SHEET: CHỌN PHÂN LOẠI PHẢN HỒI (TẦNG 2) */}
      {isIssueSheetVisible && (
        <CustomBottomSheet
          ref={issueSheetRef}
          title="Chọn nhóm vấn đề hỗ trợ"
          onClose={handleCloseIssueSheet}
          themeMode={themeMode}
        >
          <View style={styles.sheetContent}>
            {ISSUE_TYPES.map((issue) => {
              const isSelected = selectedIssue === issue;
              return (
                <TouchableOpacity
                  key={issue}
                  style={[styles.sheetOption, { borderBottomColor: activeColors.border }]}
                  onPress={() => handleSelectIssue(issue)}
                  activeOpacity={0.7}
                >
                  <Text style={[isSelected ? styles.sheetOptionSelectedText : styles.sheetOptionText, { color: activeColors.text }]}>
                    {issue}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </CustomBottomSheet>
      )}

      {/* BOTTOM SHEET: CHI TIẾT PHẢN HỒI & CRM REPLY (TẦNG 2) */}
      {selectedTicket && (
        <CustomBottomSheet
          ref={ticketDetailSheetRef}
          title="Chi tiết yêu cầu hỗ trợ"
          onClose={handleCloseTicketDetail}
          themeMode={themeMode}
        >
          <View style={styles.sheetContent}>
            <View style={styles.ticketDetailBox}>
              <View style={styles.ticketDetailMeta}>
                <Text style={{ color: Theme.colors.primary, fontSize: 13, fontWeight: 'bold' }}>
                  Yêu cầu: {selectedTicket.issueType}
                </Text>
                <Text style={{ color: activeColors.subtext, fontSize: 12 }}>
                  Ngày gửi: {selectedTicket.date}
                </Text>
              </View>

              <Text style={{ color: activeColors.subtext, fontSize: 12, marginBottom: 5 }}>Nội dung của bạn:</Text>
              <Text style={[styles.ticketDetailContent, { color: activeColors.text }]}>{selectedTicket.content}</Text>

              <View style={[styles.chatBox, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }]}>
                <Text style={styles.chatAuthor}>Phản hồi từ CRM Admin:</Text>
                <Text style={[styles.chatText, { color: activeColors.text }]}>{selectedTicket.reply}</Text>
              </View>

              {/* Nút tương tác 2 chiều */}
              <View style={styles.sheetActionRow}>
                <TouchableOpacity
                  style={styles.sheetCloseBtn}
                  onPress={() => handleApproveCloseTicket(selectedTicket.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sheetCloseBtnText}>✓ Duyệt đóng ca</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sheetDiscussBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)', borderColor: activeColors.border }]}
                  onPress={() => {
                    handleCloseTicketDetail();
                    navigation.navigate('ContactStaff');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.sheetDiscussBtnText, { color: activeColors.text }]}>💬 Thảo luận thêm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </CustomBottomSheet>
      )}

      {/* BOTTOM SHEET: CHI TIẾT CÂU HỎI THƯỜNG GẶP FAQ (TẦNG 3 - QUY TẮC VÀNG 1) */}
      {selectedFaq && (
        <CustomBottomSheet
          ref={faqDetailSheetRef}
          title="Chi tiết câu hỏi thường gặp"
          onClose={handleCloseFaqDetail}
          themeMode={themeMode}
        >
          <View style={styles.sheetContent}>
            <Text style={[styles.faqDetailQuestion, { color: activeColors.text }]}>❓ {selectedFaq.question}</Text>
            <View style={[styles.faqDetailAnswerBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: activeColors.border }]}>
              <Text style={[styles.faqDetailAnswer, { color: activeColors.text }]}>{selectedFaq.answer}</Text>
            </View>
          </View>
        </CustomBottomSheet>
      )}

    </SafeAreaView>
  );
}
