import { supabase } from '@/lib/supabase'
import GoogleButtonBase from './GoogleButtonBase'

export default function GoogleSignInButton() {
  async function onSignInButtonPress() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return <GoogleButtonBase onPress={onSignInButtonPress} />
}

