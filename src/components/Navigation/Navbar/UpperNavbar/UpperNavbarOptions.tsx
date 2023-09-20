'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, IconButton, List, ListItem, useMediaQuery, useTheme } from '@mui/material';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import ShoppingCart from './ShoppingCart';
import { ThemeIcon } from '@/components/ui/ThemeIcon';
import AccountMenu from '@/components/AccountMenu';
import CustomButton from '@/components/ui/CustomButton';
import { Fragment } from 'react';

const componentOptions = [ShoppingCart, AccountMenu];

export default function UpperNavbarOptions() {
  const dispatch = useAppDispatch();
  const currenUser = useAppSelector((state) => state.user.currentUser);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  function handleModal(content: string) {
    dispatch(setModalContent(content));
    dispatch(setIsModalOpen(true));
  }

  function changeTheme() {
    dispatch(toggleTheme());
  }
  return (
    <Box
      component="nav"
      sx={{ height: 1 }}>
      {currenUser ? (
        <List
          sx={{ display: 'flex', height: '100%' }}
          disablePadding>
          {componentOptions.map((Component, index) => (
            <Fragment key={index}>
              {index === 0 && !isBelowMedium ? (
                <Divider
                  variant="fullWidth"
                  orientation="vertical"
                  sx={{ backgroundColor: 'custom.grey.medium' }}
                />
              ) : null}
              <ListItem disablePadding>
                <Component />
              </ListItem>
              {!isBelowMedium ? (
                <Divider
                  variant="fullWidth"
                  orientation="vertical"
                  sx={{ backgroundColor: 'custom.grey.medium' }}
                />
              ) : null}
            </Fragment>
          ))}
        </List>
      ) : (
        <List sx={{ display: 'flex', gap: 2, height: '100%' }}>
          <ListItem disablePadding>
            <IconButton
              disableRipple
              onClick={changeTheme}
              size="small">
              <ThemeIcon
                size="small"
                color="custom.grey.light"
              />
            </IconButton>
          </ListItem>
          <ListItem disablePadding>
            <CustomButton onClick={() => handleModal('signIn')}>Sign in</CustomButton>
          </ListItem>
        </List>
      )}
    </Box>
  );
}
