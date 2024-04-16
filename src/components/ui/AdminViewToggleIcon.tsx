import { AdminPanelSettings, Store } from '@mui/icons-material';
import { useTheme } from '@mui/material';

const iconSize = 'small';

type Props = {
  isAdminView: boolean;
};

export function AdminViewToggleIcon({ isAdminView }: Props) {
  const theme = useTheme();
  const iconColor = theme.palette.custom.typographyVariants.white;

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
