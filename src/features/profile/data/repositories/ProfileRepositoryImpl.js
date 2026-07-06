import {
  getCurrentUserApi,
  updateUserApi,
  changePasswordApi,
  uploadAvatarApi,
} from '../../../../api/customerApi';
import { UserProfile } from '../../domain/entities/UserProfile';
import { UserProfileModel } from '../models/UserProfileModel';
import { API_BASE_URL } from '../../../../config';

export class ProfileRepositoryImpl {
  async _simulateNetworkLatency(ms = 600) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _makeProfile(user) {
    return new UserProfile({
      uid: user.uid || user.id,
      name: user.name || user.fullName || '',
      phone: user.phone || user.phoneNumber || '',
      email: user.email || '',
      birthDate: user.birthDate || user.dateOfBirth || '',
      gender: user.gender || 'Nam',
      province: user.province || '',
      district: user.district || '',
      ward: user.ward || '',
      specificAddress: user.specificAddress || user.address || '',
      licenseTier: user.licenseTier || 'A1',
      licenseImage: user.licenseImage || user.avatar || null,
      settings: user.settings
        ? {
            maintenanceNotifications: user.settings.maintenanceNotifications ?? true,
            biometricLogin: user.settings.biometricLogin ?? false,
            theme: user.settings.theme || 'dark',
            language: user.settings.language || 'vi',
          }
        : undefined,
    });
  }

  async getProfile() {
    const localProfile = await ProfileRepositoryImpl._loadLocal();
    if (localProfile) return localProfile;

    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 15000);
      const response = await fetch(API_BASE_URL + '/api/v1/User/me', {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        signal: ctrl.signal,
      });
      clearTimeout(tid);

      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();
      const user = data.value || data;

      if (user && (user.name || user.email || user.fullName)) {
        const profile = this._makeProfile(user);
        await ProfileRepositoryImpl._saveLocal(profile);
        return profile;
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.warn('[ProfileRepo] Remote failed:', error.message);
      }
    }

    return new UserProfile();
  }

  static async _loadLocal() {
    try {
      const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
      const raw = await AsyncStorage.getItem('@AEM_Customer_Profile');
      if (!raw) return null;
      const json = JSON.parse(raw);
      return UserProfileModel.fromJson(json);
    } catch {
      return null;
    }
  }

  static async _saveLocal(profile) {
    try {
      const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
      const model = profile instanceof UserProfileModel ? profile : new UserProfileModel({ ...profile, settings: profile.settings });
      await AsyncStorage.setItem('@AEM_Customer_Profile', JSON.stringify(model.toJson()));
    } catch {}
  }

  async updateProfile(userProfile) {
    try {
      const result = await updateUserApi({
        fullName: userProfile.name,
        email: userProfile.email,
        gender: userProfile.gender,
        dateOfBirth: userProfile.birthDate,
        phoneNumber: userProfile.phone,
      });
      if (result.isSuccess === false) {
        throw new Error(result.error?.message || 'Cập nhật thất bại');
      }
      const returned = result;
      const updated = this._makeProfile({ ...userProfile, ...returned });
      await ProfileRepositoryImpl._saveLocal(updated);
      return updated;
    } catch (error) {
      console.error('updateProfile error:', error);
      throw error;
    }
  }

  async updateSettings(settingsData) {
    await this._simulateNetworkLatency(200);
    let localProfile = null;
    try {
      localProfile = await this.getProfile();
    } catch {}

    if (!localProfile) localProfile = new UserProfile();

    const updated = {
      ...localProfile,
      settings: { ...(localProfile.settings || {}), ...settingsData },
    };
    await ProfileRepositoryImpl._saveLocal(updated);
    return updated;
  }

  async uploadAvatar(imageUri) {
    try {
      const uploadedUrl = await uploadAvatarApi(imageUri);
      return uploadedUrl;
    } catch (error) {
      console.error('uploadAvatar error:', error);
      throw error;
    }
  }

  async clearAllData() {
    await this._simulateNetworkLatency(300);
    try {
      const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.removeItem('@AEM_Customer_Profile');
    } catch {}
    return true;
  }

  async changePassword(oldPassword, newPassword) {
    return changePasswordApi(oldPassword, newPassword);
  }
}
