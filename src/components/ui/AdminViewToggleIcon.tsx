'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { AdminPanelSettings, Store } from '@mui/icons-material';

const iconSize = 'small';

type AdminViewToggleIconProps = {
  isAdminView: boolean;
};

export function AdminViewToggleIcon({ isAdminView }: AdminViewToggleIconProps) {
  const color = useCustomColorPalette();
  const iconColor = color.grey.light;
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
