import { navOptions } from '@/lib/utils';
import LowerNavbarOption from './LowerNavbarOption';
import Divider from '@mui/material/Divider';
import { Box, List } from '@mui/material';
import { Fragment } from 'react';

export default function LowerNavbarOptions() {
  const lastNavOption = navOptions.length - 1;
  return (
    <Box
      component="nav"
      sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <List
        disablePadding
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {navOptions.map((option, index) => {
          return (
            <Fragment key={option.id}>
              <LowerNavbarOption
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
            </Fragment>
          );
        })}
      </List>
    </Box>
  );
}
