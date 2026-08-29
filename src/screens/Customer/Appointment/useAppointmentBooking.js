import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalState } from '../../../context/GlobalState';
import { createSupportRequestApi, cancelBookingApi } from '../../../api/customerApi';

export function useAppointmentBooking(navigation, toastRef) {
  const { user } = useGlobalState();

  const [viewMode, setViewMode] = useState('list');
  const [appointments, setAppointments] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialForm = {
    fullName: user?.name || user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    email: user?.email || '',
    serviceType: 'Bảo dưỡng định kỳ',
    appointmentDate: '',
    notes: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const serviceOptions = [
    'Bảo dưỡng định kỳ',
    'Sửa chữa chung',
    'Lắp đặt phụ kiện',
    'Tư vấn kỹ thuật',
    'Khác',
  ];

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const mapStatusLabel = (status) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('cancel') || s.includes('huy')) {
      return { label: 'Đã hủy', color: '#EF4444', bg: '#EF444415' };
    }
    if (s.includes('complete') || s.includes('hoan tat') || s.includes('resolve')) {
      return { label: 'Hoàn tất', color: '#10B981', bg: '#10B98115' };
    }
    if (s.includes('progress') || s.includes('xu ly') || s.includes('assign')) {
      return { label: 'Đang xử lý', color: '#3B82F6', bg: '#3B82F615' };
    }
    if (s.includes('confirm') || s.includes('xac nhan')) {
      return { label: 'Đã xác nhận', color: '#8B5CF6', bg: '#8B5CF615' };
    }
    return { label: 'Chờ xác nhận', color: '#F59E0B', bg: '#F59E0B15' };
  };

  const userKey = user?.id || user?.email || user?.phoneNumber || user?.name || 'guest';
  const storageKey = `@AEM_User_Appointments_${userKey}`;

  const fetchAppointments = useCallback(async () => {
    setIsFetching(true);
    try {
      let localList = [];
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) {
          localList = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Failed to load local appointments:', e);
      }

      const userAppointments = (Array.isArray(localList) ? localList : []).sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      setAppointments(userAppointments);
    } catch (e) {
      console.error('Error fetching appointments:', e);
    } finally {
      setIsFetching(false);
    }
  }, [storageKey]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (!isMounted) return;
        let localList = [];
        if (stored) {
          try {
            localList = JSON.parse(stored);
          } catch (e) {
            console.warn('Failed to load local appointments:', e);
          }
        }
        const userAppointments = (Array.isArray(localList) ? localList : []).sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        if (isMounted) {
          setAppointments(userAppointments);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [storageKey]);

  const handleSubmit = async () => {
    if (
      !formData.fullName?.trim() ||
      !formData.phoneNumber?.trim() ||
      !formData.serviceType?.trim() ||
      !formData.appointmentDate?.trim()
    ) {
      if (toastRef?.current?.show) {
        toastRef.current.show('Vui lòng nhập đầy đủ thông tin bắt buộc (*)', 'warning');
      }
      return;
    }

    setIsLoading(true);
    try {
      const formattedContent = `Ngày hẹn mong muốn: ${formData.appointmentDate}\nLoại dịch vụ: ${formData.serviceType}\nGhi chú: ${formData.notes || 'Không có'}`;

      const requestData = {
        fullName: formData.fullName.trim(),
        email: formData.email?.trim() || `${formData.phoneNumber.trim()}@no-email.local`,
        phoneNumber: formData.phoneNumber.trim(),
        subject: `Đặt lịch dịch vụ: ${formData.serviceType}`,
        category: 'Lịch hẹn',
        content: formattedContent,
      };

      const response = await createSupportRequestApi(requestData);

      const newAppointment = {
        id: response?.id || Date.now(),
        serviceType: formData.serviceType,
        appointmentDate: formData.appointmentDate,
        notes: formData.notes || '',
        status: 'Pending',
        trackingToken: response?.trackingToken || '',
        createdAt: new Date().toISOString(),
      };

      try {
        const stored = await AsyncStorage.getItem(storageKey);
        const list = stored ? JSON.parse(stored) : [];
        const updated = [newAppointment, ...list.filter((x) => x.id !== newAppointment.id)];
        await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
        setAppointments(updated);
      } catch (err) {
        console.warn('Failed to save appointment locally:', err);
      }

      setFormData({
        ...initialForm,
        fullName: user?.name || user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
        email: user?.email || '',
      });

      setViewMode('list');

      if (toastRef?.current?.show) {
        toastRef.current.show('Đặt lịch hẹn thành công!', 'success');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      const msg = error.message || 'Đặt lịch thất bại. Vui lòng thử lại sau.';
      if (toastRef?.current?.show) {
        toastRef.current.show(msg, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (item) => {
    try {
      if (item.isServerBooking) {
        await cancelBookingApi(item.id, 'Khách hàng yêu cầu hủy trên ứng dụng');
      }

      const updated = appointments.map((a) =>
        a.id === item.id ? { ...a, status: 'Cancelled' } : a
      );
      setAppointments(updated);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));

      if (toastRef?.current?.show) {
        toastRef.current.show('Đã hủy lịch hẹn thành công', 'success');
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      if (toastRef?.current?.show) {
        toastRef.current.show(error.message || 'Hủy lịch hẹn thất bại', 'error');
      }
    }
  };

  return {
    viewMode,
    setViewMode,
    appointments,
    isFetching,
    fetchAppointments,
    formData,
    updateField,
    isLoading,
    handleSubmit,
    handleCancelAppointment,
    serviceOptions,
    mapStatusLabel,
  };
}
