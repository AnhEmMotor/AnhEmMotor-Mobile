import { apiGet, apiPost, apiPut, apiDelete } from './httpClient';

export async function loginApi(usernameOrEmail, password) {
  const response = await apiPost('/api/v1/Auth/login', { usernameOrEmail, password });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || data.title || 'Đăng nhập thất bại');
  }
  return data.value || data;
}

export async function registerApi(registerData) {
  const response = await apiPost('/api/v1/Auth/register', registerData);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || data.title || 'Đăng ký thất bại');
  }
  return data.value || data;
}

export async function forgotPasswordApi(email) {
  const response = await apiPost('/api/v1/Auth/forgot-password', { email });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || data.title || 'Gửi yêu cầu thất bại');
  }
  return data.value || data;
}

export async function resetPasswordApi(email, token, newPassword) {
  const response = await apiPost('/api/v1/Auth/reset-password', { email, token, newPassword });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || data.title || 'Đặt lại mật khẩu thất bại');
  }
  return data.value || data;
}

export async function logoutApi() {
  const response = await apiPost('/api/v1/Auth/logout', {});
  return response.ok;
}

export async function getCurrentUserApi() {
  const response = await apiGet('/api/v1/User/me');
  if (!response.ok) {
    throw new Error('Không thể lấy thông tin người dùng');
  }
  const data = await response.json();
  return data.value || data;
}

export async function getClientProfileApi() {
  const response = await apiGet('/api/v1/client/profile');
  if (!response.ok) {
    throw new Error('Không thể tải hồ sơ khách hàng');
  }
  const data = await response.json();
  return data.value || data;
}

export async function updateClientProfileApi(body) {
  const response = await apiPut('/api/v1/client/profile', body);
  if (!response.ok) {
    throw new Error('Cập nhật hồ sơ thất bại');
  }
  const data = await response.json();
  return data.value || data;
}

export async function getProfileApi() {
  const response = await apiGet('/api/v1/client/profile');
  if (!response.ok) {
    throw new Error('Không thể tải hồ sơ');
  }
  const data = await response.json();
  return data.value || data;
}

export async function changePasswordApi(oldPassword, newPassword) {
  const response = await apiPost('/api/v1/User/change-password', { oldPassword, newPassword });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Đổi mật khẩu thất bại');
  }
  const data = await response.json();
  return data.value != null ? data.value : data;
}

export async function updateUserApi(body) {
  const response = await apiPut('/api/v1/User/me', body);
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Cập nhật thông tin thất bại');
  }
  const data = await response.json();
  return data.value != null ? data.value : data;
}

export async function getGenderOptionsApi() {
  const response = await apiGet('/api/v1/User/gender-options');
  if (!response.ok) {
    throw new Error('Không thể tải danh sách giới tính');
  }
  const data = await response.json();
  return data.value || data;
}

export async function uploadAvatarApi(fileUri) {
  const formData = new FormData();
  const fileName = fileUri.split('/').pop() || 'avatar.jpg';
  formData.append('file', { uri: fileUri, name: fileName, type: 'image/jpeg' });
  return apiPostFormData('/api/v1/User/avatar', formData);
}

export async function deleteAccountApi() {
  const response = await apiPost('/api/v1/User/delete-account', {});
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Xóa tài khoản thất bại');
  }
  const data = await response.json();
  return data.value != null ? data.value : data;
}

export async function getMyVehiclesApi() {
  const response = await apiGet('/api/v1/client/vehicles');
  if (!response.ok) {
    const data = await response.json();
    if (data.message === 'Endpoint temporarily unavailable') {
      return [];
    }
    throw new Error(data.error?.message || 'Không thể tải danh sách xe');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.value || data.data || [];
}

export async function registerVehicleApi(vehicleData) {
  const response = await apiPost('/api/v1/client/vehicles/register-odo', vehicleData);
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Đăng ký xe thất bại');
  }
  const data = await response.json();
  return data.value || data;
}

export async function getAvailableSlotsApi(date) {
  const dateStr = date instanceof Date ? date.toISOString() : date;
  const response = await apiGet('/api/v1/client/bookings/available-slots?date=' + encodeURIComponent(dateStr));
  if (!response.ok) {
    throw new Error('Không thể tải lịch trống');
  }
  const data = await response.json();
  return data.value || data.data || data;
}

