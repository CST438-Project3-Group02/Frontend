import { useEffect } from 'react'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  useEffect(() => {
    const finishAuth = async () => {
      const { data } = await supabase.auth.getSession()

      console.log("SESSION:", data.session)

      if (data.session) {
        router.replace('/index')
      } else {
        router.replace('/login')
      }
    }

    finishAuth()
  }, [])

  return null
}