import { useState, useMemo } from 'react';

const INITIAL_NOTIFICATIONS = [
  // TAB 1: Dịch vụ & Tiến độ (service)
  {
    id: 's1',
    category: 'service',
    type: 'delivery',
    title: 'Xe trung chuyển đang di chuyển 🚚',
    desc: 'Tin vui! Chiếc xe Honda SH 160i của bạn đang trên xe tải trung chuyển từ kho tổng về Showroom Biên Hòa. Dự kiến cập bến sau 30 phút.',
    time: '5 phút trước',
    isRead: false,
    actionLabel: 'Theo dõi hành trình trên Bản đồ ➔',
    deepLink: 'DeliveryMap',
  },
  {
    id: 's2',
    category: 'service',
    type: 'process',
    title: 'Tiến độ làm biển số 📝',
    desc: 'Hồ sơ của bạn đã chuyển sang bước [Làm biển số tại Biên Hòa]. Dự kiến bàn giao xe vào ngày 18/05/2026.',
    time: '20 phút trước',
    isRead: false,
    actionLabel: 'Xem chi tiết quy trình',
    deepLink: 'ProcessDetail',
  },
  {
    id: 's3',
    category: 'service',
    type: 'maintenance',
    title: 'Nhắc nhở bảo dưỡng định kỳ 🛠️',
    desc: 'Xe SH 125i (60-A1 555.55) của bạn đã chạy thêm 2,000km kể từ lần bảo dưỡng trước. Đã đến lúc thay nhớt máy và kiểm tra tổng quát.',
    time: '1 giờ trước',
    isRead: false,
    actionLabel: 'Đặt lịch hẹn ngay',
    deepLink: 'Booking',
  },
  {
    id: 's4',
    category: 'service',
    type: 'workshop',
    title: 'Tiếp nhận bảo dưỡng tại xưởng ⚙️',
    desc: 'Kỹ thuật viên trưởng Nguyễn Văn A đã tiếp nhận xe 60-A1 555.55 và bắt đầu quy trình bảo dưỡng. Dự kiến hoàn thành vào lúc 15:30 hôm nay.',
    time: '2 giờ trước',
    isRead: true,
    actionLabel: 'Xem trực tuyến phụ tùng thay thế',
    deepLink: 'WorkshopStatus',
  },
  {
    id: 's5',
    category: 'service',
    type: 'cleancar',
    title: 'Chứng nhận Xe Sạch ✨',
    desc: 'Lịch sử bảo dưỡng ngày 16/05/2026 đã được xác thực bởi AEM. Chiếc xe của bạn đã được chứng nhận đạt chuẩn Xe Sạch.',
    time: '1 ngày trước',
    isRead: true,
    actionLabel: 'Xem nhật ký bảo dưỡng',
    deepLink: 'CleanCarLog',
  },

  // TAB 2: Đặc quyền & Ưu đãi (loyalty)
  {
    id: 'l1',
    category: 'loyalty',
    type: 'loyalty_level',
    title: 'Thăng hạng GOLD MEMBER 👑',
    desc: 'Chúc mừng Anh Khôi đã chính thức thăng hạng lên GOLD MEMBER sau kỳ bảo dưỡng vừa qua. Khám phá ngay các đặc quyền mới dành riêng cho bạn!',
    time: '1 ngày trước',
    isRead: false,
    actionLabel: 'Xem đặc quyền Gold',
    deepLink: 'LoyaltyHub',
  },
  {
    id: 'l2',
    category: 'loyalty',
    type: 'voucher_expiry',
    title: 'Voucher sắp hết hạn! 🎟️',
    desc: 'Voucher [Ưu đãi đặc quyền đổi xe SH - Giảm 2 Triệu] của bạn sẽ hết hạn trong 3 ngày nữa. Đừng bỏ lỡ!',
    time: '2 ngày trước',
    isRead: false,
    actionLabel: 'Sử dụng ngay',
    deepLink: 'VoucherWallet',
    voucherCode: 'SH-GOLD-2M',
    voucherName: 'Ưu đãi đổi xe SH - Giảm 2 Triệu',
  },
  {
    id: 'l3',
    category: 'loyalty',
    type: 'referral',
    title: 'Đồng hành giới thiệu xe, rước lộc lá! 🎁',
    desc: 'Gửi mã giới thiệu của bạn cho bạn bè mua xe tại AnhEmMotor để cả hai cùng nhận Voucher 500.000đ dịch vụ.',
    time: '3 ngày trước',
    isRead: true,
    actionLabel: 'Chia sẻ mã ngay',
    deepLink: 'ReferralShare',
    referralCode: 'AEM-KHOI-GOLD',
  },
  {
    id: 'l4',
    category: 'loyalty',
    type: 'birthday',
    title: 'Chúc mừng sinh nhật Anh Khôi! 🎉',
    desc: 'AnhEmMotor gửi tặng bạn Voucher thay nhớt hoàn toàn miễn phí trong tháng này.',
    time: '5 ngày trước',
    isRead: true,
    actionLabel: 'Nhận quà sinh nhật',
    deepLink: 'VoucherWallet',
    voucherCode: 'BDAY-KHOI-OIL',
    voucherName: 'Miễn phí thay nhớt máy tháng sinh nhật',
  },

  // TAB 3: Hành chính & Hệ thống (system)
  {
    id: 'sys1',
    category: 'system',
    type: 'recall',
    title: '⚠️ Thông báo triệu hồi từ Honda',
    desc: 'Thông báo từ Honda Việt Nam: Triệu hồi và cập nhật miễn phí cụm khóa Smartkey cho các dòng xe SH sản xuất trong giai đoạn đầu năm 2025 để nâng cấp bảo mật. Hãy đặt lịch hẹn sớm nhất tại đại lý gần nhất.',
    time: '2 giờ trước',
    isRead: false,
    actionLabel: 'Đặt lịch kiểm tra ngay',
    deepLink: 'Booking',
  },
  {
    id: 'sys2',
    category: 'system',
    type: 'paperwork',
    title: 'Bảo hiểm sắp hết hạn! 🛡️',
    desc: 'Bảo hiểm dân sự bắt buộc của xe 60-A1 555.55 sẽ hết hạn vào ngày 20/05/2026. Hãy gia hạn để tránh bị phạt khi lưu thông.',
    time: '1 ngày trước',
    isRead: false,
    actionLabel: 'Gia hạn bảo hiểm trực tuyến',
    deepLink: 'InsuranceRenew',
  },
  {
    id: 'sys3',
    category: 'system',
    type: 'invoice',
    title: 'Hóa đơn điện tử e-Invoice sẵn sàng 🧾',
    desc: 'Giao dịch thành công! Hóa đơn điện tử (e-Invoice) cho đơn hàng mua xe #AEM-9982 của bạn đã được xuất thành công trên hệ thống của Tổng cục Thuế.',
    time: '3 ngày trước',
    isRead: true,
    actionLabel: 'Xem và Tải hóa đơn (PDF)',
    deepLink: 'eInvoice',
    invoiceNumber: '#AEM-9982',
    invoiceTotal: '105.000.000đ',
  },
  {
    id: 'sys4',
    category: 'feedback',
    type: 'feedback',
    title: 'Phản hồi ý kiến đóng góp 💬',
    desc: 'Ban quản lý showroom đã phản hồi về góp ý của bạn ngày 15/05. Nhấn để xem nội dung giải quyết.',
    time: '4 ngày trước',
    isRead: true,
    actionLabel: 'Xem nội dung giải quyết',
    deepLink: 'FeedbackReply',
    feedbackContent: 'Ban quản lý showroom AnhEmMotor Biên Hòa xin gửi lời cảm ơn và tiếp thu ý kiến đóng góp chân thành của bạn. Chúng tôi đã tiến hành làm việc trực tiếp với đội ngũ bảo vệ và dịch vụ khách hàng tại showroom để khắc phục thái độ phục vụ chưa chu đáo. AnhEmMotor cam kết không ngừng nâng cao chất lượng phục vụ nhằm mang đến trải nghiệm hài lòng nhất cho quý khách. Chúc bạn vạn dặm bình an!',
  },
  {
    id: 'fb2',
    category: 'feedback',
    type: 'feedback',
    title: 'Góp ý về khu vực rửa xe 🧼',
    desc: 'Cảm ơn bạn đã đóng góp ý kiến về dịch vụ rửa xe sạch tại chi nhánh Biên Hòa. Đại lý đã ghi nhận và cải tiến quy trình.',
    time: '1 tuần trước',
    isRead: true,
    actionLabel: 'Xem phản hồi & Tặng quà',
    deepLink: 'FeedbackReply',
    feedbackContent: 'Chào Anh Khôi, Ban showroom đã nhận được phản hồi của anh về việc thời gian chờ đợi tại khu vực rửa xe còn hơi lâu vào ngày cuối tuần. Chúng tôi đã tăng cường thêm 2 nhân viên tại bộ phận dịch vụ và gửi tặng anh mã voucher rửa xe hoàn toàn miễn phí áp dụng cho lần tiếp theo. Xin chân thành cảm ơn ý kiến đóng góp quý báu của anh!',
  },
  {
    id: 'sys5',
    category: 'system',
    type: 'security',
    title: 'Cảnh báo đăng nhập lạ 🔒',
    desc: 'Phát hiện thiết bị lạ đăng nhập tài khoản của bạn tại Biên Hòa lúc 08:30. Nếu không phải bạn, hãy đổi mật khẩu ngay.',
    time: '5 ngày trước',
    isRead: true,
    actionLabel: 'Đổi mật khẩu',
    deepLink: 'SecuritySettings',
  },
];

