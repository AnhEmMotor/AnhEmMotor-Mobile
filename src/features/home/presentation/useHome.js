import { useState, useRef, useEffect } from 'react';
import { useGlobalState } from '../../../context/GlobalState';
import { ProfileLocalDataSource } from '../../../features/profile/data/datasources/ProfileLocalDataSource';
import { getFullImageUrl } from '../../../utils/imageHelpers';

export const useHome = () => {
  const { unreadNotifications } = useGlobalState();
  const [vehicleStatus] = useState('has_vehicle');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const bottomSheetRef = useRef(null);
  const [userName, setUserName] = useState('');
  const [personalVouchers, setPersonalVouchers] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const dataSource = new ProfileLocalDataSource();
      const profile = await dataSource.getProfile();
      if (profile && profile.name) {
        setUserName(profile.getFormattedName());
      } else {
        setUserName('Khách hàng');
      }
    };
    fetchProfile();

    const fetchPersonalVouchers = async () => {
      try {
        const { getPersonalVouchersApi } = require('../../../api/customerApi');
        const vouchers = await getPersonalVouchersApi();
        if (vouchers && Array.isArray(vouchers)) {
          const formattedVouchers = vouchers.map((v) => ({
            id: v.id || v.Id,
            title: v.name || v.Name || v.code || v.Code,
            desc: `Giảm ${v.discountValue || v.DiscountValue}${v.discountType === 1 || v.DiscountType === 1 ? 'đ' : '%'} - Áp dụng cho đơn từ ${(v.minOrderValue || v.MinOrderValue || 0).toLocaleString('vi-VN')}đ`,
            code: v.code || v.Code,
          }));
          setPersonalVouchers(formattedVouchers);
        }
      } catch (error) {
        console.error('Lỗi tải voucher cá nhân:', error);
      }
    };
    fetchPersonalVouchers();
  }, []);

  const handleOpenVoucher = (voucher) => {
    setSelectedVoucher(voucher);

    setTimeout(() => {
      bottomSheetRef.current?.show();
    }, 50);
  };

  const handleCloseVoucher = () => {
    setSelectedVoucher(null);
  };

  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { getLatestNewsApi } = require('../../../api/customerApi');
        const news = await getLatestNewsApi();

        const getImageUrl = (url) => {
          if (!url) return 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070';
          return getFullImageUrl(url, { basePath: 'uploads/' });
        };

        const formattedNews = (news || []).map((item) => ({
          id: item.id || item.Id,
          title: item.title || item.Title,
          desc:
            item.metaDescription ||
            item.MetaDescription ||
            item.summary ||
            item.Summary ||
            item.content ||
            item.Content ||
            'Tin tức nóng hổi luôn được cập nhật.',
          image: getImageUrl(item.coverImageUrl || item.CoverImageUrl),
          author:
            item.authorName || item.AuthorName || item.author || item.Author || 'AE Motor News',
          date:
            item.publishedDate || item.PublishedDate
              ? new Date(item.publishedDate || item.PublishedDate).toLocaleDateString('vi-VN')
              : item.createdAt || item.CreatedAt
                ? new Date(item.createdAt || item.CreatedAt).toLocaleDateString('vi-VN')
                : 'Mới nhất',
          slug: item.slug || item.Slug,
        }));

        setNewsList(formattedNews);
      } catch (error) {
        console.error('Lỗi tải tin tức:', error);
      }
    };

    fetchNews();
  }, []);

  return {
    unreadNotifications,
    vehicleStatus,
    selectedVoucher,
    bottomSheetRef,
    userName,
    handleOpenVoucher,
    handleCloseVoucher,
    newsList,
    personalVouchers,
  };
};

export const shortcuts = [];
