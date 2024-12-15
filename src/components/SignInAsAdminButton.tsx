import { selectIsSignInDialogOpen } from '@/lib/redux/features/dialog/dialogSelectors';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { signInAsAdmin } from '@/services/auth/sign-in';
import { useRouter } from 'next/navigation';
import ContainedButton from './ui/buttons/ContainedButton';
import { toast } from 'react-toastify';

type Props = {
  isLoading: boolean;
  isDisabled: boolean;
  setIsLoading: () => void;
};

export default function SignInAsAdminButton({ isLoading, isDisabled, setIsLoading }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isSignInDialogOpen = useAppSelector(selectIsSignInDialogOpen);

  async function handleSignInAsAdmin() {
    setIsLoading();

    if (isSignInDialogOpen) {
      dispatch(setIsDialogLoading(true));
    }

    const { success, message } = await signInAsAdmin();

    if (success) {
      dispatch(closeDialog());
      router.refresh();
    } else {
      toast.error(message);
    }

    setIsLoading();

    if (isSignInDialogOpen) {
      dispatch(setIsDialogLoading(false));
    }
  }

  return (
    <ContainedButton
      type="button"
      onClick={handleSignInAsAdmin}
      label={!isSignInDialogOpen && isLoading ? '' : 'sign in as admin'}
      disabled={isDisabled}
      isLoading={!isSignInDialogOpen && isLoading}
      fullWidth
      color="secondary"
    />
  );
}
