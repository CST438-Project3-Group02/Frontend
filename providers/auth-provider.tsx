import { AuthContext } from '@/hooks/use-auth-context'
import { supabase } from '@/lib/supabase'
import { PropsWithChildren, useEffect, useState } from 'react'

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<any>(null)
  const [claims, setClaims] = useState<Record<string, any> | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      setSession(session)

      if (session) {
        const { data, error } = await supabase.auth.getClaims()

        if (error) {
          console.error('Error fetching claims:', error)
        }

        setClaims(data?.claims ?? null)
      } else {
        setClaims(null)
        setProfile(null)
      }

      setIsLoading(false)
    }

    initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', { event: _event, session })

      setSession(session)

      if (session) {
        const { data, error } = await supabase.auth.getClaims()

        if (error) {
          console.error('Error fetching claims:', error)
        }

        setClaims(data?.claims ?? null)
      } else {
        setClaims(null)
        setProfile(null)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!claims?.sub) {
        setProfile(null)
        return
      }

      setIsLoading(true)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', claims.sub)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      }

      setProfile(data ?? null)
      setIsLoading(false)
    }

    fetchProfile()
  }, [claims])

  return (
    <AuthContext.Provider
      value={{
        claims,
        isLoading,
        profile,
        isLoggedIn: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}