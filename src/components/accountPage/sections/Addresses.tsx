'use client';

import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { PulseLoader } from 'react-spinners';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useState } from 'react';
import { setAddressFormData } from '@/lib/redux/addressForm/addressFormSlice';
import { AddressType, UpdateAddressTypeStore } from '@/types';
import { setIsAddressDialogOpen } from '@/lib/redux/dialog/dialogSlice';
import { deleteAddress } from '@/services/users/delete-address';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { toast } from 'react-toastify';
import AddNewAddressDialog from '../../dialogs/AddNewAddressDialog';
import { setCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { borderRadius } from '@/constants/styles';

type NoAddressFoundProps = {
  show: boolean;
};

function NoAddressFound({ show }: NoAddressFoundProps) {
  if (!show) return null;

  return (
    <TableRow>
      <TableCell sx={{ padding: 2, borderBottom: 0 }}>
        <Typography fontSize={16}>No address found</Typography>
      </TableCell>
    </TableRow>
  );
}

type SelectShippingAddressCheckboxProps = {
  show: boolean;
  address: AddressType;
};

function SelectShippingAddressCheckbox({ show, address }: SelectShippingAddressCheckboxProps) {
  const dispatch = useAppDispatch();
  const checkoutData = useAppSelector((state) => state.checkoutData);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;
  const fullName = `${currentUser?.first_name} ${currentUser?.last_name}`;

  if (!show) return null;

  function handleSelectShippingAddress(address: AddressType) {
    const { address_id, ...restOfAddressData } = address;
    if (checkoutData.selectedAddressId === address.address_id) {
      dispatch(setCheckoutData({ selectedAddressId: null, shippingDetails: null }));
    } else {
      dispatch(
        setCheckoutData({
          selectedAddressId: address_id,
          shippingDetails: { ...restOfAddressData, full_name: fullName, contact_number: currentUser?.contact_number! },
        })
      );
    }
  }

  return (
    <TableCell sx={{ display: 'flex', borderBottom: `1px solid ${borderColor}`, paddingRight: 0 }}>
      <Checkbox
        checked={checkoutData.selectedAddressId === address.address_id}
        onChange={() => handleSelectShippingAddress(address)}
        disableRipple
        sx={{ padding: 0 }}
      />
    </TableCell>
  );
}

type AddressButtonProps = {
  label: string;
  hasBorderRight: boolean;
  onClick: () => Promise<void>;
};

function AddressButton({ label, hasBorderRight, onClick }: AddressButtonProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;

  return (
    <Typography
      onClick={onClick}
      component="button"
      textTransform="uppercase"
      lineHeight={1}
      fontWeight={700}
      sx={{
        paddingRight: hasBorderRight ? 1 : 0,
        borderRight: hasBorderRight ? `1px solid ${borderColor}` : null,
        color: customColorPalette.blue.dark,
        '@media (hover: hover)': {
          '&:hover': {
            color: customColorPalette.blue.light,
            textDecoration: 'underline',
            textDecorationColor: customColorPalette.blue.light,
            textDecorationThickness: 1,
            textUnderlineOffset: 2,
            cursor: 'pointer',
          },
        },
      }}>
      {label}
    </Typography>
  );
}

type AddressButtonsProps = {
  show: boolean;
  editAddress: () => Promise<void>;
  deleteAddress: () => Promise<void>;
};

function AddressButtons({ show, editAddress, deleteAddress }: AddressButtonsProps) {
  if (!show) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: 0, borderBottom: 0 }}>
      <AddressButton
        label="edit"
        onClick={editAddress}
        hasBorderRight={true}
      />
      <AddressButton
        label="delete"
        onClick={deleteAddress}
        hasBorderRight={false}
      />
    </Box>
  );
}

type LoaderProps = {
  showLoader: boolean;
};

function Loader({ showLoader }: LoaderProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const loaderColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  if (!showLoader) return null;

  return (
    <Box
      sx={{
        minWidth: '108.16px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 0,
        borderBottom: 0,
      }}>
      <PulseLoader
        loading={showLoader}
        color={loaderColor}
        size={10}
      />
    </Box>
  );
}

type AddressDataProps = {
  show: boolean;
};

function AddressData({ show }: AddressDataProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const customColorPalette = useCustomColorPalette();
  const [isDeleting, setIsDeleting] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<{ id: string } | null>(null);
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;
  const pathname = usePathname();
  const isShippingView = pathname.includes('/checkout/shipping');

  if (!show) return null;

  async function handleSetAddressToEdit(addressId: string) {
    const addressToEdit = currentUser?.addresses.filter((address) => address.address_id === addressId)[0];

    if (!!addressToEdit) {
      dispatch(setAddressFormData(addressToEdit as UpdateAddressTypeStore));
      dispatch(setIsAddressDialogOpen(true));
    }
  }

  async function handleDeleteAddress(addressId: string) {
    setAddressToDelete({ id: addressId });
    setIsDeleting(true);

    try {
      const { success, message } = await deleteAddress(addressId);

      if (success === true) {
        const updatedAddresses = currentUser?.addresses.filter((address) => address.address_id !== addressId);
        dispatch(
          setCurrentUser({
            ...currentUser!,
            addresses: updatedAddresses!,
          })
        );

        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to delete address. Please try again later.');
    } finally {
      router.refresh();
      setAddressToDelete(null);
      setIsDeleting(false);
    }
  }

  return (
    <>
      {currentUser?.addresses?.map((address, index) => (
        <TableRow
          key={index}
          sx={{ display: 'flex', '&:last-child td': { border: 0 } }}>
          <SelectShippingAddressCheckbox
            show={isShippingView}
            address={address}
          />
          <TableCell
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              padding: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              rowGap: 2,
              columnGap: 4,
              borderBottom: `1px solid ${borderColor}`,
              width: 1,
            }}>
            <Typography fontSize={16}>
              {address.complex_or_building ? `${address.complex_or_building},` : null}

              {`${address.street_address}, ${address.suburb}, ${address.province},
											${address.city}, ${address.postal_code}`}
            </Typography>
            <Loader showLoader={isDeleting && addressToDelete?.id === address.address_id} />
            <AddressButtons
              show={!isDeleting && addressToDelete?.id !== address.address_id}
              editAddress={() => handleSetAddressToEdit(address.address_id)}
              deleteAddress={() => handleDeleteAddress(address.address_id)}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function Addresses() {
  const { currentUser } = useAppSelector((state) => state.user);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;

  return (
    <Box>
      <TableContainer sx={{ marginBottom: 2, border: `1px solid ${borderColor}`, borderRadius: borderRadius }}>
        <Table>
          <TableBody>
            <NoAddressFound show={!!currentUser?.addresses && currentUser?.addresses.length === 0} />
            <AddressData show={!!currentUser?.addresses && currentUser?.addresses.length > 0} />
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <AddNewAddressDialog />
      </Box>
    </Box>
  );
}
