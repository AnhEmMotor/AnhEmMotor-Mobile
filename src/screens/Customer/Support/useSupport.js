import { useState, useRef, useCallback } from 'react';
import { Linking, Alert } from 'react-native';
import { ISSUE_TYPES, INITIAL_TICKETS, FAQ_CATEGORIES } from './constants';
import { contactApi } from '../../../api/contactApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDependency } from '../../../di/DependencyContext';
import { useEffect } from 'react';

export const useSupport = () => {
  // Trạng thái Form phản hồi
  const [selectedIssue, setSelectedIssue] = useState(ISSUE_TYPES[0]);
  const [feedbackText, setFeedbackText] = useState('');
  const [attachedImages, setAttachedImages] = useState([]);
  
  // Trạng thái tìm kiếm FAQ
  const [searchQuery, setSearchQuery] = useState('');
  
  // Trạng thái Accordion FAQ
  const [activeFaqId, _setActiveFaqId] = useState(null);

  // Danh sách phản hồi của tôi (Tickets)
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  
  // Quản lý Bottom Sheets
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isIssueSheetVisible, setIsIssueSheetVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const issueSheetRef = useRef(null);
  const ticketDetailSheetRef = useRef(null);
  const faqDetailSheetRef = useRef(null);

  const { getProfileUseCase } = useDependency();

  // Load tickets from AsyncStorage on mount
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const stored = await AsyncStorage.getItem('anhem-mobile-support-tickets');
        if (stored) {
          const parsedTickets = JSON.parse(stored);
          setTickets(parsedTickets);
          
          // Optionally, we could fetch tracking for all of them here to update status
          // But to keep it simple, we'll just show them as stored and update when clicked
        } else {
          setTickets([]);
        }
      } catch (e) {
        console.warn('Failed to load tickets', e);
      }
    };
    loadTickets();
  }, []);

  const saveTickets = async (newTickets) => {
    setTickets(newTickets);
    try {
      await AsyncStorage.setItem('anhem-mobile-support-tickets', JSON.stringify(newTickets));
    } catch (e) {
      console.warn('Failed to save tickets', e);
    }
  };

  // Mở/Đóng Bottom Sheet chọn loại vấn đề
  const handleOpenIssueSheet = useCallback(() => {
    setIsIssueSheetVisible(true);
    setTimeout(() => {
      issueSheetRef.current?.show();
    }, 50);
  }, []);

  const handleSelectIssue = useCallback((issue) => {
    setSelectedIssue(issue);
    issueSheetRef.current?.hide();
    setTimeout(() => {
      setIsIssueSheetVisible(false);
    }, 300);
  }, []);

  const handleCloseIssueSheet = useCallback(() => {
    setIsIssueSheetVisible(false);
  }, []);

  // Mở/Đóng Bottom Sheet chi tiết Ticket
  const handleOpenTicketDetail = useCallback(async (ticket) => {
    // Try to fetch latest tracking status
    try {
      const tracking = await contactApi.getSupportTracking(ticket.id, ticket.trackingToken);
      if (tracking) {
        // Update ticket with latest tracking data
        const updatedTicket = {
          ...ticket,
          status: tracking.status,
          statusLabel: tracking.statusLabel || (tracking.status === 'Resolved' ? '✓ Đã giải quyết' : '⏱️ Đang xử lý'),
          reply: tracking.replies && tracking.replies.length > 0 ? tracking.replies[0].message : ticket.reply
        };
        setSelectedTicket(updatedTicket);
      } else {
        setSelectedTicket(ticket);
      }
    } catch (e) {
      console.warn('Failed to fetch tracking', e);
      setSelectedTicket(ticket);
    }
    
    setTimeout(() => {
      ticketDetailSheetRef.current?.show();
    }, 50);
  }, []);

  const handleCloseTicketDetail = useCallback(() => {
    setSelectedTicket(null);
  }, []);

  // Chụp ảnh đính kèm giả lập
  const handleAttachImage = useCallback(() => {
    const fakeImages = [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=200',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=200'
    ];
    // Đính kèm ngẫu nhiên
    const randomImg = fakeImages[Math.floor(Math.random() * fakeImages.length)];
    if (attachedImages.length >= 3) {
      Alert.alert('Giới hạn ảnh', 'Bạn chỉ được đính kèm tối đa 3 hình ảnh minh chứng.');
      return;
    }
    setAttachedImages((prev) => [...prev, randomImg]);
  }, [attachedImages]);

  const handleRemoveImage = useCallback((indexToRemove) => {
    setAttachedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }, []);

  // Gửi phản hồi lên CRM
  const handleSubmitFeedback = useCallback(async () => {
    if (!feedbackText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      let userProfile = {};
      try {
        const profile = await getProfileUseCase.execute();
        if (profile) userProfile = profile;
      } catch (e) {
        // Ignore if user not logged in or profile fetch fails
      }

      const response = await contactApi.submitSupportRequest({
        fullName: userProfile.name || 'Khách hàng',
        phoneNumber: userProfile.phone || '',
        email: userProfile.email || 'guest@anhemmotor.vn',
        subject: `Yêu cầu hỗ trợ: ${selectedIssue}`,
        category: selectedIssue,
        content: feedbackText,
      });

      if (response && response.value && response.value.id) {
        const data = response.value;
        const newTicket = {
          id: data.id,
          trackingToken: data.trackingToken,
          issueType: selectedIssue,
          content: feedbackText,
          date: new Date().toLocaleDateString('vi-VN'),
          status: 'pending',
          statusLabel: '⏱️ Đang xử lý',
          reply: 'Hệ thống CRM của AnhEmMotor đã ghi nhận phản hồi của bạn. Một chuyên viên hỗ trợ đang được điều phối để xử lý yêu cầu của bạn.'
        };

        saveTickets([newTicket, ...tickets]);
        setFeedbackText('');
        setAttachedImages([]);
        
        Alert.alert(
          'Gửi thành công! 🎉',
          `Ý kiến của bạn đã được gửi trực tiếp đến hệ thống CRM. Mã theo dõi: ${data.id}`
        );
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error('Submit feedback error', error);
      Alert.alert('Lỗi', 'Không thể gửi phản hồi. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  }, [feedbackText, selectedIssue, tickets, isSubmitting, getProfileUseCase]);

  // Gọi Cố vấn trực tiếp qua số hotline
  const handleCallAdvisor = useCallback(async () => {
    const url = 'tel:0912345678';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Không hỗ trợ', 'Thiết bị không hỗ trợ cuộc gọi trực tiếp. Hotline: 0912 345 678');
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể thực hiện cuộc gọi.');
    }
  }, []);

  // Gửi Email hỗ trợ
  const handleEmailSupport = useCallback(async () => {
    const url = 'mailto:support@anhemmotor.vn';
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Lỗi', 'Không thể mở ứng dụng Email.');
    }
  }, []);

  // Chỉ đường Google Maps đến Showroom Biên Hòa
  const handleNavigateMaps = useCallback(async () => {
    // Showroom AnhEmMotor Biên Hòa: 10.9575, 106.8427
    const lat = 10.9575;
    const lng = 106.8427;
    const _label = 'Showroom AnhEmMotor Bien Hoa';
    
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Lỗi', 'Không thể khởi chạy Google Maps.');
    }
  }, []);

  // Mở/Đóng Bottom Sheet chi tiết FAQ (trượt từ dưới lên theo quy tắc vàng)
  const handleCloseFaqDetail = useCallback(() => {
    setSelectedFaq(null);
  }, []);

  // Bấm vào FAQ sẽ mở Bottom Sheet trượt từ dưới lên
  const handleToggleFaq = useCallback((id) => {
    for (const category of FAQ_CATEGORIES) {
      const found = category.items.find(item => item.id === id);
      if (found) {
        setSelectedFaq(found);
        setTimeout(() => {
          faqDetailSheetRef.current?.show();
        }, 50);
        break;
      }
    }
  }, []);

  // Khách hàng Duyệt đóng ca trong tương tác 2 chiều
  const handleApproveCloseTicket = useCallback(async (ticketId) => {
    const ticketToClose = tickets.find(t => t.id === ticketId);
    if (!ticketToClose) return;

    try {
      // Opt-in: send rating to backend
      await contactApi.rateSupportEmployee(ticketId, ticketToClose.trackingToken, 5, 'Đã đóng yêu cầu');
      
      const newTickets = tickets.map(t => {
        if (t.id === ticketId) {
          return { ...t, status: 'resolved', statusLabel: '✓ Đã giải quyết' };
        }
        return t;
      });
      saveTickets(newTickets);
      ticketDetailSheetRef.current?.hide();
      setTimeout(() => {
        setSelectedTicket(null);
        Alert.alert('Thành công 🎉', 'Bạn đã duyệt đóng ca hỗ trợ này. Cảm ơn ý kiến của bạn!');
      }, 300);
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể đóng yêu cầu lúc này.');
    }
  }, [tickets]);

  return {
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
    isSubmitting,
    
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
  };
};
