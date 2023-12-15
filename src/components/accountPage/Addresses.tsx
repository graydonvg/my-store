'use client';

import { Box, Typography, useTheme } from '@mui/material';
import AccountPageSectionContainer from './AccountPageSectionContainer';
import { PulseLoader } from 'react-spinners';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useState } from 'react';
import { setAddressFormData } from '@/lib/redux/addressForm/addressFormSlice';
import { UpdateAddressTypeStore } from '@/types';
import { setIsAddressDialogOpen } from '@/lib/redux/dialog/dialogSlice';
import { deleteAddress } from '@/services/users/delete-address';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { toast } from 'react-toastify';
import AddNewAddressDialog from '../dialogs/AddNewAddressDialog';

export default function Addresses() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const customColorPalette = useCustomColorPalette();
  const [isDeleting, setIsDeleting] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<{ id: string } | null>(null);
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;
  const loaderColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  async function handleSetAddressToEdit(addressId: string) {
    const addressToEdit = currentUser?.addresses.filter((address) => address.address_id === addressId)[0] ?? {};
    dispatch(setAddressFormData(addressToEdit as UpdateAddressTypeStore));
    dispatch(setIsAddressDialogOpen(true));
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

  function renderAddressOption({
    label,
    hasBorderRight = true,
    onClick,
  }: {
    label: string;
    hasBorderRight?: boolean;
    onClick: () => Promise<void>;
  }) {
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

  return (
    <AccountPageSectionContainer title="Addresses">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 1,
          border: `1px solid ${borderColor}`,
          borderRadius: '4px',
        }}>
        {currentUser?.addresses && currentUser?.addresses.length > 0 ? (
          currentUser?.addresses?.map((address, index) => {
            const isFirstAddress = index === 0;
            const isLastAddress = index === currentUser?.addresses.length - 1;
            return (
              <Box
                key={address.address_id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  borderTop: !isFirstAddress ? `1px solid ${borderColor}` : null,
                  borderBottomLeftRadius: isLastAddress ? '4px' : null,
                  borderBottomRightRadius: isLastAddress ? '4px' : null,
                  borderTopRightRadius: isFirstAddress ? '4px' : null,
                  borderTopLeftRadius: isFirstAddress ? '4px' : null,
                  padding: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  rowGap: 2,
                  columnGap: 4,
                  '@media (hover: hover)': {
                    '&:hover': {
                      backgroundColor: mode === 'dark' ? customColorPalette.grey.dark : customColorPalette.grey.light,
                    },
                  },
                }}>
                <Typography fontSize={16}>
                  {address.complex_or_building ? `${address.complex_or_building},` : null}
                  {`${address.street_address}, ${address.suburb}, ${address.province},
					${address.city}, ${address.postal_code}`}
                </Typography>
                {isDeleting && addressToDelete?.id === address.address_id ? (
                  <Box
                    sx={{
                      minWidth: '108.16px',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}>
                    <PulseLoader
                      loading={isDeleting}
                      color={loaderColor}
                      size={10}
                    />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {renderAddressOption({
                      label: 'edit',
                      hasBorderRight: true,
                      onClick: () => handleSetAddressToEdit(address.address_id),
                    })}
                    {renderAddressOption({
                      label: 'delete',
                      hasBorderRight: false,
                      onClick: () => handleDeleteAddress(address.address_id),
                    })}
                  </Box>
                )}
              </Box>
            );
          })
        ) : (
          <Box
            fontSize={16}
            sx={{ padding: 2 }}>
            <Typography>No address found</Typography>
          </Box>
        )}
      </Box>
      <AddNewAddressDialog />
    </AccountPageSectionContainer>
  );
}
