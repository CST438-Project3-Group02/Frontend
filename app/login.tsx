import { useEffect, useState } from "react"
import { Text, View } from "react-native"

import GoogleAuthButton from "../components/GoogleAuthButton"

export default function Login() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Roomie</Text>
      <GoogleAuthButton />
    </View>
  )
}