import SignInForm from '@/components/forms/SignInForm';
import MuiLink from '@/components/ui/MuiLink';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <SignInForm headerComponent="h1">
      <Link href="/welcome/sign-up">
        <MuiLink>Don&apos;t have an account? Sign Up</MuiLink>
      </Link>
    </SignInForm>
  );
}
