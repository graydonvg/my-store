'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Grid, Typography } from '@mui/material';
import Account from '@/components/accountPage/sections/Account';
import PersonalInformation from '@/components/accountPage/sections/PersonalInformation';
import Addresses from '@/components/accountPage/sections/Addresses';
import AccountPageSectionContainer from '@/components/accountPage/AccountPageSectionContainer';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';

function PageHeaderWithFullName() {
  const { userData } = useAppSelector((state) => state.user);

  if (!userData?.firstName && !userData?.lastName) return null;

  const fullName = `${userData?.firstName} ${userData?.lastName}`;

  return <PageHeaderWithBorder label={fullName} />;
}

function PageHeaderWithEmail() {
  const { userData } = useAppSelector((state) => state.user);

  if (!userData || userData?.firstName) return null;

  return <PageHeaderWithBorder label={userData.email} />;
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
