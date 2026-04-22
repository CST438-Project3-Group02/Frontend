import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { router } from 'expo-router'
import { Button } from 'react-native'

export default function GoogleAuthButton() {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          router.replace('/index')
        }
      }
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleGoogleSignIn = async () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://ukyzalymqurvltcggjwd.supabase.co/auth/v1/callback',
      },
    })
  }

  return (
    <Button
      title="Sign in with Google"
      onPress={handleGoogleSignIn}
    />
  )
}