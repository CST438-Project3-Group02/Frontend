import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'
import { Button } from 'react-native'
import DiscordButtonBase from './DiscordButtonBase'

export default function DiscordSignInButton() {
  async function onSignInButtonPress() {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
    })
  }

  return <DiscordButtonBase onPress={onSignInButtonPress} />
}

