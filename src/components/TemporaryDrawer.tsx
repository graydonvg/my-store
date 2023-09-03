import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

type TemporaryDrawerProps = {
  drawerAnchor: string;
  isOpen: boolean;
  content: JSX.Element;
};

export default function TemporaryDrawer({ drawerAnchor, isOpen, content }: TemporaryDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  React.useEffect(() => {
    setIsDrawerOpen({ ...isDrawerOpen, [drawerAnchor]: isOpen });
  }, [drawerAnchor, isOpen]);

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsDrawerOpen({ ...isDrawerOpen, [anchor]: open });
  };

  return (
    <>
      {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            className="md:hidden"
            elevation={1}
            hideBackdrop={true}
            anchor={anchor}
            open={isDrawerOpen[anchor]}
            onClose={toggleDrawer(anchor, false)}>
            <div className="flex justify-between items-center">
              <h2 className="text-md pl-4">Menu</h2>
              <CloseIcon
                className="pr-4 cursor-pointer"
                onClick={toggleDrawer(anchor, false)}
              />
            </div>
            {content}
          </Drawer>
        </React.Fragment>
      ))}
    </>
  );
}