export const useNotification = (navigation) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('service'); // 'service', 'loyalty', 'system', 'feedback'
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Custom states for Tab 1 (notification.md)
  const [hasActiveWorkshop, setHasActiveWorkshop] = useState(true);
  const [workshopStep, setWorkshopStep] = useState(2); // 1: Khám xe, 2: Sửa chữa, 3: Kiểm tra cuối, 4: Rửa xe & Sẵn sàng
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('18/05/2026');
  const [selectedTime, setSelectedTime] = useState('08:00');

  const serviceHistory = [
    {
      id: 'h1',
      date: '16/05/2026',
      location: 'Showroom Biên Hòa',
      parts: 'Thay nhớt máy Motul Gold 10W40, Lọc gió Honda chính hãng, Vệ sinh kim phun & họng xăng',
      cost: '1.250.000đ',
      warranty: 'Bảo hành phụ tùng 6 tháng (Đến 16/11/2026)',
      isCleanCar: true,
    },
    {
      id: 'h2',
      date: '12/03/2026',
      location: 'Showroom Biên Hòa',
      parts: 'Thay má phanh trước Nissin cao cấp, căn chỉnh phanh đĩa trước sau & vệ sinh nồi xe ga',
      cost: '850.000đ',
      warranty: 'Bảo hành má phanh 3 tháng (Đến 12/06/2026)',
      isCleanCar: true,
    },
    {
      id: 'h3',
      date: '10/01/2026',
      location: 'Showroom Biên Hòa',
      parts: 'Thay thế nước làm mát Liqui Moly đỏ, kiểm tra toàn diện bình điện ắc quy & bảo dưỡng cổ phốt',
      cost: '350.000đ',
      warranty: 'Không áp dụng bảo hành phụ tùng',
      isCleanCar: true,
    }
  ];

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'deliveryMap', 'workshop', 'referral', 'voucher', 'invoice', 'feedback', 'process', 'cleancar', 'insurance', 'security'
  const [selectedNotif, setSelectedNotif] = useState(null);

  // Calculate unread counts
  const totalUnreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const tabUnreadCounts = useMemo(() => {
    return {
      service: notifications.filter(n => n.category === 'service' && !n.isRead).length,
      loyalty: notifications.filter(n => n.category === 'loyalty' && !n.isRead).length,
      system: notifications.filter(n => n.category === 'system' && !n.isRead).length,
      feedback: notifications.filter(n => n.category === 'feedback' && !n.isRead).length,
    };
  }, [notifications]);

  // Filtered notifications based on active tab and unreadOnly toggle
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (n.category !== activeTab) return false;
      if (unreadOnly && n.isRead) return false;
      return true;
    });
  }, [notifications, activeTab, unreadOnly]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Handle CTA action click
  const handleAction = (notif) => {
    markAsRead(notif.id);
    setSelectedNotif(notif);

    switch (notif.deepLink) {
      case 'DeliveryMap':
        setActiveModal('deliveryMap');
        break;
      case 'WorkshopStatus':
        setActiveModal('workshop');
        break;
      case 'ReferralShare':
        setActiveModal('referral');
        break;
      case 'VoucherWallet':
        setActiveModal('voucher');
        break;
      case 'eInvoice':
        setActiveModal('invoice');
        break;
      case 'FeedbackReply':
        setActiveModal('feedback');
        break;
      case 'Booking':
        setBookingModalVisible(true);
        break;
      case 'ProcessDetail':
        setActiveModal('process');
        break;
      case 'CleanCarLog':
        setActiveModal('cleancar');
        break;
      case 'InsuranceRenew':
        setActiveModal('insurance');
        break;
      case 'SecuritySettings':
        setActiveModal('security');
        break;
      default:
        break;
    }
  };

  return {
    notifications,
    activeTab,
    setActiveTab,
    unreadOnly,
    setUnreadOnly,
    filteredNotifications,
    totalUnreadCount,
    tabUnreadCounts,
    activeModal,
    setActiveModal,
    selectedNotif,
    markAllAsRead,
    markAsRead,
    handleAction,
    // New states and variables returned
    hasActiveWorkshop,
    setHasActiveWorkshop,
    workshopStep,
    setWorkshopStep,
    bookingModalVisible,
    setBookingModalVisible,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    serviceHistory,
  };
};
