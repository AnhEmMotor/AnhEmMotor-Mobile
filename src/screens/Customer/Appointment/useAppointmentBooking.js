import { useState } from 'react';
import { Alert } from 'react-native';
import { useGlobalState } from '../../../context/GlobalState';
import { createSupportRequestApi } from '../../../api/customerApi';

export function useAppointmentBooking(navigation) {
  const { user } = useGlobalState();

  const [formData, setFormData] = useState({
    fullName: user?.name || user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    email: user?.email || '',
    serviceType: 'Bảo dưỡng định kỳ',
    appointmentDate: '',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.serviceType ||
      !formData.appointmentDate
    ) {
      Alert.alert(
        'Lỗi',
        'Vui lòng nhập đầy đủ họ tên, số điện thoại, loại dịch vụ và ngày hẹn mong muốn.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const formattedContent = `Ngày hẹn mong muốn: ${formData.appointmentDate}\nLoại dịch vụ: ${formData.serviceType}\nGhi chú: ${formData.notes || 'Không có'}`;

      const requestData = {
        fullName: formData.fullName,
        email: formData.email || `${formData.phoneNumber}@no-email.local`,
        phoneNumber: formData.phoneNumber,
        subject: `Đặt lịch dịch vụ: ${formData.serviceType}`,
        category: 'Lịch hẹn',
        content: formattedContent,
      };

      await createSupportRequestApi(requestData);

      Alert.alert(
        'Đặt lịch thành công',
        'Yêu cầu đặt lịch của bạn đã được gửi. Chúng tôi sẽ liên hệ lại sớm nhất để xác nhận.',
        [{ text: 'Đóng', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error submitting appointment:', error);
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    updateField,
    isLoading,
    handleSubmit,
    serviceOptions,
  };
}
