import UpperNavbarContainer from './UpperNavbarContainer';
import AuthenticatedUpperNavbarOptions from './upperNavbarOptions/authenticatedUpperNavbarOptions/AuthenticatedUpperNavbarOptions';
import UnauthenticatedUpperNavbarOptions from './upperNavbarOptions/unauthenticatedUpperNavbarOptions/UnauthenticatedUpperNavbarOptions';
import fetchUserSessionData from '@/services/db/queries/fetchUserSessionData';
import DataInitializer from '@/components/DataInitializer';
import UpperNavbarOptions from './upperNavbarOptions/UpperNavbarOptions';
import { Suspense } from 'react';
import { Box } from '@mui/material';

export default function UpperNavbar() {
  return (
    <UpperNavbarContainer>
      <UpperNavbarOptions>
        <Suspense fallback={<Box sx={{ width: '60px' }} />}>
          <UserSessionNavOptions />
        </Suspense>
      </UpperNavbarOptions>
    </UpperNavbarContainer>
  );
}

async function UserSessionNavOptions() {
  const { authUser, userData, cartItems, wishlistData } = await fetchUserSessionData();

  return (
    <DataInitializer {...{ userData, cartItems, wishlistData }}>
      {!authUser ? <UnauthenticatedUpperNavbarOptions /> : <AuthenticatedUpperNavbarOptions />}
    </DataInitializer>
  );
}
