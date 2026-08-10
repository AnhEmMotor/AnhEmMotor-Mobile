import { useProfileController } from '../../../features/profile/presentation/controller/useProfileController';

export const useProfile = (navigation, bottomSheetRef) => {
  return useProfileController(navigation, bottomSheetRef);
};
