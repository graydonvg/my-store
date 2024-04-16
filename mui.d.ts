import { GetDesignTokensType } from '@/components/theme/ThemeRegistry';
import { Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    custom: GetDesignTokensType['palette']['custom'];
  }

  interface PaletteOptions {
    custom?: GetDesignTokensType['palette']['custom'];
  }
}
