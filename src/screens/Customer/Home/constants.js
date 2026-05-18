export const shortcuts = [
  { id: 1, title: 'Sổ bảo hành', screen: 'ServiceHistory' },
  { id: 2, title: 'Sản phẩm', screen: 'Catalog' },
  { id: 3, title: 'Nhật ký xăng', screen: 'FinancialHub' },
  { id: 4, title: 'Hỗ trợ', screen: 'Support' },
];

export const alerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Hết hạn bảo hiểm',
    message: 'Xe 60-A1 555.55 sắp hết hạn bảo hiểm vào ngày 20/05.',
    cta: 'Gia hạn bảo hiểm'
  },
  {
    id: 2,
    type: 'critical',
    title: 'Thay thế phụ tùng',
    message: 'Lọc gió xe SH 125i đã đến kỳ thay thế theo khuyến nghị.',
    cta: 'Đặt lịch sửa chữa'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Bảo dưỡng định kỳ',
    message: 'Xe của bạn đã đi được 5.000km kể từ lần bảo dưỡng trước.',
    cta: 'Xem chi tiết'
  },
  {
    id: 4,
    type: 'critical',
    title: 'Cảnh báo triệu hồi',
    message: 'Có thông báo triệu hồi kiểm tra bơm xăng cho dòng xe của bạn.',
    cta: 'Kiểm tra ngay'
  }
];

export const vouchers = [
  { id: 1, title: 'Giảm 20% Dầu Nhớt', desc: 'Áp dụng tại mọi Showroom', code: 'NHOT20' },
  { id: 2, title: 'Tặng Nón Bảo Hiểm', desc: 'Khi mua phụ kiện trên 1 triệu', code: 'NONBH' },
  { id: 3, title: 'Giảm 50% Rửa Xe', desc: 'Dành riêng cho khách hàng thân thiết', code: 'RUAXE50' },
  { id: 4, title: 'Voucher Phụ Kiện 200K', desc: 'Áp dụng cho hóa đơn từ 1.5 triệu', code: 'ACC200' }
];

export const promoItems = [
  { id: 1, title: 'Ưu đãi hè rực rỡ - Giảm 5tr', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070', category: 'Sự kiện' },
  { id: 2, title: 'Thay dầu miễn phí chủ nhật', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070', category: 'Dịch vụ' },
  { id: 3, title: 'Thu cũ đổi mới - Trợ giá 3tr', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070', category: 'Thu cũ' }
];

export const newsItems = [
  { 
    id: 1, 
    title: 'Khai trương showroom mới tại Quận 1', 
    desc: 'Không gian trải nghiệm đẳng cấp dành riêng cho cộng đồng yêu xe mô tô tại trung tâm Sài Gòn.',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070',
    author: 'AE Motor News', 
    date: '12/05/2024' 
  },
  { 
    id: 2, 
    title: 'Honda ra mắt phiên bản SH Mode 2024', 
    desc: 'Thiết kế tinh tế, bổ sung bảng màu mới đầy cuốn hút cùng động cơ eSP+ thế hệ mới nhất.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070',
    author: 'Tin thị trường', 
    date: '11/05/2024' 
  },
  { 
    id: 3, 
    title: 'Top 5 cung đường phượt đẹp nhất miền Nam', 
    desc: 'Cùng AE Motor khám phá những hành trình đầy cảm hứng cho những ngày cuối tuần.',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070',
    author: 'Blog Xe', 
    date: '10/05/2024' 
  }
];
