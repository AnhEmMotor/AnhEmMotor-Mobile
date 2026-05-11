export const MOCK_MOTORS = [
  { 
    id: '1', 
    name: 'Kawasaki Z1000', 
    price: '420.000.000đ', 
    brand: 'Kawasaki', 
    img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070',
    specs: [
      { label: 'Phân khối', value: '998cc' },
      { label: 'Công suất', value: '142 HP' },
      { label: 'Trọng lượng', value: '221 kg' }
    ],
    description: 'Ngôn ngữ thiết kế Sugomi mạnh mẽ, biểu tượng của dòng Naked-bike.'
  },
  { 
    id: '2', 
    name: 'Honda CBR150R', 
    price: '72.000.000đ', 
    brand: 'Honda', 
    img: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=2070',
    specs: [
      { label: 'Phân khối', value: '149cc' },
      { label: 'Công suất', value: '17 HP' },
      { label: 'Trọng lượng', value: '139 kg' }
    ],
    description: 'Lựa chọn hoàn hảo cho người mới bắt đầu chơi Sportbike.'
  },
  { 
    id: '3', 
    name: 'Ducati Panigale V4', 
    price: '950.000.000đ', 
    brand: 'Ducati', 
    img: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070',
    specs: [
      { label: 'Phân khối', value: '1,103cc' },
      { label: 'Công suất', value: '214 HP' },
      { label: 'Trọng lượng', value: '175 kg' }
    ],
    description: 'Đỉnh cao công nghệ MotoGP trên đường phố.'
  }
];

export const MOCK_LEADS = [
  { id: '1', name: 'Nguyễn Văn Khôi', interest: 'Kawasaki Z1000', status: 'Hot', color: '#EF4444', time: 'Vừa xong' },
  { id: '2', name: 'Trần Minh Nam', interest: 'Honda CBR150R', status: 'Warm', color: '#F59E0B', time: '2 giờ trước' },
  { id: '3', name: 'Lê Thảo Nhi', interest: 'Phụ tùng chính hãng', status: 'Cold', color: '#3B82F6', time: '1 ngày trước' }
];