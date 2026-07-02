import { UserProfile } from '../../domain/entities/UserProfile';

/**
 * @file UserProfileModel.js
 * @layer Data - Models
 * @description Data representation extending UserProfile with JSON serialization/deserialization.
 */
export class UserProfileModel extends UserProfile {
  /**
   * Converts a database or API JSON object into a UserProfile entity
   * @param {Object} json 
   * @returns {UserProfileModel}
   */
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
      settings: json.settings ? {
        maintenanceNotifications: json.settings.maintenanceNotifications ?? true,
        biometricLogin: json.settings.biometricLogin ?? false,
        theme: json.settings.theme ?? 'dark',
        language: json.settings.language ?? 'vi',
      } : undefined
    });
  }

  /**
   * Converts the entity into a JSON object suitable for saving to storage or sending to APIs
   * @returns {Object}
   */
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
      settings: { ...this.settings }
    };
  }
}
