import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfileModel } from '../models/UserProfileModel';

export class ProfileLocalDataSource {
  constructor() {
    this.STORAGE_KEY = '@AEM_Customer_Profile';
  }

    async getProfile() {
    try {
      const dataStr = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (!dataStr) return null;
      return UserProfileModel.fromJson(JSON.parse(dataStr));
    } catch (error) {
      console.error('[ProfileLocalDataSource] getProfile failed:', error);
      return null;
    }
  }

    async saveProfile(profileModel) {
    try {
      const dataStr = JSON.stringify(profileModel.toJson());
      await AsyncStorage.setItem(this.STORAGE_KEY, dataStr);
      return true;
    } catch (error) {
      console.error('[ProfileLocalDataSource] saveProfile failed:', error);
      return false;
    }
  }

    async clearProfile() {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('[ProfileLocalDataSource] clearProfile failed:', error);
      return false;
    }
  }
}
