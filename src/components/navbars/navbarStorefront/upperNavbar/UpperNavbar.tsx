import UpperNavbarContainer from './UpperNavbarContainer';
import UpperNavbarOptionsClient from './upperNavbarOptions/UpperNavbarOptionsClient';
import UpperNavbarOptionsServer from './upperNavbarOptions/UpperNavbarOptionsServer';

export default function UpperNavbar() {
  return (
    <UpperNavbarContainer>
      <UpperNavbarOptionsClient>
        <UpperNavbarOptionsServer />
      </UpperNavbarOptionsClient>
    </UpperNavbarContainer>
  );
}
