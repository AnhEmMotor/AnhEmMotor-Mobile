export class UpdateProfileUseCase {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

    async execute(userProfile) {
    
    if (!userProfile.name || userProfile.name.trim() === '') {
      throw new Error('Họ và tên không được để trống');
    }

    
    const formattedName = userProfile.getFormattedName();
    userProfile.name = formattedName;

    if (userProfile.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userProfile.email)) {
        throw new Error('Email không hợp lệ. Vui lòng kiểm tra lại.');
      }
    }

    
    return await this.profileRepository.updateProfile(userProfile);
  }
}
