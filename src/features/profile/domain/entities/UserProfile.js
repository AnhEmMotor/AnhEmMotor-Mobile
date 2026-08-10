export class UserProfile {
  constructor({
    uid = '',
    name = '',
    phone = '',
    email = '',
    birthDate = '',
    gender = '',
    province = '',
    district = '',
    ward = '',
    specificAddress = '',
    licenseTier = '',
    licenseImage = null,
    settings = {
      maintenanceNotifications: true,
      biometricLogin: false,
      theme: 'dark',
      language: 'vi',
    },
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

    getFormattedName() {
    if (!this.name) return '';
    return this.name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get full string address
   */
  getFullAddress() {
    const parts = [this.specificAddress, this.ward, this.district, this.province].filter(Boolean);
    return parts.join(', ');
  }

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
      settings: { ...this.settings },
    });
  }
}
