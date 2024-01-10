'use client';

import { Box, Checkbox, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { PulseLoader } from 'react-spinners';
import useColorPalette from '@/hooks/useColorPalette';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useState } from 'react';
import { setAddressFormData } from '@/lib/redux/addressForm/addressFormSlice';
import { AddressType, UpdateAddressTypeStore } from '@/types';
import { setIsAddressDialogOpen } from '@/lib/redux/dialog/dialogSlice';
import { deleteAddress } from '@/services/users/delete-address';
import { setUserData } from '@/lib/redux/user/userSlice';
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
  const userData = useAppSelector((state) => state.user.userData);
  const colorPalette = useColorPalette();
  const fullName = `${userData?.firstName} ${userData?.lastName}`;

  if (!show) return null;

  function handleSelectShippingAddress() {
    const { addressId, userId, ...restOfAddressData } = address;
    const shippingDetailsArray = Object.values({
      fullName: fullName,
      contactNumber: userData?.contactNumber,
      ...restOfAddressData,
    });
    const filteredShippingDetailsArray = shippingDetailsArray.filter((value) => value !== '' && value !== null);
    const shippingDetailsString = filteredShippingDetailsArray.join(',');

    if (checkoutData.selectedAddressId === address.addressId) {
      dispatch(setCheckoutData({ selectedAddressId: null, shippingDetails: null }));
    } else {
      dispatch(
        setCheckoutData({
          selectedAddressId: addressId,
          shippingDetails: shippingDetailsString,
        })
      );
    }
  }

  return (
    <TableCell sx={{ display: 'flex', borderBottom: `1px solid ${colorPalette.border}`, paddingRight: 0 }}>
      <Checkbox
        checked={checkoutData.selectedAddressId === address.addressId}
        onChange={handleSelectShippingAddress}
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
  const colorPalette = useColorPalette();

  return (
    <Typography
      onClick={onClick}
      component="button"
      textTransform="uppercase"
      lineHeight={1}
      fontWeight={700}
      sx={{
        paddingRight: hasBorderRight ? 1 : 0,
        borderRight: hasBorderRight ? `1px solid ${colorPalette.border}` : null,
        color: colorPalette.primary.dark,
        '@media (hover: hover)': {
          '&:hover': {
            color: colorPalette.primary.light,
            textDecoration: 'underline',
            textDecorationColor: colorPalette.primary.light,
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
  const colorPalette = useColorPalette();

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
        color={colorPalette.typography}
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
  const { userData } = useAppSelector((state) => state.user);
  const colorPalette = useColorPalette();
  const [isDeleting, setIsDeleting] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<{ id: string } | null>(null);
  const pathname = usePathname();
  const isShippingView = pathname.includes('/checkout/shipping');

  if (!show) return null;

  async function handleSetAddressToEdit(addressId: string) {
    const addressToEdit = userData?.addresses.filter((address) => address.addressId === addressId)[0];

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
        const updatedAddresses = userData?.addresses.filter((address) => address.addressId !== addressId);
        dispatch(
          setUserData({
            ...userData!,
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
      {userData?.addresses?.map((address, index) => (
        <TableRow
          key={index}
          sx={{
            display: 'flex',
            '&:last-child td': { border: 0 },
          }}>
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
              borderBottom: `1px solid ${colorPalette.border}`,
              width: 1,
            }}>
            <Box>
              <Typography fontSize={16}>
                {address.complexOrBuilding ? `${address.complexOrBuilding},` : null}

                {`${address.streetAddress}, ${address.suburb}, ${address.province},
											${address.city}, ${address.postalCode}`}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography
                  color={colorPalette.typographyVariants.grey}
                  fontSize={14}
                  fontWeight={500}>
                  Recipient:
                </Typography>
                <Typography
                  color={colorPalette.typographyVariants.grey}
                  fontSize={14}>
                  {`${address.recipientFirstName} ${address.recipientLastName}, ${address.recipientContactNumber}`}
                </Typography>
              </Box>
            </Box>
            <Loader showLoader={isDeleting && addressToDelete?.id === address.addressId} />
            <AddressButtons
              show={!isDeleting && addressToDelete?.id !== address.addressId}
              editAddress={() => handleSetAddressToEdit(address.addressId!)}
              deleteAddress={() => handleDeleteAddress(address.addressId!)}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function Addresses() {
  const { userData } = useAppSelector((state) => state.user);
  const colorPalette = useColorPalette();

  return (
    <Box>
      <TableContainer sx={{ marginBottom: 2, border: `1px solid ${colorPalette.border}`, borderRadius: borderRadius }}>
        <Table>
          <TableBody>
            <NoAddressFound show={!!userData?.addresses && userData?.addresses.length === 0} />
            <AddressData show={!!userData?.addresses && userData?.addresses.length > 0} />
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <AddNewAddressDialog />
      </Box>
    </Box>
  );
}
