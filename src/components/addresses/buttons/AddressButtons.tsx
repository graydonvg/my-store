import { Box, Divider } from '@mui/material';
import { useAppSelector } from '@/lib/redux/hooks';
import AddressLoader from '../AddressLoader';
import UpdateAddressDialogButton from './UpdateAddressDialogButton';
import UpdateAddressDialog from '../../dialogs/UpdateAddressDialog';
import DeleteAddressButton from './DeleteAddressButton';

type Props = {
  addressId: string;
};

export default function AddressButtons({ addressId }: Props) {
  const addressToDeleteId = useAppSelector((state) => state.addresses.addressToDeleteId);

  return (
    <>
      {addressToDeleteId === addressId ? <AddressLoader isLoading={addressToDeleteId === addressId} /> : null}
      {addressToDeleteId !== addressId ? (
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 0, borderBottom: 0 }}>
          <UpdateAddressDialogButton addressId={addressId} />
          <UpdateAddressDialog />
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: (theme) => theme.palette.custom.border }}
          />
          <DeleteAddressButton addressId={addressId} />
        </Box>
      ) : null}
    </>
  );
}
