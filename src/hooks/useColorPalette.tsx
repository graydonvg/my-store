import { GetDesignTokensType } from '@/components/theme/ThemeRegistry';
import { useTheme } from '@emotion/react';

export default function useColorPalette() {
  const theme = useTheme() as GetDesignTokensType;

  return theme.palette.custom;
}

export type ColorPaletteReturnType = ReturnType<typeof useColorPalette>;
