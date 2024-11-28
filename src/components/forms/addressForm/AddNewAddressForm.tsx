import { addNewAddress } from '@/services/users/add';
import { InsertAddressSchema } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import AddressForm from './AddressForm';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { updateUserPersonalInformation } from '@/services/users/update';
import useForm from '@/hooks/use-form';

const defaultFormData = {
  complexOrBuilding: '',
  streetAddress: '',
  suburb: '',
  province: '',
  city: '',
  postalCode: '',
};

export default function AddNewAddressForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);
  const form = useForm(InsertAddressSchema, {
    ...defaultFormData,
    recipientFirstName: userData?.firstName ?? '',
    recipientLastName: userData?.lastName ?? '',
    recipientContactNumber: userData?.contactNumber ?? '',
  });

  async function handleAddNewAddress() {
    dispatch(setIsDialogLoading(true));

    if (!userData?.firstName || !userData?.lastName || !userData?.contactNumber) {
      const { recipientFirstName, recipientLastName, recipientContactNumber } = form.values;

      const userPersonalInfo = {
        ...(userData?.firstName ? {} : { firstName: recipientFirstName }),
        ...(userData?.lastName ? {} : { lastName: recipientLastName }),
        ...(userData?.contactNumber ? {} : { contactNumber: recipientContactNumber }),
      };

      await updateUserPersonalInformation(userPersonalInfo);
    }

    const { success, message } = await addNewAddress(form.values);

    if (success) {
      router.refresh();
      dispatch(closeDialog());
      form.reset();
      toast.success(message);
    } else {
      toast.error(message);
    }

    dispatch(setIsDialogLoading(false));
  }

  return (
    <AddressForm
      headerText="Add address"
      formValues={form.values}
      formErrors={form.errors}
      onChange={form.handleChange}
      onSubmit={form.handleSubmit(handleAddNewAddress)}
    />
  );
}
