import { useState, useRef, useCallback } from 'react';
import { Linking, Alert } from 'react-native';
import { ISSUE_TYPES, INITIAL_TICKETS, FAQ_CATEGORIES } from './constants';

export const useSupport = () => {
  // Trạng thái Form phản hồi
  const [selectedIssue, setSelectedIssue] = useState(ISSUE_TYPES[0]);
  const [feedbackText, setFeedbackText] = useState('');
  const [attachedImages, setAttachedImages] = useState([]);
  
  // Trạng thái tìm kiếm FAQ
  const [searchQuery, setSearchQuery] = useState('');
  
  // Trạng thái Accordion FAQ
  const [activeFaqId, setActiveFaqId] = useState(null);

  // Danh sách phản hồi của tôi (Tickets)
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  
  // Quản lý Bottom Sheets
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isIssueSheetVisible, setIsIssueSheetVisible] = useState(false);
  
  const issueSheetRef = useRef(null);
  const ticketDetailSheetRef = useRef(null);
  const faqDetailSheetRef = useRef(null);

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
  const handleOpenTicketDetail = useCallback((ticket) => {
    setSelectedTicket(ticket);
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
  const handleSubmitFeedback = useCallback(() => {
    if (!feedbackText.trim()) return;

    const newTicket = {
      id: `t_${Date.now()}`,
      issueType: selectedIssue,
      content: feedbackText,
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'pending',
      statusLabel: '⏱️ Đang xử lý',
      reply: 'Hệ thống CRM của AnhEmMotor đã ghi nhận phản hồi của bạn. Một chuyên viên hỗ trợ tại chi nhánh Biên Hòa đang được điều phối để xử lý yêu cầu của bạn.'
    };

    setTickets((prev) => [newTicket, ...prev]);
    setFeedbackText('');
    setAttachedImages([]);
    
    Alert.alert(
      'Gửi thành công! 🎉',
      `Ý kiến về vấn đề "${selectedIssue}" của bạn đã được gửi trực tiếp đến hệ thống CRM chăm sóc khách hàng.`
    );
  }, [feedbackText, selectedIssue]);

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
    const label = 'Showroom AnhEmMotor Bien Hoa';
    
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
  const handleApproveCloseTicket = useCallback((ticketId) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: 'resolved', statusLabel: '✓ Đã giải quyết' };
      }
      return t;
    }));
    ticketDetailSheetRef.current?.hide();
    setTimeout(() => {
      setSelectedTicket(null);
      Alert.alert('Thành công 🎉', 'Bạn đã duyệt đóng ca hỗ trợ này. Cảm ơn ý kiến của bạn!');
    }, 300);
  }, []);

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
