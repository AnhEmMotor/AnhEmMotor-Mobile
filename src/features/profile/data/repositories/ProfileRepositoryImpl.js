import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { UserProfileModel } from '../models/UserProfileModel';
import { ProfileLocalDataSource } from '../datasources/ProfileLocalDataSource';

/**
 * @file ProfileRepositoryImpl.js
 * @layer Data - Repositories (Implementation)
 * @description Coordinates Local Storage and mock network interactions for profile operations.
 */
export class ProfileRepositoryImpl extends IProfileRepository {
  constructor() {
    super();
    this.localDataSource = new ProfileLocalDataSource();
  }

  /**
   * Helper to simulate network latency
   * @param {number} ms 
   */
  async _simulateNetworkLatency(ms = 600) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetches profile, falling back to a default profile if local storage is empty
   * @returns {Promise<UserProfile>}
   */
  async getProfile() {
    await this._simulateNetworkLatency(500); // Premium loading effect
    let localProfile = await this.localDataSource.getProfile();
    
    if (!localProfile) {
      // Setup default mock profile if no saved data exists
      localProfile = new UserProfileModel();
      await this.localDataSource.saveProfile(localProfile);
    }
    
    return localProfile;
  }

  /**
   * Updates profile details
   * @param {UserProfile} userProfile 
   * @returns {Promise<UserProfile>}
   */
  async updateProfile(userProfile) {
    await this._simulateNetworkLatency(800); // Simulated API latency
    
    const profileModel = UserProfileModel.fromJson(userProfile);
    await this.localDataSource.saveProfile(profileModel);
    return profileModel;
  }

  /**
   * Updates specific settings fields
   * @param {Object} settingsData 
   * @returns {Promise<UserProfile>}
   */
  async updateSettings(settingsData) {
    await this._simulateNetworkLatency(200); // Settings save faster
    
    let localProfile = await this.localDataSource.getProfile();
    if (!localProfile) {
      localProfile = new UserProfileModel();
    }
    
    localProfile.settings = {
      ...localProfile.settings,
      ...settingsData
    };
    
    await this.localDataSource.saveProfile(localProfile);
    return localProfile;
  }

  /**
   * Uploads user avatar
   * @param {string} imageUri 
   * @returns {Promise<string>}
   */
  async uploadAvatar(imageUri) {
    await this._simulateNetworkLatency(1000); // Image uploading mock
    
    let localProfile = await this.localDataSource.getProfile();
    if (!localProfile) {
      localProfile = new UserProfileModel();
    }
    
    localProfile.licenseImage = imageUri; // or selectedAvatar depends on use
    await this.localDataSource.saveProfile(localProfile);
    return imageUri;
  }

  /**
   * Clears all profile data (Danger Zone / Delete Account logic)
   */
  async clearAllData() {
    await this._simulateNetworkLatency(1200);
    await this.localDataSource.clearProfile();
    return true;
  }
}
