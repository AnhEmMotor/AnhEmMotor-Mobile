/**
 * @file UserProfile.js
 * @layer Domain - Entities
 * @description Central business entity representing the user's profile and settings.
 */
export class UserProfile {
  constructor({
    uid = 'AEM-6899',
    name = 'Nguyễn Khôi',
    phone = '0901234567',
    email = 'nguyenkhoi.ae@gmail.com',
    birthDate = '17/05/1995',
    gender = 'Nam',
    province = 'Đồng Nai',
    district = 'Thành phố Biên Hòa',
    ward = 'Phường Quyết Thắng',
    specificAddress = '123 Cách Mạng Tháng 8',
    licenseTier = 'A1',
    licenseImage = null,
    settings = {
      maintenanceNotifications: true,
      biometricLogin: false,
      theme: 'dark',
      language: 'vi',
    }
  } = {}) {
    this.uid = uid;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.birthDate = birthDate;
    this.gender = gender;
    this.province = province;
    this.district = district;
    this.ward = ward;
    this.specificAddress = specificAddress;
    this.licenseTier = licenseTier;
    this.licenseImage = licenseImage;
    this.settings = { ...settings };
  }

  /**
   * Helper to format name to capitalize first letter of each word
   */
  getFormattedName() {
    if (!this.name) return '';
    return this.name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get full string address
   */
  getFullAddress() {
    const parts = [this.specificAddress, this.ward, this.district, this.province].filter(Boolean);
    return parts.join(', ');
  }

  /**
   * Creates a deep copy of the entity
   */
  clone() {
    return new UserProfile({
      uid: this.uid,
      name: this.name,
      phone: this.phone,
      email: this.email,
      birthDate: this.birthDate,
      gender: this.gender,
      province: this.province,
      district: this.district,
      ward: this.ward,
      specificAddress: this.specificAddress,
      licenseTier: this.licenseTier,
      licenseImage: this.licenseImage,
      settings: { ...this.settings }
    });
  }
}
