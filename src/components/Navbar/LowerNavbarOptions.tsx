import { navOptions } from '@/lib/utils';
import LowerNavbarOptionMenu from './LowerNavbarOptionMenu';
import Divider from '@mui/material/Divider';

export default function LowerNavbarOptions() {
  const lastNavOption = navOptions.length - 1;
  return (
    <>
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
    </>
  );
}
