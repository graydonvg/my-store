import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import ModalComponent from '../ui/ModalComponent';
import TextButton from '../ui/buttons/TextButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsSignUpModalOpen } from '@/lib/redux/modal/modalSlice';
import SignUpForm from '../forms/SignUpForm';

export default function SignUpModal() {
  const customColorPalette = useCustomColorPalette();
  const dispatch = useAppDispatch();
  const { isSignUpModalOpen } = useAppSelector((state) => state.modal);

  function handleOpenSignUpModal() {
    dispatch(setIsSignUpModalOpen(true));
  }

  return (
    <>
      <TextButton
        label="sign up"
        labelColor={customColorPalette.grey.light}
        onClick={handleOpenSignUpModal}
      />
      <ModalComponent isOpen={isSignUpModalOpen}>
        <SignUpForm />
      </ModalComponent>
    </>
  );
}
