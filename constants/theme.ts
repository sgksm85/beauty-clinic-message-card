/**
 * Beauty Clinic Message Card Theme
 * Elegant and minimal color palette for beauty clinic branding
 */

import { Platform } from "react-native";

const primaryColor = "#D4A373"; // Rose gold - elegant and sophisticated
const cardBgLight = "#F9F7F5"; // Warm off-white
const cardBgDark = "#2A2A2A"; // Dark charcoal

export const Colors = {
  light: {
    text: "#2C2C2C",
    textSecondary: "#6B6B6B",
    textDisabled: "#B0B0B0",
    background: "#FFFFFF",
    cardBackground: cardBgLight,
    tint: primaryColor,
    icon: "#6B6B6B",
    tabIconDefault: "#6B6B6B",
    tabIconSelected: primaryColor,
    border: "#E5E5E5",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    textDisabled: "#6B6B6B",
    background: "#1A1A1A",
    cardBackground: cardBgDark,
    tint: "#FFFFFF",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#FFFFFF",
    border: "#3A3A3A",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  button: 12,
  card: 16,
  modal: 24,
};
