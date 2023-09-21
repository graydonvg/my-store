'use client';

import { AdminPanelSettings, Store } from '@mui/icons-material';

const iconSize = 'small';
const iconStyles = { color: 'custom.grey.light' };

type AdminViewToggleProps = {
  isAdminView: boolean;
};

export function AdminViewToggle({ isAdminView }: AdminViewToggleProps) {
  return (
    <>
      {isAdminView ? (
        <Store
          fontSize={iconSize}
          sx={iconStyles}
        />
      ) : (
        <AdminPanelSettings
          fontSize={iconSize}
          sx={iconStyles}
        />
      )}
    </>
  );
}
