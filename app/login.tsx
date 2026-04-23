import { Link, Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

import GoogleSignInButton from '@/components/social-auth-buttons/google/GoogleSignInButton'
import DiscordSignInButton from '@/components/social-auth-buttons/discord/DiscordSignInButton'

export default function LoginScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <View style={styles.container}>
        <Text type="title">Welcome to Roomie!</Text>
        <GoogleSignInButton />
        <DiscordSignInButton />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 5
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
})