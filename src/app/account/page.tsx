'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import Account from '@/components/accountPage/sections/Account';
import PersonalInformation from '@/components/accountPage/sections/PersonalInformation';
import Addresses from '@/components/accountPage/sections/Addresses';
import AccountPageSectionContainer from '@/components/accountPage/AccountPageSectionContainer';

export default function AccountPage() {
  const { currentUser } = useAppSelector((state) => state.user);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;

  function renderUserInfo(value: string) {
    return (
      <Typography
        component="span"
        fontSize={16}>
        {value}
      </Typography>
    );
  }

  return (
    <Box>
      <Box
        component="header"
        sx={{ marginBottom: 3, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
        <Typography
          component="h1"
          fontSize={{ xs: 26, sm: 30 }}
          fontWeight={500}
          sx={{ paddingY: 1, textAlign: 'center' }}>
          {currentUser?.first_name && currentUser?.last_name
            ? `${currentUser?.first_name} ${currentUser?.last_name}`
            : currentUser?.email}
        </Typography>
      </Box>
      <Grid
        container
        rowGap={2}>
        <Grid
          item
          xs={12}
          md={6}>
          <Box
            sx={{
              maxWidth: { xs: 'unset', md: '75%' },
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
            <AccountPageSectionContainer title="Account">
              <Account renderUserInfo={renderUserInfo} />
            </AccountPageSectionContainer>
            <AccountPageSectionContainer title="Personal information">
              <PersonalInformation renderUserInfo={renderUserInfo} />
            </AccountPageSectionContainer>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}>
          <AccountPageSectionContainer title="Addresses">
            <Addresses />
          </AccountPageSectionContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
