import { supabase } from '@/lib/supabase'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { ThemedText } from '../themed-text'

async function onSignOutButtonPress() {
  const { error } = await supabase.auth.signOut()

  console.log("SIGN OUT")

  if (error) {
    console.error('Error signing out:', error)
    return
  }

}

export default function SignOutButton() {
  return <TouchableOpacity 
    onPress={onSignOutButtonPress} 
    style={{
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 8,
      backgroundColor: "#A86651",
    }}>
      <ThemedText style={{ 
        fontSize: 14, 
        fontWeight: "400",
        textAlign: "center", 
        color: "white"}}
        >
          Sign Out
        </ThemedText>
    </TouchableOpacity>

}