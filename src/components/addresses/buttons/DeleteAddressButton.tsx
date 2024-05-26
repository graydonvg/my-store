import { useRouter } from 'next/navigation';
import AddressButton from './AddressButton';
import { deleteAddress } from '@/services/users/delete';
import { toast } from 'react-toastify';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  addressId: number;
  setAddressToDeleteId: Dispatch<SetStateAction<number | null>>;
};

export default function DeleteAddressButton({ addressId, setAddressToDeleteId }: Props) {
  const router = useRouter();

  async function deleteAddressById() {
    setAddressToDeleteId(addressId);

    const { success, message } = await deleteAddress(addressId);

    if (success === true) {
      router.refresh();
      toast.success(message);
    } else {
      toast.error(message);
    }

    setAddressToDeleteId(null);
  }

  return (
    <AddressButton
      label="delete"
      onClick={deleteAddressById}
    />
  );
}
