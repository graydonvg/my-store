import SignUpForm from '@/components/forms/SignUpForm';
import MuiLink from '@/components/ui/MuiLink';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <SignUpForm headerComponent="h1">
      <Link href="/welcome/sign-in">
        <MuiLink>Already have an account? Sign in</MuiLink>
      </Link>
    </SignUpForm>
  );
}
