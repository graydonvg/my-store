import { useRouter } from 'next/navigation';
import AddressButton from './AddressButton';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setAddressToDeleteId } from '@/lib/redux/features/addresses/addressesSlice';
import { deleteAddress } from '@/services/users/delete';
import { toast } from 'react-toastify';

type Props = {
  addressId: string;
};

export default function DeleteAddressButton({ addressId }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();

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
    <AddressButton
      label="delete"
      onClick={deleteAddressById}
    />
  );
}
