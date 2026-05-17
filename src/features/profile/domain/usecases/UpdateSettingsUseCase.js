/**
 * @file UpdateSettingsUseCase.js
 * @layer Domain - Use Cases
 * @description Use case for saving toggle switches and quick user settings.
 */
export class UpdateSettingsUseCase {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  /**
   * Executes the use case
   * @param {Object} settingsData 
   * @returns {Promise<UserProfile>}
   */
  async execute(settingsData) {
    return await this.profileRepository.updateSettings(settingsData);
  }
}
