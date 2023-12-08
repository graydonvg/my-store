import SignUpForm from '@/components/forms/SignUpForm';
import MuiLink from '@/components/ui/MuiLink';
import WelcomePageContainer from '@/components/ui/WelcomePageContainer';
import Link from 'next/link';

export default function SignUp() {
  return (
    <WelcomePageContainer>
      <SignUpForm>
        <Link href={'/welcome/sign-in'}>
          <MuiLink>Already have an account? Sign in</MuiLink>
        </Link>
      </SignUpForm>
    </WelcomePageContainer>
  );
}
