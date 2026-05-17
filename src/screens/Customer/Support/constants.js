import { DollarSign, ShieldCheck, FileText } from 'lucide-react-native';

export const ISSUE_TYPES = [
  'Dịch vụ xưởng',
  'Giấy tờ / Biển số',
  'Thái độ phục vụ',
  'Khác'
];

export const INITIAL_TICKETS = [
  {
    id: 't1',
    issueType: 'Dịch vụ xưởng',
    content: 'Yêu cầu kiểm tra lại chén cổ xe SH bị kêu lọc cọc sau khi bảo dưỡng định kỳ ngày 12/05.',
    date: '15/05/2026',
    status: 'pending',
    statusLabel: '⏱️ Đang xử lý',
    reply: 'Kỹ thuật viên trưởng tại showroom Biên Hòa đã tiếp nhận ca này. Chúng tôi đã đặt sẵn bộ chén cổ mới chính hãng Honda Việt Nam và sẵn sàng thay thế miễn phí cho anh Khôi khi mang xe qua đại lý.'
  },
  {
    id: 't2',
    issueType: 'Giấy tờ / Biển số',
    content: 'Hỏi về thời gian nhận cà vẹt gốc của xe Kawasaki Z1000 mới bàn giao.',
    date: '10/05/2026',
    status: 'resolved',
    statusLabel: '✓ Đã giải quyết',
    reply: 'Showroom đã hoàn tất thủ tục đăng ký và nhận cà vẹt gốc từ Công an Biên Hòa. Đại lý đã đóng gói gửi chuyển phát nhanh an toàn Viettel Post đến địa chỉ nhà anh Khôi thành công vào lúc 14:00 ngày 12/05.'
  }
];

export const FAQ_CATEGORIES = [
  {
    id: 'faq_finance',
    title: 'Chính sách Trả góp',
    icon: DollarSign,
    iconColor: '#F59E0B', // Gold
    items: [
      {
        id: 'fin_q1',
        question: 'Thủ tục trả góp cần chuẩn bị những gì?',
        answer: 'Thủ tục vô cùng tối giản! Bạn chỉ cần mang theo CCCD gắn chíp chính chủ. Hệ thống của AnhEmMotor liên kết trực tiếp với ngân hàng giúp phê duyệt và lên hồ sơ trực tuyến siêu tốc chỉ trong 15-30 phút.'
      },
      {
        id: 'fin_q2',
        question: 'Lãi suất trả góp ưu đãi như thế nào?',
        answer: 'Chúng tôi hỗ trợ gói trả góp đặc quyền lãi suất cực hấp dẫn chỉ từ 0% hoặc dao động từ 0.79% - 1.39%/tháng tùy thuộc vào dòng xe ga cao cấp hay mô tô phân khối lớn liên kết cùng HD Saison, FE Credit.'
      }
    ]
  },
  {
    id: 'faq_warranty',
    title: 'Bảo hành & Bảo dưỡng',
    icon: ShieldCheck,
    iconColor: '#10B981', // Green
    items: [
      {
        id: 'war_q1',
        question: 'Chính sách bảo hành xe mới thế nào?',
        answer: 'Mọi xe máy chính hãng mua tại hệ thống AnhEmMotor đều được hưởng chế độ bảo hành vàng: 3 năm hoặc 30.000 km (tùy điều kiện nào đến trước), áp dụng bảo hành linh kiện kỹ thuật toàn diện.'
      },
      {
        id: 'war_q2',
        question: 'Gói đặc quyền "Xe Sạch" là gì?',
        answer: 'Đây là dịch vụ chăm sóc trọn đời độc quyền của đại lý. Xe của bạn sẽ được rửa sạch sâu bằng công nghệ bọt tuyết không chạm, phủ ceramic bảo vệ sơn bóng và được kết nối máy đọc mã lỗi thông minh OBD-II hoàn toàn miễn phí.'
      }
    ]
  },
  {
    id: 'faq_legal',
    title: 'Thủ tục Hành chính',
    icon: FileText,
    iconColor: '#3B82F6', // Blue
    items: [
      {
        id: 'leg_q1',
        question: 'Thời gian làm biển số tại Biên Hòa mất bao lâu?',
        answer: 'Đối với khu vực Biên Hòa, Đồng Nai, thời gian đăng ký và ra biển số chính thức cực kỳ nhanh chóng, thông thường chỉ dao động từ 2 đến 5 ngày làm việc kể từ lúc ký bàn giao xe thành công.'
      }
    ]
  }
];
