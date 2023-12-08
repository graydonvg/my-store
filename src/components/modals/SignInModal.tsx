import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import ModalComponent from '../ui/ModalComponent';
import TextButton from '../ui/buttons/TextButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeModal, setIsSignInModalOpen, setIsSignUpModalOpen } from '@/lib/redux/modal/modalSlice';
import SignInForm from '../forms/SignInForm';
import MuiLink from '../ui/MuiLink';

export default function SignInModal() {
  const customColorPalette = useCustomColorPalette();
  const dispatch = useAppDispatch();
  const { isSignInModalOpen } = useAppSelector((state) => state.modal);

  function handleOpenSignInModal() {
    dispatch(setIsSignInModalOpen(true));
  }

  function handleOpenSignUpModal() {
    dispatch(closeModal());
    dispatch(setIsSignUpModalOpen(true));
  }

  return (
    <>
      <TextButton
        label="sign in"
        labelColor={customColorPalette.grey.light}
        onClick={handleOpenSignInModal}
      />
      <ModalComponent isOpen={isSignInModalOpen}>
        <SignInForm>
          <MuiLink onClick={handleOpenSignUpModal}>Don&apos;t have an account? Sign Up</MuiLink>
        </SignInForm>
      </ModalComponent>
    </>
  );
}
