export const MOCK_MOTORS = [
  { 
    id: '1', 
    name: 'Kawasaki Z1000', 
    category: 'Xe mới',
    price: '420.000.000đ', 
    brand: 'Kawasaki', 
    img: require('../../assets/motors/z1000_green.png'),
    colors: [
      { id: 'green', hex: '#10B981', label: 'Emerald Green', img: require('../../assets/motors/z1000_green.png') },
      { id: 'black', hex: '#1E293B', label: 'Matte Black', img: require('../../assets/motors/z1000_black.png') },
      { id: 'red', hex: '#EF4444', label: 'Passion Red', img: require('../../assets/motors/z1000_red.png') }
    ],
    gallery: [
      require('../../assets/motors/z1000_green.png'),
      require('../../assets/motors/z1000_black.png'),
      require('../../assets/motors/z1000_red.png')
    ],
    frames: [
      require('../../assets/motors/360/f1.png'),
      require('../../assets/motors/360/f2.png'),
      require('../../assets/motors/360/f3.png'),
      require('../../assets/motors/360/f4.png'),
      require('../../assets/motors/360/f3.png'), // reused for demo
      require('../../assets/motors/360/f2.png'), // reused for demo
    ],
    specs: [
      { label: 'Phân khối', value: '998cc' },
      { label: 'Công suất', value: '142 HP' },
      { label: 'Trọng lượng', value: '221 kg' }
    ],
    description: 'Ngôn ngữ thiết kế Sugomi mạnh mẽ, biểu tượng của dòng Naked-bike. Động cơ 4 xi-lanh thẳng hàng mang lại âm thanh đặc trưng và sức mạnh vượt trội.'
  },
  { 
    id: '2', 
    name: 'Honda CBR150R', 
    category: 'Xe mới',
    price: '72.000.000đ', 
    brand: 'Honda', 
    img: require('../../assets/motors/z1000_red.png'),
    colors: [
      { id: 'red', hex: '#EF4444', label: 'Victory Red', img: require('../../assets/motors/z1000_red.png') },
      { id: 'black', hex: '#1E293B', label: 'Dominator Black', img: require('../../assets/motors/z1000_black.png') }
    ],
    gallery: [
      require('../../assets/motors/z1000_red.png'),
      require('../../assets/motors/z1000_black.png')
    ],
    specs: [
      { label: 'Phân khối', value: '149cc' },
      { label: 'Công suất', value: '17 HP' },
      { label: 'Trọng lượng', value: '139 kg' }
    ],
    description: 'Lựa chọn hoàn hảo cho người mới bắt đầu chơi Sportbike. Thiết kế thừa hưởng từ đàn anh CBR1000RR-R.'
  },
  { 
    id: '3', 
    name: 'Ducati Panigale V4', 
    category: 'Xe mới',
    price: '950.000.000đ', 
    brand: 'Ducati', 
    img: require('../../assets/motors/z1000_red.png'),
    colors: [
      { id: 'red', hex: '#EF4444', label: 'Ducati Red', img: require('../../assets/motors/z1000_red.png') }
    ],
    gallery: [
      require('../../assets/motors/z1000_red.png')
    ],
    specs: [
      { label: 'Phân khối', value: '1,103cc' },
      { label: 'Công suất', value: '214 HP' },
      { label: 'Trọng lượng', value: '175 kg' }
    ],
    description: 'Đỉnh cao công nghệ MotoGP trên đường phố. Panigale V4 mang lại trải nghiệm lái xe thuần khiết nhất.'
  },
  { 
    id: '4', 
    name: 'Nhớt Castrol Power1', 
    category: 'Phụ tùng',
    price: '450.000đ', 
    brand: 'Castrol', 
    img: 'https://images.unsplash.com/photo-1635843343152-475658197771?q=80&w=2070',
    specs: [
      { label: 'Dung tích', value: '1L' },
      { label: 'Loại', value: '10W-40' }
    ],
    description: 'Dầu nhớt cao cấp cho xe côn tay và mô tô.'
  }
];

export const MOCK_LEADS = [
  { id: '1', name: 'Nguyễn Văn Khôi', interest: 'Kawasaki Z1000', status: 'Hot', color: '#EF4444', time: 'Vừa xong' },
  { id: '2', name: 'Trần Minh Nam', interest: 'Honda CBR150R', status: 'Warm', color: '#F59E0B', time: '2 giờ trước' },
  { id: '3', name: 'Lê Thảo Nhi', interest: 'Phụ tùng chính hãng', status: 'Cold', color: '#3B82F6', time: '1 ngày trước' }
];