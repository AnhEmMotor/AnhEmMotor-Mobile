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
import { Theme } from '../../../theme/Theme';
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
  Mail
} from 'lucide-react-native';
import GlassCard from '../../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ScalePress from '../../../components/ScalePress';
import CustomBottomSheet from '../../../components/CustomBottomSheet';
import { useSupport } from './useSupport';
import { styles } from './styles';
import { ISSUE_TYPES, FAQ_CATEGORIES } from './constants';

export default function SupportScreen({ navigation }) {
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
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={[styles.header, { paddingHorizontal: 20 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#fff" size={moderateScale(28)} />
        </TouchableOpacity>
        <Text style={styles.title}>Hỗ trợ khách hàng</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        
        {/* TẦNG 1: SPOTLIGHT – TRỢ LÝ SỐ AI & KẾT NỐI CHUYÊN VIÊN */}
        <Animated.View entering={FadeInUp.duration(600).delay(100)}>
          <GlassCard style={styles.spotlightCard}>
            <Text style={styles.greeting}>Xin chào, Anh Khôi 👋</Text>
            <Text style={styles.spotlightTitle}>AnhEmMotor có thể giúp gì cho bạn hôm nay?</Text>
            
            <View style={styles.spotlightActions}>
              <ScalePress style={styles.primaryBtn} onPress={() => navigation.navigate('AIChat')}>
                <MessageSquare color="#fff" size={moderateScale(18)} />
                <Text style={styles.primaryBtnText}>Hỏi Trợ lý AI</Text>
              </ScalePress>
              
              <ScalePress style={styles.secondaryBtn} onPress={() => navigation.navigate('ContactStaff')}>
                <User color={Theme.colors.primary} size={moderateScale(18)} />
                <Text style={styles.secondaryBtnText}>Chat với Chuyên viên</Text>
              </ScalePress>
            </View>
          </GlassCard>
        </Animated.View>

        {/* TẦNG 2: VẬN HÀNH – FORM GỬI PHẢN HỒI VĂN BẢN */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <Text style={styles.sectionLabel}>Gửi ý kiến phản hồi 📣</Text>
          <GlassCard style={styles.formCard}>
            {/* Chọn Nhóm Vấn đề */}
            <Text style={styles.dropdownLabel}>Nhóm vấn đề cần hỗ trợ</Text>
            <TouchableOpacity 
              style={styles.dropdownSelector} 
              onPress={handleOpenIssueSheet}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownVal}>{selectedIssue}</Text>
              <ChevronDown color={Theme.colors.subtext} size={moderateScale(18)} />
            </TouchableOpacity>

            {/* Viết Nội dung */}
            <Text style={styles.dropdownLabel}>Mô tả chi tiết yêu cầu</Text>
            <View style={styles.textareaContainer}>
              <TextInput
                style={styles.textarea}
                placeholder="Vui lòng nhập phản hồi, ý kiến đóng góp hoặc thắc mắc của bạn (tối đa 500 ký tự)..."
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                multiline
                maxLength={500}
                value={feedbackText}
                onChangeText={setFeedbackText}
              />
              <Text style={styles.charCounter}>{feedbackText.length}/500</Text>
            </View>

            {/* Đính kèm hình ảnh và Gửi */}
            <View style={styles.formFooter}>
              <View style={styles.attachRow}>
                <TouchableOpacity 
                  style={styles.attachIconBtn} 
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
                style={isFormValid ? styles.submitBtn : styles.submitBtnDisabled}
                onPress={handleSubmitFeedback}
                disabled={!isFormValid}
                activeOpacity={0.8}
              >
                <Text style={isFormValid ? styles.submitBtnText : styles.submitBtnTextDisabled}>Gửi phản hồi</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </Animated.View>

        {/* LỊCH SỬ YÊU CẦU - PHẢN HỒI CỦA TÔI */}
        {tickets.length > 0 && (
          <Animated.View entering={FadeInDown.duration(600).delay(250)}>
            <Text style={styles.sectionLabel}>Phản hồi của tôi ({tickets.length})</Text>
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
                    <Text style={styles.ticketContent} numberOfLines={2}>
                      {ticket.content}
                    </Text>
                    <View style={styles.ticketFooter}>
                      <Text style={styles.ticketDate}>{ticket.date}</Text>
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
          <Text style={styles.sectionLabel}>Câu hỏi thường gặp FAQ 🔍</Text>
          
          {/* Thanh tìm kiếm thông minh */}
          <View style={styles.searchBox}>
            <Search color={Theme.colors.subtext} size={moderateScale(18)} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm thủ tục trả góp, bảo hành, xe sạch..."
              placeholderTextColor="rgba(255,255,255,0.35)"
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
                  <Text style={styles.faqCatTitle}>{category.title}</Text>
                </View>

                {category.items.map((item) => {
                  return (
                    <View key={item.id} style={[styles.faqAccordion, { backgroundColor: 'rgba(255,255,255,0.02)' }]}>
                      <TouchableOpacity 
                        style={styles.faqHeader}
                        onPress={() => handleToggleFaq(item.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.faqQuestion}>{item.question}</Text>
                        <ChevronDown color={Theme.colors.subtext} size={moderateScale(16)} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ))
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <HelpCircle color="rgba(255,255,255,0.2)" size={40} />
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 10 }}>Không tìm thấy câu hỏi phù hợp</Text>
            </View>
          )}
        </Animated.View>

        {/* TẦNG 4: HỆ THỐNG – BẢN ĐỒ & THÔNG TIN CỬA HÀNG */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={{ marginTop: verticalScale(15) }}>
          <Text style={styles.sectionLabel}>Đại lý phân phối xe máy 📍</Text>
          <GlassCard style={styles.systemCard}>
            <View style={styles.systemHeader}>
              <MapPin color={Theme.colors.primary} size={moderateScale(20)} />
              <Text style={styles.systemTitle}>Showroom AnhEmMotor Biên Hòa</Text>
            </View>
            <Text style={styles.systemAddress}>Số 28, Đường Đồng Khởi, Phường Tân Phong, Thành phố Biên Hòa, Tỉnh Đồng Nai</Text>
            
            <View style={[styles.systemHeader, { marginBottom: verticalScale(15), marginTop: verticalScale(5) }]}>
              <Clock color={Theme.colors.subtext} size={moderateScale(16)} />
              <Text style={styles.systemHours}>Giờ mở cửa: 08:00 - 20:00 (Hằng ngày)</Text>
            </View>

            {/* Hotline & Email liên hệ */}
            <View style={styles.systemContactContainer}>
              <TouchableOpacity 
                style={styles.systemContactItem} 
                onPress={handleCallAdvisor}
                activeOpacity={0.7}
              >
                <Phone color="#10B981" size={moderateScale(16)} />
                <Text style={styles.systemContactText}>Hotline: 0912 345 678</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.systemContactItem} 
                onPress={handleEmailSupport}
                activeOpacity={0.7}
              >
                <Mail color="#3B82F6" size={moderateScale(16)} />
                <Text style={styles.systemContactText}>support@anhemmotor.vn</Text>
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
        >
          <View style={styles.sheetContent}>
            {ISSUE_TYPES.map((issue) => {
              const isSelected = selectedIssue === issue;
              return (
                <TouchableOpacity
                  key={issue}
                  style={styles.sheetOption}
                  onPress={() => handleSelectIssue(issue)}
                  activeOpacity={0.7}
                >
                  <Text style={isSelected ? styles.sheetOptionSelectedText : styles.sheetOptionText}>
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
        >
          <View style={styles.sheetContent}>
            <View style={styles.ticketDetailBox}>
              <View style={styles.ticketDetailMeta}>
                <Text style={{ color: Theme.colors.primary, fontSize: 13, fontWeight: 'bold' }}>
                  Yêu cầu: {selectedTicket.issueType}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                  Ngày gửi: {selectedTicket.date}
                </Text>
              </View>
              
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 5 }}>Nội dung của bạn:</Text>
              <Text style={styles.ticketDetailContent}>{selectedTicket.content}</Text>
              
              <View style={styles.chatBox}>
                <Text style={styles.chatAuthor}>Phản hồi từ CRM Admin:</Text>
                <Text style={styles.chatText}>{selectedTicket.reply}</Text>
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
                  style={styles.sheetDiscussBtn}
                  onPress={() => {
                    handleCloseTicketDetail();
                    navigation.navigate('ContactStaff');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sheetDiscussBtnText}>💬 Thảo luận thêm</Text>
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
        >
          <View style={styles.sheetContent}>
            <Text style={styles.faqDetailQuestion}>❓ {selectedFaq.question}</Text>
            <View style={styles.faqDetailAnswerBox}>
              <Text style={styles.faqDetailAnswer}>{selectedFaq.answer}</Text>
            </View>
          </View>
        </CustomBottomSheet>
      )}

    </SafeAreaView>
  );
}
