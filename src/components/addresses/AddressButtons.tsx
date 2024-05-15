import { Box, Divider } from '@mui/material';
import AddressButton from './AddressButton';
import { deleteAddress } from '@/services/users/delete';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import AddressLoader from './AddressLoader';
import UpdateAddressDialog from '../dialogs/addressDialog/UpdateAddressDialog';
import { setAddressToDeleteId } from '@/lib/redux/slices/addressesSlice';

type Props = {
  addressId: string;
};

export default function AddressButtons({ addressId }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addressToDeleteId = useAppSelector((state) => state.addresses.addressToDeleteId);

  async function deleteAddressById() {
    dispatch(setAddressToDeleteId(addressId));

    const { success, message } = await deleteAddress(addressId);

    if (success === true) {
      router.refresh();
      toast.success(message);
    } else {
      toast.error(message);
    }

    dispatch(setAddressToDeleteId(null));
  }

  return (
    <>
      {addressToDeleteId === addressId ? <AddressLoader isLoading={addressToDeleteId === addressId} /> : null}
      {addressToDeleteId !== addressId ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: 0, borderBottom: 0 }}>
          <UpdateAddressDialog addressId={addressId} />
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: (theme) => theme.palette.custom.border }}
          />
          <AddressButton
            label="delete"
            onClick={deleteAddressById}
          />
        </Box>
      ) : null}
    </>
  );
}
