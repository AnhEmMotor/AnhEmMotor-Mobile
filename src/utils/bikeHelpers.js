import { Alert, Clipboard } from 'react-native';

/**
 * Calculates the remaining days until a warranty expiration date.
 * @param {string} dateString - The expiration date in YYYY-MM-DD format.
 * @returns {number} The number of days remaining.
 */
export const calculateWarrantyDays = (dateString) => {
  const targetDate = new Date(dateString);
  const today = new Date();
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

/**
 * Copies text to the clipboard and shows an alert.
 * @param {string} text - The text to copy.
 * @param {string} label - The label for the text being copied (e.g., "số khung").
 */
export const copyToClipboard = (text, label) => {
  Clipboard.setString(text);
  Alert.alert('Đã sao chép', `Đã lưu ${label} vào bộ nhớ tạm.`);
};

/**
 * Formats a YYYY-MM-DD date string to DD/MM/YYYY.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date.
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return dateString.split('-').reverse().join('/');
};
