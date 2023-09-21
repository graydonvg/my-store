import SignInForm from '@/components/Forms/SignInForm';
import SignUpForm from '@/components/Forms/SignUpForm';
import { useAppSelector } from '@/lib/redux/hooks';

export default function ModalContentOptions() {
  const modalContent = useAppSelector((state) => state.modal.modalContent);
  return <>{modalContent === 'signIn' ? <SignInForm /> : modalContent === 'signUp' ? <SignUpForm /> : null}</>;
}
