/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * App color scheme - Modern clean UI with white palette and accent colors
 */

// Primary and secondary colors
const primaryColor = '#4A6FFF';  // Vibrant blue
const secondaryColor = '#9747FF'; // Purple accent
const errorColor = '#FF4757';    // Error red

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// Theme colors for system components
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Modern design system
export const ModernColors = {
  // Core colors
  primary: primaryColor,
  secondary: secondaryColor,
  error: errorColor,
  success: '#2ED573',
  warning: '#FFA502',
  info: '#70A1FF',
  
  // Text colors
  text: {
    primary: '#161B25',    // Almost black
    secondary: '#505A6B',  // Dark gray
    tertiary: '#8D96A8',   // Mid gray
    disabled: '#C5CAD3',   // Light gray
    inverse: '#FFFFFF',    // White text for dark backgrounds
  },

  // Background colors
  background: {
    primary: '#FFFFFF',    // Pure white
    secondary: '#F8F9FC',  // Light gray/blue tint
    tertiary: '#F1F2F6',   // Slightly darker gray/blue
    card: '#FFFFFF',       // Card background
    highlight: '#F5F8FF',  // Slight blue tint for highlights
  },

  // Border colors
  border: {
    light: '#E4E8F0',      // Light borders
    medium: '#D1D6E0',     // Medium borders
  },

  // Button colors
  button: {
    primary: {
      background: primaryColor,
      text: '#FFFFFF',
    },
    secondary: {
      background: 'transparent',
      text: primaryColor,
      border: primaryColor,
    },
    disabled: {
      background: '#E4E8F0',
      text: '#8D96A8',
    },
  },
};
