/**
 * @file GetProfileUseCase.js
 * @layer Domain - Use Cases
 * @description Use case for fetching the current user profile.
 */
export class GetProfileUseCase {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  /**
   * Executes the use case
   * @returns {Promise<UserProfile>}
   */
  async execute() {
    return await this.profileRepository.getProfile();
  }
}
