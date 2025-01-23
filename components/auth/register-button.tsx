import { MorphButton } from '@/components/auth/morph-button';

interface RegisterButtonProps {
  isHomePage?: boolean;
}
export function RegisterButton({ isHomePage = false }: RegisterButtonProps) {
  return (
    <MorphButton
      initialText="Register"
      variant="secondary"
      isHomePage={isHomePage}
    />
  );
}
