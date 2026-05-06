import { SplashScreenController } from '@/components/SplashScreenController'
import { useAuthContext } from '@/hooks/use-auth-context'
import AuthProvider from '@/providers/auth-provider'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { router, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

// Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuthContext()

  console.log("logged in:", isLoggedIn)

  useEffect(() => {
    if (!isLoggedIn) return

    const checkRedirect = async () => {
      const stored = await AsyncStorage.getItem('post_login_redirect')
      if (stored) {
        const { redirect, invite_token } = JSON.parse(stored)
        await AsyncStorage.removeItem('post_login_redirect')
        router.replace(`${redirect}?invite_token=${invite_token}` as any)
      }
    }

    checkRedirect()
  }, [isLoggedIn])

  if (isLoading) {
    return null
  }

  // protects certain screens from accessed if user is not logged
  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="households" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="join" options={{ headerShown: false }} />
    </Stack>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <AuthProvider>
          <SplashScreenController />
          <RootNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}