export async function createBookingApi(bookingData) {
  const response = await apiPost('/api/v1/client/bookings', bookingData);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Tạo lịch hẹn thất bại');
  }
  return data.value || data;
}

export async function getBookingHistoryApi() {
  const response = await apiGet('/api/v1/client/bookings');
  if (!response.ok) {
    throw new Error('Không thể tải lịch sử đặt lịch');
  }
  const data = await response.json();
  return data.value || data.data || data;
}

export async function cancelBookingApi(bookingId, reason) {
  const response = await apiPatch('/api/v1/client/bookings/' + bookingId + '/cancel', { reason });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Hủy lịch thất bại');
  }
  const data = await response.json();
  return data.value || data;
}

export async function getProductsApi(search = '', categoryId = null) {
  let url = '/api/v1/client/catalog/products?search=' + encodeURIComponent(search);
  if (categoryId) {
    url += '&categoryId=' + categoryId;
  }
  const response = await apiGet(url);
  if (!response.ok) {
    throw new Error('Không thể tải danh sách sản phẩm');
  }
  const data = await response.json();
  return data.value || data.data || data;
}

export async function getProductDetailApi(productId) {
  const response = await apiGet('/api/v1/client/catalog/products/' + productId);
  if (!response.ok) {
    throw new Error('Không thể tải chi tiết sản phẩm');
  }
  const data = await response.json();
  return data.value || data.data || data;
}

export async function requestConsultationApi(productId, customerNote, preferredContactTime) {
  const response = await apiPost('/api/v1/client/catalog/request-consultation', { productId, customerNote, preferredContactTime });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Gửi yêu cầu thất bại');
  }
  const data = await response.json();
  return data.value || data;
}

export async function getFaqsApi(search = '') {
  const response = await apiGet('/api/v1/client/support/faq?search=' + encodeURIComponent(search));
  if (!response.ok) {
    throw new Error('Không thể tải câu hỏi thường gặp');
  }
  const data = await response.json();
  return data.value || data.data || data;
}

export async function submitFeedbackApi(rating, comment, mediaUrls = []) {
  const response = await apiPost('/api/v1/client/support/feedback', { rating, comment, mediaUrls });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gửi phản hồi thất bại');
  }
  return data.value || data;
}

export async function requestCallbackApi(phoneNumber, issueDescription) {
  const response = await apiPost('/api/v1/client/support/callback', { phoneNumber, issueDescription });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gửi yêu cầu thất bại');
  }
  return data.value || data;
}

export async function getInvoicesApi() {
  const response = await apiGet('/api/v1/client/invoices');
  if (!response.ok) {
    throw new Error('Không thể tải danh sách hóa đơn');
  }
  const data = await response.json();
  return data.value || data.data || data;
}

export async function getInvoiceDetailApi(invoiceId) {
  const response = await apiGet('/api/v1/client/invoices/' + invoiceId);
  if (!response.ok) {
    throw new Error('Không thể tải chi tiết hóa đơn');
  }
  const data = await response.json();
  return data.value || data.data || data;
}

export async function getLatestNewsApi() {
  const response = await apiGet('/api/v1/news/public/latest');
  if (!response.ok) {
    throw new Error('Không thể tải tin tức');
  }
  const data = await response.json();
  return data.value || data.data || data;
}

export async function getNewsDetailApi(slug) {
  const response = await apiGet('/api/v1/news/public/' + slug);
  if (!response.ok) {
    throw new Error('Không thể tải chi tiết bài viết');
  }
  const data = await response.json();
  return data.value || data.data || data;
}

export async function getActiveShipmentsApi() {
  const response = await apiGet('/api/v1/logistics/active-shipments');
  if (!response.ok) {
    throw new Error('Không thể tải đơn hàng đang vận chuyển');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function getShipmentTrackingApi(searchQuery) {
  const response = await apiGet('/api/v1/logistics/tracking/' + encodeURIComponent(searchQuery));
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Không thể tải thông tin vận chuyển');
  }
  const data = await response.json();
  return data.data || data;
}
