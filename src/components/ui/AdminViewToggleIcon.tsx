'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { AdminPanelSettings, Store } from '@mui/icons-material';

const iconSize = 'small';

type Props = {
  isAdminView: boolean;
};

export function AdminViewToggleIcon({ isAdminView }: Props) {
  const customColorPalette = useCustomColorPalette();
  const iconColor = customColorPalette.typographyVariants.white;

  return (
    <>
      {isAdminView ? (
        <Store
          fontSize={iconSize}
          sx={{ color: iconColor }}
        />
      ) : (
        <AdminPanelSettings
          fontSize={iconSize}
          sx={{ color: iconColor }}
        />
      )}
    </>
  );
}
