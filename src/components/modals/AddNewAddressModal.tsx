import ModalComponent from '../ui/ModalComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsAddAddressModalOpen } from '@/lib/redux/modal/modalSlice';
import AddAddressForm from '../forms/AddAddressForm';
import ContainedButton from '../ui/buttons/ContainedButton';
import { Add } from '@mui/icons-material';

export default function AddNewAddressModal() {
  const dispatch = useAppDispatch();
  const { isAddAddressModalOpen } = useAppSelector((state) => state.modal);

  function handleOpenAddAddressModal() {
    dispatch(setIsAddAddressModalOpen(true));
  }

  return (
    <>
      <ContainedButton
        onClick={handleOpenAddAddressModal}
        label="add new address"
        styles={{ width: 'fit-content' }}
        fullWidth={false}
        startIcon={<Add />}
        backgroundColor="blue"
      />
      <ModalComponent isOpen={isAddAddressModalOpen}>
        <AddAddressForm />
      </ModalComponent>
    </>
  );
}
