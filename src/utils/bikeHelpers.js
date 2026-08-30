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
  return dateString.split('-').reverse().join('/');
};

export const DEFAULT_VIN = 'RLHHC2041RY123456';
export const DEFAULT_ENGINE = 'MD375ABC123456';
export const DEFAULT_COLOR = 'Đỏ';

export const displayVin = (vin) => (vin && vin.trim()) || DEFAULT_VIN;
export const displayEngine = (engine) => (engine && engine.trim()) || DEFAULT_ENGINE;
export const displayColor = (color) => (color && color.trim()) || DEFAULT_COLOR;

export const DEFAULT_BIKE = require('../../assets/motors/default_bike.webp');
