import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import ModalComponent from '../ui/ModalComponent';
import TextButton from '../ui/buttons/TextButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsSignInModalOpen } from '@/lib/redux/modal/modalSlice';
import SignInForm from '../forms/SignInForm';

export default function SignInModal() {
  const customColorPalette = useCustomColorPalette();
  const dispatch = useAppDispatch();
  const { isSignInModalOpen } = useAppSelector((state) => state.modal);

  function handleOpenSignInModal() {
    dispatch(setIsSignInModalOpen(true));
  }

  return (
    <>
      <TextButton
        label="sign in"
        labelColor={customColorPalette.grey.light}
        onClick={handleOpenSignInModal}
      />
      <ModalComponent isOpen={isSignInModalOpen}>
        <SignInForm />
      </ModalComponent>
    </>
  );
}
