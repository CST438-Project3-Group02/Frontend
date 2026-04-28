import { supabase } from '@/lib/supabase'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import DiscordButtonBase from './DiscordButtonBase'

export default function DiscordSignInButton() {
  async function onSignInButtonPress() {
    const redirectTo = Linking.createURL('auth/callback')

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    })

    if (error) {
      console.error('OAuth error:', error)
      return
    }

    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectTo
    )

    if (result.type === 'success') {
      const url = result.url

      const { params } = Linking.parse(url)

      if (params?.access_token && params?.refresh_token) {
        await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        })
      }
    }
  }

  return <DiscordButtonBase onPress={onSignInButtonPress} />
}