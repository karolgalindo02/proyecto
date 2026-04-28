export const AppColors = {
  primary: '#5A45FF',
  primaryHover: '#4A35F0',
  primaryLight: '#EAE7FF',
  background: '#F8F9FA',
  white: '#FFFFFF',

  text: '#1A1A24',
  textSecondary: '#6B6B7A',
  textMuted: '#B5B5C1',

  // Pasteles para cards
  pink:     '#FFD6E0',
  pinkText: '#E6547A',
  peach:    '#FFE8D6',
  peachText:'#E67E22',
  lavender: '#E8E0FF',
  yellow:   '#FFF1C1',
  yellowText:'#C99E1E',
  green:    '#D4F0E0',
  greenText:'#2BA85E',
  blue:     '#DBEAFE',
  blueText: '#3B82F6',

  border: '#EFEFF4',
  shadowColor: 'rgba(90, 69, 255, 0.08)',
};

export const Radius = { card: 24, sheet: 32, pill: 999, input: 16 };

export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const FontFamily = {
  // Usa estas si tienes las fuentes instaladas via expo-font.
  // Si no, fallback a system.
  heading: 'System',
  body: 'System',
};

export const colorToBg: Record<string, { bg: string; text: string }> = {
  lavender: { bg: AppColors.lavender, text: AppColors.primary },
  pink:     { bg: AppColors.pink,     text: AppColors.pinkText },
  peach:    { bg: AppColors.peach,    text: AppColors.peachText },
  yellow:   { bg: AppColors.yellow,   text: AppColors.yellowText },
  green:    { bg: AppColors.green,    text: AppColors.greenText },
  blue:     { bg: AppColors.blue,     text: AppColors.blueText },
};