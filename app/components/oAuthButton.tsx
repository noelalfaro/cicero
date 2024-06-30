import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub } from 'react-icons/fa'; // Using react-icons as an example

export const OAuthIcon = ({
  provider,
  login,
}: {
  provider: string;
  login: boolean;
}) => {
  switch (provider.toLowerCase()) {
    case 'google':
      return (
        <>
          <Button
            variant={'outline'}
            className="flex w-full gap-1 p-6 text-base"
          >
            {login ? <p>Login with </p> : <p>Sign up with </p>}
            {/* <p>Login with</p> */}
            <FaGoogle />
          </Button>
        </>
      );
    case 'github':
      return (
        <>
          <Button
            variant={'outline'}
            className="flex w-full gap-1 p-6 text-base"
          >
            {login ? <p>Login with </p> : <p>Sign up with </p>}
            <FaGithub style={{ fontSize: '24px' }} />
          </Button>
        </>
      );
    // Add more cases for other providers
    default:
      return null; // Or a default icon
  }
};

// Usage
