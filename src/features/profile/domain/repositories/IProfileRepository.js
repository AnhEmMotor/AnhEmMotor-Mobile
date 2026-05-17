/**
 * @file IProfileRepository.js
 * @layer Domain - Repositories (Interface)
 * @description Contract representing profile data operations.
 */
export class IProfileRepository {
  /**
   * Fetches the user profile
   * @returns {Promise<UserProfile>}
   */
  async getProfile() {
    throw new Error('Method not implemented');
  }

  /**
   * Updates user profile details
   * @param {UserProfile} userProfile 
   * @returns {Promise<UserProfile>}
   */
  async updateProfile(userProfile) {
    throw new Error('Method not implemented');
  }

  /**
   * Updates a specific user settings field
   * @param {Object} settings 
   * @returns {Promise<UserProfile>}
   */
  async updateSettings(settings) {
    throw new Error('Method not implemented');
  }

  /**
   * Uploads and updates user avatar
   * @param {string} imageUri 
   * @returns {Promise<string>} Uploaded image URL/URI
   */
  async uploadAvatar(imageUri) {
    throw new Error('Method not implemented');
  }
}
