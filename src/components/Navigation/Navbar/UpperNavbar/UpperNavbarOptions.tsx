'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, IconButton, List, ListItem } from '@mui/material';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import ShoppingCart from './ShoppingCart';
import { ThemeIcon } from '@/components/ui/ThemeIcon';
import AccountMenu from '@/components/AccountMenu';
import CustomButton from '@/components/ui/CustomButton';

const componentOptions = [ShoppingCart, AccountMenu];

export default function UpperNavbarOptions() {
  const dispatch = useAppDispatch();
  const currenUser = useAppSelector((state) => state.user.currentUser);

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
            <ListItem
              key={index}
              disablePadding
              sx={{
                borderLeft: index === 0 ? '1px solid' : null,
                borderRight: '1px solid',
                borderColor: 'custom.grey.medium',
              }}>
              <Component />
            </ListItem>
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
