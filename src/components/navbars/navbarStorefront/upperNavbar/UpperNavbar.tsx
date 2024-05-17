import UpperNavbarContainer from './UpperNavbarContainer';
import AuthenticatedUpperNavbarOptions from './upperNavbarOptions/authenticatedUpperNavbarOptions/AuthenticatedUpperNavbarOptions';
import UnauthenticatedUpperNavbarOptions from './upperNavbarOptions/unauthenticatedUpperNavbarOptions/UnauthenticatedUpperNavbarOptions';
import fetchUserSessionData from '@/lib/db/queries/fetchUserSessionData';
import DataInitializer from '@/components/DataInitializer';
import UpperNavbarOptions from './upperNavbarOptions/UpperNavbarOptions';

export default async function UpperNavbar() {
  const { authUser, userData, cartItems, wishlistData } = await fetchUserSessionData();

  return (
    <DataInitializer {...{ userData, cartItems, wishlistData }}>
      <UpperNavbarContainer>
        <UpperNavbarOptions>
          {!authUser ? <UnauthenticatedUpperNavbarOptions /> : <AuthenticatedUpperNavbarOptions />}
        </UpperNavbarOptions>
      </UpperNavbarContainer>
    </DataInitializer>
  );
}
