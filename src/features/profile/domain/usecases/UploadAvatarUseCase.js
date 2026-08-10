export class UploadAvatarUseCase {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

    async execute(imageUri) {
    if (!imageUri) {
      throw new Error('Đường dẫn ảnh không được để trống');
    }
    return await this.profileRepository.uploadAvatar(imageUri);
  }
}
