import { navOptions } from '@/lib/utils';
import LowerNavbarDropdownMenu from './LowerNavbarDropdownMenu';
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
            <LowerNavbarDropdownMenu
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
