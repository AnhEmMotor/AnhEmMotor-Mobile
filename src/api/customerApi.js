import { apiGet, apiPost, apiPut, apiPatch, apiDelete, apiPostFormData, tokenService } from './httpClient';

export async function loginApi(usernameOrEmail, password) {
  await tokenService.clearTokens();
  const response = await apiPost('/api/v1/Auth/login', { usernameOrEmail, password }, undefined, false);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || data.title || 'Đăng nhập thất bại');
  }
  const payload = data.value || data;
  return {
    ...payload,
    accessToken: payload.accessToken || payload.AccessToken,
    refreshToken: payload.refreshToken || payload.RefreshToken,
  };
}

export async function registerApi(registerData) {
  const response = await apiPost('/api/v1/Auth/register', registerData, undefined, false);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || data.title || 'Đăng ký thất bại');
  }
  return data.value || data;
}

export async function forgotPasswordApi(email) {
  const response = await apiPost('/api/v1/Auth/forgot-password', { email }, undefined, false);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || data.title || 'Gửi yêu cầu thất bại');
  }
  return data.value || data;
}

export async function resetPasswordApi(email, token, newPassword) {
  const response = await apiPost('/api/v1/Auth/reset-password', { email, token, newPassword }, undefined, false);
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
    throw new Error(data.error?.message || 'Không thể tải danh sách xe');
  }
  const data = await response.json();
  
  if (data?.value?.items) {
    return data.value.items;
  }
  if (data?.items) {
    return data.items;
  }
  
  return Array.isArray(data) ? data : data.value || data.data || [];
}

export async function getCustomerVehicleDetailApi(vehicleId) {
  const response = await apiGet(`/api/v1/client/vehicles/${vehicleId}/detail`);
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Không thể tải chi tiết xe');
  }
  const data = await response.json();
  return data.value || data.data || data;
}

export async function getCustomerVehicleHistoryApi(vehicleId) {
  const response = await apiGet(`/api/v1/client/vehicles/${vehicleId}/history`);
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Không thể tải lịch sử xe');
  }
  const data = await response.json();
  return data.value || data.data || data;
}

export async function registerVehicleApi(vehicleData) {
  const payload = {
    name: vehicleData.name || '',
    licensePlate: vehicleData.licensePlate,
    vin: vehicleData.vin || '',
    engineNumber: vehicleData.engineNumber || '',
    color: vehicleData.color || '',
    currentOdo: vehicleData.currentOdo ?? 0,
  };
  const response = await apiPost('/api/v1/client/vehicles', payload);
  if (!response.ok) {
    const data = await response.json();
    const msg = data?.error?.message || data?.message || 'Đăng ký xe thất bại';
    throw new Error(msg);
  }
  const data = await response.json();
  return data.value || data;
}

