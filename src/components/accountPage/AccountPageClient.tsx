'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Grid } from '@mui/material';
import Account from '@/components/accountPage/sections/account/Account';
import PersonalInformation from '@/components/accountPage/sections/PersonalInformation';
import Addresses from '@/components/addresses/Addresses';
import SectionContainerAccountPage from '@/components/accountPage/SectionContainerAccountPage';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { useEffect } from 'react';
import { setAddresses } from '@/lib/redux/features/addresses/addressesSlice';
import { AddressType } from '@/types';

type Props = {
  addresses: AddressType[] | null;
};

export default function AccountPageClient({ addresses }: Props) {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.data);

  useEffect(() => {
    dispatch(setAddresses(addresses));
  }, [addresses, dispatch]);

  return (
    <Box>
      {userData && (userData.firstName || userData.lastName) ? (
        <PageHeaderWithBorder label={`${userData.firstName} ${userData.lastName}`} />
      ) : null}

      {userData && !userData.firstName && !userData.lastName ? <PageHeaderWithBorder label={userData.email} /> : null}
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
            <SectionContainerAccountPage title="Account">
              <Account />
            </SectionContainerAccountPage>
            <SectionContainerAccountPage title="Personal information">
              <PersonalInformation />
            </SectionContainerAccountPage>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}>
          <SectionContainerAccountPage title="Addresses">
            <Addresses />
          </SectionContainerAccountPage>
        </Grid>
      </Grid>
    </Box>
  );
}