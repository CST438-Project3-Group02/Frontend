import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'
import { Button } from 'react-native'

export default function DiscordSignInButton() {
  async function onSignInButtonPress() {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
    })
  }

  return <Button title="Sign in with Discord" onPress={onSignInButtonPress} />
}