export async function updateVehicleApi(vehicleId, vehicleData) {
  const payload = { ...vehicleData, vehicleId: Number(vehicleId) };
  const response = await apiPut(`/api/v1/client/vehicles/${vehicleId}`, payload);
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Cập nhật thông tin xe thất bại');
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

function formatPrice(value) {
  if (value == null || value === '') return 'Liên hệ';

  const numericValue = typeof value === 'number'
    ? value
    : Number(String(value).replace(/[^\d.\-]/g, ''));

  if (!Number.isFinite(numericValue)) return 'Liên hệ';

  return `${numericValue.toLocaleString('vi-VN')}đ`;
}

function normalizeProductItem(item) {
  if (!item || typeof item !== 'object') return null;

  const variants = Array.isArray(item?.productVariants ?? item?.ProductVariants ?? item?.variants ?? item?.Variants)
    ? (item?.productVariants ?? item?.ProductVariants ?? item?.variants ?? item?.Variants).map((v) => ({
        id: v.id ?? v.Id,
        productId: v.productId ?? v.ProductId,
        urlSlug: v.urlSlug ?? v.UrlSlug ?? '',
        price: v.price ?? v.Price,
        coverImageUrl: v.coverImageUrl ?? v.CoverImageUrl ?? '',
        variantName: v.variantName ?? v.VariantName ?? '',
        optionValuesText: v.optionValuesText ?? v.OptionValuesText ?? '',
        photos: Array.isArray(v.photos ?? v.Photos) ? (v.photos ?? v.Photos) : [],
        colors: (v.colors ?? v.Colors ?? []).map((c) => ({
          id: c.id ?? c.Id ?? null,
          name: c.name ?? c.ColorName ?? c.Name ?? '',
          colorName: c.colorName ?? c.ColorName ?? c.name ?? '',
          colorCode: c.colorCode ?? c.ColorCode ?? c.code ?? '#ccc',
          code: c.code ?? c.ColorCode ?? '#ccc',
          coverImageUrl: c.coverImageUrl ?? c.CoverImageUrl ?? c.image ?? '',
          image: c.image ?? c.CoverImageUrl ?? '',
        })),
      }))
    : [];

  const technologies = Array.isArray(item?.technologies ?? item?.Technologies ?? item?.productTechnologies ?? item?.ProductTechnologies)
    ? (item?.technologies ?? item?.Technologies ?? item?.productTechnologies ?? item?.ProductTechnologies).map((t) => ({
        technologyId: t.technologyId ?? t.TechnologyId ?? null,
        title: t.title ?? t.Title ?? t.customTitle ?? t.CustomTitle ?? '',
        description: t.description ?? t.Description ?? t.customDescription ?? t.CustomDescription ?? '',
        imageUrl: t.imageUrl ?? t.ImageUrl ?? t.customImageUrl ?? t.CustomImageUrl ?? '',
      }))
    : [];

  const firstVariant = variants[0];
  const imageUrl = item?.imageUrl
    || item?.ImageUrl
    || item?.img
    || item?.coverImageUrl
    || item?.CoverImageUrl
    || firstVariant?.coverImageUrl
    || firstVariant?.imageUrl
    || '';

  const priceValue = item?.referencePrice
    ?? item?.ReferencePrice
    ?? item?.price
    ?? item?.Price
    ?? firstVariant?.price
    ?? null;

  return {
    ...item,
    id: item?.id ?? item?.Id,
    name: item?.name ?? item?.Name ?? item?.productName ?? 'Sản phẩm',
    img: imageUrl,
    imageUrl,
    price: formatPrice(priceValue),
    referencePrice: priceValue,
    promotionText: item?.promotionText ?? item?.PromotionText ?? '',
    brandName: item?.brandName ?? item?.BrandName ?? item?.brand ?? '',
    categoryName: item?.categoryName ?? item?.CategoryName ?? item?.category ?? '',
    brandId: item?.brandId ?? item?.BrandId ?? null,
    categoryId: item?.categoryId ?? item?.CategoryId ?? null,
    
    // Technical specs
    weight: item?.weight ?? item?.Weight ?? null,
    length: item?.length ?? item?.Length ?? null,
    width: item?.width ?? item?.Width ?? null,
    height: item?.height ?? item?.Height ?? null,
    seatHeight: item?.seatHeight ?? item?.SeatHeight ?? null,
    wheelbase: item?.wheelbase ?? item?.Wheelbase ?? null,
    groundClearance: item?.groundClearance ?? item?.GroundClearance ?? null,
    fuelCapacity: item?.fuelCapacity ?? item?.FuelCapacity ?? null,
    tireSize: item?.tireSize ?? item?.TireSize ?? null,
    frontSuspension: item?.frontSuspension ?? item?.FrontSuspension ?? null,
    rearSuspension: item?.rearSuspension ?? item?.RearSuspension ?? null,
    engineType: item?.engineType ?? item?.EngineType ?? null,
    maxPower: item?.maxPower ?? item?.MaxPower ?? null,
    oilCapacity: item?.oilCapacity ?? item?.OilCapacity ?? null,
    fuelConsumption: item?.fuelConsumption ?? item?.FuelConsumption ?? null,
    transmissionType: item?.transmissionType ?? item?.TransmissionType ?? null,
    starterSystem: item?.starterSystem ?? item?.StarterSystem ?? null,
    maxTorque: item?.maxTorque ?? item?.MaxTorque ?? null,
    displacement: item?.displacement ?? item?.Displacement ?? null,
    boreStroke: item?.boreStroke ?? item?.BoreStroke ?? null,
    compressionRatio: item?.compressionRatio ?? item?.CompressionRatio ?? null,
    fuelSystem: item?.fuelSystem ?? item?.FuelSystem ?? null,
    frameType: item?.frameType ?? item?.FrameType ?? null,
    frontTireSize: item?.frontTireSize ?? item?.FrontTireSize ?? null,
    rearTireSize: item?.rearTireSize ?? item?.RearTireSize ?? null,
    frontBrake: item?.frontBrake ?? item?.FrontBrake ?? null,
    rearBrake: item?.rearBrake ?? item?.RearBrake ?? null,
    batteryType: item?.batteryType ?? item?.BatteryType ?? null,
    lightingSystem: item?.lightingSystem ?? item?.LightingSystem ?? null,
    dashboardType: item?.dashboardType ?? item?.DashboardType ?? null,
    material: item?.material ?? item?.Material ?? null,
    origin: item?.origin ?? item?.Origin ?? null,
    warrantyPeriod: item?.warrantyPeriod ?? item?.WarrantyPeriod ?? null,
    
    // Arrays
    variants,
    technologies,
    colors: variants.flatMap(v => v.colors || []),
  };
}

export async function getProductsApi(search = '', categoryId = null) {
  const trimmedSearch = (search || '').trim();
  let url = '/api/v1/client/catalog/products';
  const params = [];
  if (trimmedSearch) {
    params.push('search=' + encodeURIComponent(trimmedSearch));
  }
  if (categoryId != null) {
    params.push('categoryId=' + categoryId);
  }
  if (params.length > 0) {
    url += '?' + params.join('&');
  }
  const response = await apiGet(url);
  if (!response.ok) {
    throw new Error('Không thể tải danh sách sản phẩm');
  }
  const data = await response.json();
  const payload = data?.value ?? data?.data ?? data;
  const list = Array.isArray(payload) ? payload : [];
  return list.map(normalizeProductItem);
}

export async function getBrandsApi() {
  try {
    const response = await apiGet('/api/v1/Brand?Page=1&PageSize=100');
    if (!response.ok) throw new Error('load_brand_fail');
    const data = await response.json();
    const payload = data?.value ?? data?.items ?? data?.data ?? data;
    const items = Array.isArray(payload) ? payload : (payload?.items ?? []);
    return items
      .filter((b) => !b.deletedAt)
      .map((b) => ({
        id: b.id ?? b.Id,
        name: b.name ?? b.Name ?? '',
        logoUrl: b.logoUrl ?? b.LogoUrl ?? '',
        origin: b.origin ?? b.Origin ?? '',
      }));
  } catch {
    return [];
  }
}

export async function getProductDetailApi(productId) {
  const response = await apiGet('/api/v1/client/catalog/products/' + productId);
  if (!response.ok) {
    throw new Error('Không thể tải chi tiết sản phẩm');
  }
  const data = await response.json();
  const rawData = data.value || data.data || data;
  return normalizeProductItem(rawData);
}

export async function requestConsultationApi(productId, customerNote = '', preferredContactTime = '') {
  const response = await apiPost('/api/v1/client/catalog/request-consultation', {
    productId: Number(productId),
    customerNote,
    preferredContactTime,
  });
  if (!response.ok) {
    let msg = 'Gửi yêu cầu thất bại';
    try {
      const data = await response.json();
      msg = data?.error?.message || data?.title || msg;
    } catch {}
    throw new Error(msg);
  }
  let data = true;
  try {
    const text = await response.text();
    if (text) data = JSON.parse(text);
  } catch {}
  return data?.value ?? data;
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
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Gửi yêu cầu thất bại');
  }
  const data = await response.json();
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
