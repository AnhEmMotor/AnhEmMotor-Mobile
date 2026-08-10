export class GetProfileUseCase {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  async execute() {
    return await this.profileRepository.getProfile();
  }
}
