import { supabase } from '@/lib/supabase'
import DiscordButtonBase from './DiscordButtonBase'

export default function DiscordSignInButton() {
  async function onSignInButtonPress() {
    await supabase.auth.signInWithOAuth({
      provider: 'discord'
    })
  }

  return <DiscordButtonBase onPress={onSignInButtonPress} />
}

