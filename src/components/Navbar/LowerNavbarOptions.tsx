import { navOptions } from '@/lib/utils';
import LowerNavbarOptionMenu from './LowerNavbarOptionMenu';
import Divider from '@mui/material/Divider';
import { Box } from '@mui/material';

export default function LowerNavbarOptions() {
  const lastNavOption = navOptions.length - 1;
  return (
    <Box
      component="nav"
      sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {navOptions.map((option, index) => {
        return (
          <>
            <LowerNavbarOptionMenu
              key={option.id}
              label={option.label}
              path={option.path}
            />
            {index !== lastNavOption ? (
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
              />
            ) : null}
          </>
        );
      })}
    </Box>
  );
}
