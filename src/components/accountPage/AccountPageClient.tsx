'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Grid } from '@mui/material';
import AccountSection from '@/components/accountPage/sections/accountSection/Account';
import PersonalInformationSection from '@/components/accountPage/sections/PersonalInformationSection';
import Addresses from '@/components/addresses/Addresses';
import SectionWrapperAccountPage from '@/components/accountPage/SectionWrapperAccountPage';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { useEffect } from 'react';
import { setAddresses } from '@/lib/redux/features/addresses/addressesSlice';
import { AddressType } from '@/types';
import { setAccountFieldToEdit } from '@/lib/redux/features/account/accountSlice';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';

type Props = {
  addresses: AddressType[] | null;
};

export default function AccountPageClient({ addresses }: Props) {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);

  useEffect(() => {
    dispatch(setAddresses(addresses));
    dispatch(setAccountFieldToEdit(null));
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
            <SectionWrapperAccountPage title="Account">
              <AccountSection />
            </SectionWrapperAccountPage>
            <SectionWrapperAccountPage title="Personal information">
              <PersonalInformationSection />
            </SectionWrapperAccountPage>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}>
          <SectionWrapperAccountPage title="Addresses">
            <Addresses />
          </SectionWrapperAccountPage>
        </Grid>
      </Grid>
    </Box>
  );
}
