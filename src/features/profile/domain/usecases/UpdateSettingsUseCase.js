export class UpdateSettingsUseCase {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

    async execute(settingsData) {
    return await this.profileRepository.updateSettings(settingsData);
  }
}
