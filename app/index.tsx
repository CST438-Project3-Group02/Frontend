import { useAuthContext } from '@/hooks/use-auth-context';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isLoggedIn } = useAuthContext()

  if (isLoggedIn) {
    return <Redirect href="/households" />;
  }

  return <Redirect href="/login" />;
}