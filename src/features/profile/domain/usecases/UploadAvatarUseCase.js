/**
 * @file UploadAvatarUseCase.js
 * @layer Domain - Use Cases
 * @description Use case for uploading a new avatar image.
 */
export class UploadAvatarUseCase {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  /**
   * Executes the use case
   * @param {string} imageUri 
   * @returns {Promise<string>} Uploaded avatar URL
   */
  async execute(imageUri) {
    if (!imageUri) {
      throw new Error('Đường dẫn ảnh không được để trống');
    }
    return await this.profileRepository.uploadAvatar(imageUri);
  }
}
