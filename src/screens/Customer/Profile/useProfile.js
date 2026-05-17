/**
 * @file useProfile.js
 * @layer Presentation - Controllers (Compatibility Layer)
 * @description Provides a backward-compatible bridge redirecting legacy useProfile callers to the new useProfileController.
 */
import { useProfileController } from '../../../features/profile/presentation/controller/useProfileController';

export const useProfile = (navigation, bottomSheetRef) => {
  return useProfileController(navigation, bottomSheetRef);
};
