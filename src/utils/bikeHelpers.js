import { Alert, Clipboard } from 'react-native';

export const calculateWarrantyDays = (dateString) => {
  const targetDate = new Date(dateString);
  const today = new Date();
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const copyToClipboard = (text, label) => {
  Clipboard.setString(text);
  Alert.alert('Đã sao chép', `Đã lưu ${label} vào bộ nhớ tạm.`);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const parsed = new Date(dateString);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  // fallback: try simple dd-mm-yyyy split
  return dateString.split('-').reverse().join('/');
};
