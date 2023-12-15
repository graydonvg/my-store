'use client';

import AccountPageInfoInput from '@/components/accountPage/AccountPageInfoInput';
import AccountPageInfo from '@/components/accountPage/AccountPageInfo';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateUserPassword, updateUserPersonalInformation } from '@/services/users/update-user';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AccountPageSectionContainer from '@/components/accountPage/AccountPageSectionContainer';
import AddNewAddressDialog from '@/components/dialogs/AddNewAddressDialog';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { deleteAddress } from '@/services/users/delete-address';
import { setAddressFormData } from '@/lib/redux/addressForm/addressFormSlice';
import { UpdateAddressTypeStore } from '@/types';
import { setIsAddressDialogOpen } from '@/lib/redux/dialog/dialogSlice';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { PulseLoader } from 'react-spinners';

export default function Account() {
  const dispatch = useAppDispatch();
  const { currentUser, isOAuthSignIn } = useAppSelector((state) => state.user);
  const defaultFormData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    name: currentUser?.first_name ?? '',
    surname: currentUser?.last_name ?? '',
    contactNumber: currentUser?.contact_number ?? '',
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [fieldToUpdate, setFieldToUpdate] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<{ id: string } | null>(null);
  const customColorPalette = useCustomColorPalette();
  const router = useRouter();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;
  const loaderColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleSetFieldToUpdate(field: string) {
    setFormData(defaultFormData);
    setFieldToUpdate(field);
  }

  function handleCancelUpdateField() {
    setFormData(defaultFormData);
    setFieldToUpdate(null);
  }

  async function handleUpdatePassword() {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      return toast.error('Please complete all fields.');
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    setIsUpdating(true);
    try {
      const { success, message } = await updateUserPassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      if (success === true) {
        router.refresh();
        toast.success(message);
        setFieldToUpdate(null);
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to update password. Please try again later.');
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleUpdatePersonalInformation() {
    if (
      formData.name === currentUser?.first_name &&
      formData.surname === currentUser.last_name &&
      formData.contactNumber === currentUser.contact_number
    )
      return;
    setIsUpdating(true);
    try {
      const { success, message } = await updateUserPersonalInformation({
        first_name: formData.name,
        last_name: formData.surname,
        contact_number: formData.contactNumber,
      });
      if (success === true) {
        dispatch(
          setCurrentUser({
            ...currentUser!,
            first_name: formData.name,
            last_name: formData.surname,
            contact_number: formData.contactNumber,
          })
        );
        setFieldToUpdate(null);
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to update personal information. Please try again later.');
    } finally {
      router.refresh();
      setIsUpdating(false);
    }
  }

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

  function renderUserInfo(value: string) {
    return (
      <Typography
        component="span"
        fontSize={16}>
        {value}
      </Typography>
    );
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
    <Box>
      <Box
        component="header"
        sx={{ marginBottom: 3, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
        <Typography
          component="h1"
          fontSize={{ xs: 26, sm: 30 }}
          fontWeight={500}
          sx={{ paddingY: 1, textAlign: 'center' }}>
          {currentUser?.first_name && currentUser?.last_name
            ? `${currentUser?.first_name} ${currentUser?.last_name}`
            : currentUser?.email}
        </Typography>
      </Box>
      <Grid
        container
        rowGap={2}>
        <Grid
          item
          xs={12}
          md={6}>
          <Box
            sx={{
              maxWidth: { xs: 'unset', md: '75%' },
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
            <AccountPageSectionContainer title="Account">
              <AccountPageInfo
                label="Email"
                canEdit={false}
                onClick={null}>
                {renderUserInfo(currentUser?.email!)}
              </AccountPageInfo>
              {!isOAuthSignIn ? (
                fieldToUpdate !== 'password' ? (
                  <AccountPageInfo
                    label="Password"
                    canEdit={true}
                    onClick={() => handleSetFieldToUpdate('password')}>
                    <Typography
                      component="div"
                      fontSize={3.3}
                      sx={{ paddingTop: 1 }}>
                      {Array.from(Array(16)).map((_, index) => (
                        <Box
                          component="span"
                          key={index}
                          sx={{ paddingRight: 0.12 }}>
                          {mode === 'dark' ? '⚪' : '⚫'}
                        </Box>
                      ))}
                    </Typography>
                  </AccountPageInfo>
                ) : (
                  <AccountPageInfoInput
                    textFieldData={[
                      {
                        id: 'current-password',
                        label: 'Current Password',
                        name: 'currentPassword',
                        type: 'password',
                        value: formData.currentPassword,
                        onChange: handleInputChange,
                        onKeyDownFunction: handleUpdatePassword,
                      },
                      {
                        id: 'new-password',
                        label: 'New Password',
                        name: 'newPassword',
                        type: 'password',
                        value: formData.newPassword,
                        onChange: handleInputChange,
                        onKeyDownFunction: handleUpdatePassword,
                      },
                      {
                        id: 'confirm-password',
                        label: 'Confirm Password',
                        name: 'confirmPassword',
                        type: 'password',
                        value: formData.confirmPassword,
                        onChange: handleInputChange,
                        onKeyDownFunction: handleUpdatePassword,
                      },
                    ]}
                    isUpdating={isUpdating}
                    onSave={handleUpdatePassword}
                    onCancel={handleCancelUpdateField}
                    disableSave={
                      formData.currentPassword.length === 0 ||
                      formData.newPassword.length === 0 ||
                      formData.confirmPassword.length === 0
                    }
                  />
                )
              ) : null}
            </AccountPageSectionContainer>
            <AccountPageSectionContainer title="Personal information">
              {fieldToUpdate !== 'name' ? (
                <AccountPageInfo
                  label="Name"
                  canEdit={true}
                  onClick={() => handleSetFieldToUpdate('name')}>
                  {renderUserInfo(currentUser?.first_name!)}
                </AccountPageInfo>
              ) : (
                <AccountPageInfoInput
                  textFieldData={[
                    {
                      id: 'name',
                      label: 'Name',
                      name: 'name',
                      type: 'text',
                      value: formData.name,
                      onChange: handleInputChange,
                      onKeyDownFunction: handleUpdatePersonalInformation,
                    },
                  ]}
                  isUpdating={isUpdating}
                  onSave={handleUpdatePersonalInformation}
                  onCancel={handleCancelUpdateField}
                  disableSave={formData.name.length === 0}
                />
              )}
              {fieldToUpdate !== 'surname' ? (
                <AccountPageInfo
                  label="Surname"
                  canEdit={true}
                  onClick={() => handleSetFieldToUpdate('surname')}>
                  {renderUserInfo(currentUser?.last_name!)}
                </AccountPageInfo>
              ) : (
                <AccountPageInfoInput
                  textFieldData={[
                    {
                      id: 'surname',
                      label: 'Surname',
                      name: 'surname',
                      type: 'text',
                      value: formData.surname,
                      onChange: handleInputChange,
                      onKeyDownFunction: handleUpdatePersonalInformation,
                    },
                  ]}
                  isUpdating={isUpdating}
                  onSave={handleUpdatePersonalInformation}
                  onCancel={handleCancelUpdateField}
                  disableSave={formData.surname.length === 0}
                />
              )}
              {fieldToUpdate !== 'contactNumber' ? (
                <AccountPageInfo
                  label="Contact number"
                  canEdit={true}
                  onClick={() => handleSetFieldToUpdate('contactNumber')}>
                  {renderUserInfo(currentUser?.contact_number!)}
                </AccountPageInfo>
              ) : (
                <AccountPageInfoInput
                  textFieldData={[
                    {
                      id: 'contact-number',
                      label: 'Contact number',
                      name: 'contactNumber',
                      type: 'text',
                      value: formData.contactNumber,
                      onChange: handleInputChange,
                      onKeyDownFunction: handleUpdatePersonalInformation,
                    },
                  ]}
                  isUpdating={isUpdating}
                  onSave={handleUpdatePersonalInformation}
                  onCancel={handleCancelUpdateField}
                  disableSave={formData.contactNumber.length === 0}
                />
              )}
            </AccountPageSectionContainer>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}>
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
                            backgroundColor:
                              mode === 'dark' ? customColorPalette.grey.dark : customColorPalette.grey.light,
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
        </Grid>
      </Grid>
    </Box>
  );
}
