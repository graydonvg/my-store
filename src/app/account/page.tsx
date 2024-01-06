'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Grid, Typography } from '@mui/material';
import Account from '@/components/accountPage/sections/Account';
import PersonalInformation from '@/components/accountPage/sections/PersonalInformation';
import Addresses from '@/components/accountPage/sections/Addresses';
import AccountPageSectionContainer from '@/components/accountPage/AccountPageSectionContainer';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';

function PageHeaderWithFullName() {
  const { currentUser } = useAppSelector((state) => state.user);

  if (!currentUser?.firstName && !currentUser?.lastName) return null;

  const fullName = `${currentUser?.firstName} ${currentUser?.lastName}`;

  return <PageHeaderWithBorder label={fullName} />;
}

function PageHeaderWithEmail() {
  const { currentUser } = useAppSelector((state) => state.user);

  if (!currentUser || currentUser?.firstName) return null;

  return <PageHeaderWithBorder label={currentUser.email} />;
}

export default function AccountPage() {
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
      <PageHeaderWithFullName />
      <PageHeaderWithEmail />
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
