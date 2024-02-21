import useColorPalette from '@/hooks/useColorPalette';
import { AdminPanelSettings, Store } from '@mui/icons-material';

const iconSize = 'small';

type Props = {
  isAdminView: boolean;
};

export function AdminViewToggleIcon({ isAdminView }: Props) {
  const colorPalette = useColorPalette();
  const iconColor = colorPalette.typographyVariants.white;

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
