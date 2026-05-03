import { useAuthContext } from '@/hooks/use-auth-context';
import { Redirect, Slot } from 'expo-router';

export default function HouseholdsLayout() {
  const { isLoggedIn, isLoading } = useAuthContext();

  if (isLoading) return null;

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }
  
  return <Slot />;
}