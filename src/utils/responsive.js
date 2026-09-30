import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';

// Initial Screen Dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const { width: REAL_WIDTH, height: REAL_HEIGHT } = Dimensions.get('screen');

// Standard Mobile Design Base (iPhone X/11 standard: 375 x 812)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * 1. Horizontal Scale (Width, MarginHorizontal, PaddingHorizontal)
 */
export const scale = (size) => {
    return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * 2. Vertical Scale (Height, MarginVertical, PaddingVertical)
 */
export const verticalScale = (size) => {
    return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * 3. Moderate Scale (Border Radius, Icons, Paddings)
 * factor default 0.5 hota hai
 */
export const moderateScale = (size, factor = 0.5) => {
    return size + (scale(size) - size) * factor;
};

/**
 * 4. Moderate Vertical Scale
 */
export const moderateVerticalScale = (size, factor = 0.5) => {
    return size + (verticalScale(size) - size) * factor;
};

/**
 * 5. Width Percentage (e.g. wp(50) = 50% width)
 */
export const wp = (percentage) => {
    return (SCREEN_WIDTH * percentage) / 100;
};

/**
 * 6. Height Percentage (e.g. hp(50) = 50% height)
 */
export const hp = (percentage) => {
    return (SCREEN_HEIGHT * percentage) / 100;
};

/**
 * 7. Responsive Font Size (rf)
 */
export const fontSize = (size) => {
    const scaleRatio = SCREEN_WIDTH / BASE_WIDTH;
    const newSize = size * scaleRatio;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * 8. Device Helpers
 */
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Tablet Check
const pixelDensity = PixelRatio.get();
const adjustedWidth = SCREEN_WIDTH * pixelDensity;
const adjustedHeight = SCREEN_HEIGHT * pixelDensity;
export const isTablet = () => {
    if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
        return true;
    }
    return adjustedWidth >= 1920 || adjustedHeight >= 1920;
};

// Orientation
export const isLandscape = () => SCREEN_WIDTH > SCREEN_HEIGHT;
export const isPortrait = () => SCREEN_HEIGHT >= SCREEN_WIDTH;

// Status Bar Height
export const STATUSBAR_HEIGHT = Platform.select({
    ios: 44,
    android: StatusBar.currentHeight || 24,
    default: 0,
});

/**
 * 9. Short-hand Shortcuts (Fast coding k liye)
 */
export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const mvs = moderateVerticalScale;
export const rf = fontSize;

export { SCREEN_WIDTH, SCREEN_HEIGHT, REAL_WIDTH, REAL_HEIGHT };

// Default Export
export default {
    scale,
    verticalScale,
    moderateScale,
    moderateVerticalScale,
    wp,
    hp,
    fontSize,
    s,
    vs,
    ms,
    mvs,
    rf,
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    REAL_WIDTH,
    REAL_HEIGHT,
    isIOS,
    isAndroid,
    isTablet,
    isLandscape,
    isPortrait,
    STATUSBAR_HEIGHT,
};
