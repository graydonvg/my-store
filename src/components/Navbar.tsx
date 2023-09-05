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
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { DrawerAnchor } from '@/types';
import AccountMenu from './AccountMenu';

type NavOptionProps = {
  option: NavOptions;
  isDrawerOpen: boolean;
};

function NavOption({ option, isDrawerOpen }: NavOptionProps) {
  return (
    <>
      <Box
        component={'li'}
        className={cn('list-none', {
          'h-10': isDrawerOpen,
        })}>
        <Link
          tabIndex={-1}
          key={option.id}
          href={option.path}
          aria-label={option.label}
          className="no-underline flex items-center md:p-0 h-full">
          <Button
            component={'div'}
            className="text-gray-900 px-4 p-0 md:px-2 md:py-[6px] w-full h-full items-center md:justify-center justify-between flex rounded hover:bg-white">
            <Typography
              fontWeight={500}
              noWrap>
              {option.label}
            </Typography>
            <ArrowForwardIosIcon
              className={cn('text-gray-500', {
                hidden: !isDrawerOpen,
              })}
            />
          </Button>
        </Link>
      </Box>
      <Divider className={cn({ hidden: !isDrawerOpen })} />
    </>
  );
}

function NavOptions({ isDrawerOpen = false }) {
  return (
    <Box
      id="nav-items"
      className={cn('items-center justify-between w-screen md:flex md:w-auto ', {
        hidden: !isDrawerOpen,
      })}>
      <Box
        component={'ul'}
        role="navigation"
        className="flex flex-col pl-0 mt-0 mb-0 md:p-0 md:flex-row md:gap-4">
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
      </Box>
    </Box>
  );
}

const isAdminView = false;
const isAuthUser = false;
const user = {
  // role: 'admin',
  role: 'customer',
};

function Navbar() {
  const isDrawerOpen = useAppSelector((state) => state.drawer.isDrawerOpen);
  const dispatch = useAppDispatch();

  const handleDrawer = (anchor: DrawerAnchor) => {
    dispatch(setIsDrawerOpen({ [anchor]: !isDrawerOpen[anchor] }));
  };

  return (
    <AppBar
      component={'nav'}
      color="inherit"
      elevation={0}
      position="static">
      <Container maxWidth="xl">
        <Toolbar
          className="flex justify-between"
          disableGutters>
          <Box className="flex items-center">
            <ShoppingBasketIcon className="hidden md:flex mr-2" />
            <Typography
              tabIndex={-1}
              variant="h6"
              noWrap
              component="a"
              href="/"
              className="hidden md:flex mr-2 text-gray-900"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
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
              className="text-gray-900"
              onClick={() => handleDrawer('left')}>
              <MenuIcon />
            </IconButton>
            <TemporaryDrawer content={<NavOptions isDrawerOpen={true} />} />
          </Box>
          <Box className="flex md:hidden items-center">
            <ShoppingBasketIcon className="mr-2" />
            <Typography
              tabIndex={-1}
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
          <Box className="flex-1 hidden md:flex md:justify-center gap-8">
            <NavOptions />
          </Box>
          <Box className="flex gap-4 items-center flex-1 justify-end md:grow-0">
            {isAuthUser ? (
              <>
                {user?.role !== 'admin' ? (
                  <Tooltip
                    title="Shopping cart"
                    arrow
                    PopperProps={{
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [0, -2],
                          },
                        },
                      ],
                    }}>
                    <IconButton color="inherit">
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
              <Link href={'/signin'}>
                <Button className="my-4 text-white bg-gray-900 whitespace-nowrap hover:bg-gray-900 md:hover:opacity-95">
                  Sign In
                </Button>
              </Link>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
