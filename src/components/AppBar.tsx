'use client';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { NavOptions, adminNavOptions, cn, navOptions } from '@/lib/utils';
import TemporaryDrawer from './TemporaryDrawer';
import Link from 'next/link';
import { Divider } from '@mui/material';
import { useState } from 'react';
import AccountMenu from './AccountMenu';
import PrimaryButton from './Button';

type NavOptionProps = {
  option: NavOptions;
  isDrawerOpen: boolean;
};

function NavOption({ option, isDrawerOpen }: NavOptionProps) {
  return (
    <li
      className={cn('list-none', {
        'h-12 px-4': isDrawerOpen,
      })}>
      <div className="md:p-0 h-full">
        <Link
          href={option.path}
          aria-label={option.label}
          className="h-full focus-visible:ring-offset-8 flex items-center justify-between no-underline text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-gray-200 dark:focus-visible:ring-gray-600 rounded">
          {option.label}
          <ArrowForwardIosIcon
            className={cn('text-gray-500', {
              hidden: !isDrawerOpen,
            })}
          />
        </Link>
        <Divider className={cn({ hidden: !isDrawerOpen })} />
      </div>
    </li>
  );
}

function NavOptions({ isDrawerOpen = false }) {
  return (
    <div
      id="nav-items"
      className={cn('items-center justify-between w-screen md:flex md:w-auto ', {
        hidden: !isDrawerOpen,
      })}>
      <ul
        role="navigation"
        className="flex flex-col pl-0 mt-0 mb-0 md:p-0 md:flex-row md:space-x-8">
        {user.role === 'admin'
          ? adminNavOptions
              .filter((option) => (!isDrawerOpen ? !option.temporaryDrawerOnly : option))
              .map((option) => (
                <NavOption
                  key={option.id}
                  option={option}
                  isDrawerOpen={isDrawerOpen}
                />
              ))
          : navOptions
              .filter((option) => (!isDrawerOpen ? !option.temporaryDrawerOnly : option))
              .map((option) => (
                <NavOption
                  key={option.id}
                  option={option}
                  isDrawerOpen={isDrawerOpen}
                />
              ))}
      </ul>
    </div>
  );
}

const isAdminView = false;
const isAuthUser = false;
const user = {
  // role: 'admin',
  role: 'customer',
};

function ResponsiveAppBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const handleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <AppBar
      elevation={0}
      position="static">
      <Container maxWidth="xl">
        <Toolbar
          className="flex justify-between"
          disableGutters>
          <Box className="flex items-center">
            <ShoppingBasketIcon className="hidden md:flex mr-2" />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              className="hidden md:flex mr-2"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>
              MyStore
            </Typography>
          </Box>
          <Box className="flex md:hidden flex-1">
            <IconButton
              size="large"
              aria-label="navigation drawer"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawer}
              color="inherit">
              <MenuIcon />
            </IconButton>
            <TemporaryDrawer
              drawerAnchor={'left'}
              isOpen={isDrawerOpen}
              content={<NavOptions isDrawerOpen={true} />}
            />
          </Box>
          <Box className="flex md:hidden flex-1 items-center">
            <ShoppingBasketIcon className="mr-2" />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>
              MyStore
            </Typography>
          </Box>
          <Box className="flex-1 hidden md:flex md:justify-center">
            {navOptions.map((option) => (
              <Button
                key={option.id}
                onClick={() => setIsDrawerOpen(false)}
                sx={{ my: 2, color: 'white', display: 'block', whiteSpace: 'nowrap' }}>
                {option.label}
              </Button>
            ))}
          </Box>
          <Box className="flex gap-4 items-center grow-0">
            {isAuthUser ? (
              <>
                {user?.role !== 'admin' ? (
                  <Tooltip title="Shopping cart">
                    <IconButton className="text-white">
                      <ShoppingCartIcon aria-label="Shopping cart" />
                    </IconButton>
                  </Tooltip>
                ) : null}
                <AccountMenu
                  user={user}
                  isAdminView={isAdminView}
                />
              </>
            ) : (
              <Button sx={{ my: 2, color: 'white', display: 'block', whiteSpace: 'nowrap' }}>Sign In</Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
