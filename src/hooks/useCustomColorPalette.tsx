import { GetDesignTokensType } from '@/components/theme/ThemeRegistry';
import { useTheme } from '@emotion/react';

export default function useCustomColorPalette() {
  const theme = useTheme() as GetDesignTokensType;

  return theme.palette.custom;
}

export type CustomColorPaletteReturnType = ReturnType<typeof useCustomColorPalette>;
