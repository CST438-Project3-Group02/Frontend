import { AntDesign } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'

export default function GoogleButtonBase({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <View style={styles.content}>
        <AntDesign name="google" size={20}/>
        <Text style={styles.text}>Continue with Google</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: 'black',
    fontSize: 14,
    fontWeight: '400',
  },
})