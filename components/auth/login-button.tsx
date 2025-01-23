import { MorphButton } from '@/components/auth/morph-button';
interface LoginButtonProps {
  isHomePage?: boolean;
  initialText?: string;
}

export function LoginButton({ isHomePage }: LoginButtonProps) {
  return (
    <MorphButton
      initialText="Login"
      variant="default"
      isHomePage={isHomePage}
    />
  );
}
