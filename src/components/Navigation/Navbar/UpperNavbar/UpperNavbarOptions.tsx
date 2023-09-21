'use client';
'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, IconButton, List, ListItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import ShoppingCartButton from './ShoppingCartButton';
import { ThemeIcon } from '@/components/ui/ThemeIcon';
import AccountMenu from '@/components/AccountMenu';
import { ComponentType, Fragment } from 'react';

export default function UpperNavbarOptions() {
  const dispatch = useAppDispatch();
  const currenUser = useAppSelector(function (state) {
    return state.user.currentUser;
  });
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  function changeTheme() {
    dispatch(toggleTheme());
  }

  function handleModal(content: string) {
    dispatch(setModalContent(content));
    dispatch(setIsModalOpen(true));
  }

  function renderDivider() {
    return (
      <Divider
        variant="fullWidth"
        orientation="vertical"
        sx={{ backgroundColor: 'custom.grey.medium' }}
      />
    );
  }

  function renderComponent(Component: ComponentType, index: number) {
    return (
      <Fragment key={index}>
        {index === 0 && !isBelowMedium && renderDivider()}
        <ListItem disablePadding>
          <Component />
        </ListItem>
        {!isBelowMedium && renderDivider()}
      </Fragment>
    );
  }

  function renderButton(label: string, onClick: () => void) {
    return (
      <ListItem disablePadding>
        <Typography
          variant="button"
          sx={{ color: 'custom.grey.light', cursor: 'pointer', whiteSpace: 'nowrap' }}
          onClick={onClick}>
          {label}
        </Typography>
      </ListItem>
    );
  }

  return (
    <Box
      component="nav"
      sx={{ height: 1 }}>
      {currenUser ? (
        <List
          sx={{ display: 'flex', height: '100%' }}
          disablePadding>
          {[ShoppingCartButton, AccountMenu].map(function (Component, index) {
            return renderComponent(Component, index);
          })}
        </List>
      ) : (
        <List sx={{ display: 'flex', gap: 2, height: '100%' }}>
          {!isBelowMedium && (
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
          )}
          {!isBelowMedium ? renderDivider() : null}
          {renderButton('Sign in', () => handleModal('signIn'))}
          {!isBelowMedium ? renderDivider() : null}
          {!isBelowSmall ? renderButton('Sign Up', () => handleModal('signUp')) : null}
        </List>
      )}
    </Box>
  );
}
