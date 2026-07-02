/**
 * @file UpdateProfileUseCase.js
 * @layer Domain - Use Cases
 * @description Use case for validating and saving user profile details.
 */
export class UpdateProfileUseCase {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  /**
   * Executes the usecase
   * @param {UserProfile} userProfile 
   * @returns {Promise<UserProfile>}
   */
  async execute(userProfile) {
    // 1. Validation Logic
    if (!userProfile.name || userProfile.name.trim() === '') {
      throw new Error('Họ và tên không được để trống');
    }

    // Auto-capitalize name (Clean Architecture business logic rule)
    const formattedName = userProfile.getFormattedName();
    userProfile.name = formattedName;

    if (userProfile.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userProfile.email)) {
        throw new Error('Email không hợp lệ. Vui lòng kiểm tra lại.');
      }
    }

    // 2. Persist using Repository
    return await this.profileRepository.updateProfile(userProfile);
  }
}
