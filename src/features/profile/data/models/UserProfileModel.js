import { UserProfile } from '../../domain/entities/UserProfile';

export class UserProfileModel extends UserProfile {
    static fromJson(json) {
    if (!json) return null;
    return new UserProfileModel({
      uid: json.uid,
      name: json.name,
      phone: json.phone,
      email: json.email,
      birthDate: json.birthDate,
      gender: json.gender,
      province: json.province,
      district: json.district,
      ward: json.ward,
      specificAddress: json.specificAddress,
      licenseTier: json.licenseTier,
      licenseImage: json.licenseImage,
      settings: json.settings
        ? {
            maintenanceNotifications: json.settings.maintenanceNotifications ?? true,
            biometricLogin: json.settings.biometricLogin ?? false,
            theme: json.settings.theme ?? 'dark',
            language: json.settings.language ?? 'vi',
          }
        : undefined,
    });
  }

    toJson() {
    return {
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
    };
  }
}
