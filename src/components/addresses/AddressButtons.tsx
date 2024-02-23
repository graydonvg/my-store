import { Box, Divider } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import AddressButton from './AddressButton';
import { deleteAddress } from '@/services/users/delete';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import AddressLoader from './AddressLoader';
import { setAddressToDeleteId } from '@/lib/redux/slices/accountSlice';
import UpdateAddressDialog from '../dialogs/addressDialog/UpdateAddressDialog';

type Props = {
  addressId: string;
};

export default function AddressButtons({ addressId }: Props) {
  const colorPalette = useColorPalette();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addressToDeleteId = useAppSelector((state) => state.account.addressToDeleteId);

  async function handleDeleteAddress() {
    dispatch(setAddressToDeleteId(addressId));

    const { success, message } = await deleteAddress(addressId);

    if (success === true) {
      router.refresh();
      toast.success(message);
    } else {
      toast.error(message);
    }
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
            sx={{ borderColor: colorPalette.border }}
          />
          <AddressButton
            label="delete"
            onClick={handleDeleteAddress}
          />
        </Box>
      ) : null}
    </>
  );
}
