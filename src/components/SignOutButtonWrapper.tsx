import signOut from '@/services/auth/sign-out';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ReactNode } from 'react';

const REDIRECT_ON_SIGN_OUT_PATHS = ['/wishlist', '/orders', '/account', '/admin'];

type Props = {
  children: (args: { signOutUser: () => Promise<void> }) => ReactNode;
};

export default function SignOutButtonWrapper({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const redirectAfterSignout = REDIRECT_ON_SIGN_OUT_PATHS.some((path) => pathname.startsWith(path));

  async function signOutUser() {
    const { success, message } = await signOut();

    if (success === true) {
      if (redirectAfterSignout) {
        router.push('/');
      }
      // NB!!! refresh must come after push!!!
      router.refresh();
    } else {
      toast.error(message);
    }
  }

  return <>{children && children({ signOutUser })}</>;
}
