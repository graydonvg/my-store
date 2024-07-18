import UpperNavbarContainer from './UpperNavbarContainer';
import AuthenticatedUpperNavbarOptions from './upperNavbarOptions/authenticatedUpperNavbarOptions/AuthenticatedUpperNavbarOptions';
import UnauthenticatedUpperNavbarOptions from './upperNavbarOptions/unauthenticatedUpperNavbarOptions/UnauthenticatedUpperNavbarOptions';
import fetchUserSessionData from '@/lib/db/queries/fetchUserSessionData';
import DataInitializer from '@/components/DataInitializer';
import UpperNavbarOptions from './upperNavbarOptions/UpperNavbarOptions';
import { Suspense } from 'react';

export default function UpperNavbar() {
  return (
    <UpperNavbarContainer>
      <UpperNavbarOptions>
        <Suspense fallback={null}>
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
