import { TextMorphButton } from '@/components/auth/morph-button';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub } from 'react-icons/fa';
export const OAuthIcon = ({
  provider,
  login,
}: {
  provider: string;
  login: boolean;
}) => {
  return <TextMorphButton login={login} provider={provider} />;
};
