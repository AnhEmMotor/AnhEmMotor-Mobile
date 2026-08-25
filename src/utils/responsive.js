import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const clampFactor = (value) => Math.min(Math.max(value, 0.85), 1.6);

const horizontalScale = (size) => clampFactor(width / guidelineBaseWidth) * size;
const verticalScale = (size) => clampFactor(height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

export { horizontalScale, verticalScale, moderateScale };
