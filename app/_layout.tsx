import { SplashScreenController } from '@/components/SplashScreenController'
import { useAuthContext } from '@/hooks/use-auth-context'
import AuthProvider from '@/providers/auth-provider'
import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'
import 'react-native-reanimated'

// Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuthContext()

  console.log("logged in:", isLoggedIn)

  if (isLoading) {
    return null
  }

  // protects certain screens from accessed if user is not logged
  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
      {/* <Stack.Screen name="+not-found" /> */}
    </Stack>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  return (
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider>
        <SplashScreenController />
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  )
}