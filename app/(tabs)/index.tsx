import { Image } from 'expo-image'
import { Redirect } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

import SignOutButton from '@/components/social-auth-buttons/SignOutButton'
import { useAuthContext } from '@/hooks/use-auth-context'

export default function HomeScreen() {
  const { profile, isLoggedIn } = useAuthContext()

  if (!isLoggedIn) {
    return <Redirect href="/login" />
  }

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text type="title">Welcome to Roomie!</Text>
      </View>
      <View style={styles.stepContainer}>
        <Text type="subtitle">Username</Text>
        <Text>{profile?.username}</Text>
        <Text type="subtitle">Full name</Text>
        <Text>{profile?.full_name}</Text>
      </View>
      <SignOutButton />
    </View>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})