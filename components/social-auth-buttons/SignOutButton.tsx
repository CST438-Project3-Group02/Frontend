import { colors } from '@/constants/colors'
import { supabase } from '@/lib/supabase'
import React, { useState } from 'react'
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ThemedText } from '../themed-text'

export default function SignOutButton() {
  const [modalVisible, setModalVisible] = useState(false)

  const onConfirmSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setModalVisible(false)
    } catch (error) {
      console.error('Failed to sign out', error)
    }
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}
      >
        <ThemedText style={styles.buttonText}>Sign Out</ThemedText>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            <ThemedText style={styles.title}>Sign Out</ThemedText>
            <ThemedText style={styles.subtitle}>
              Are you sure you want to sign out?
            </ThemedText>

            <View style={styles.actions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <ThemedText style={styles.cancelText}>Cancel</ThemedText>
              </Pressable>

              <Pressable
                style={styles.confirmButton}
                onPress={onConfirmSignOut}
              >
                <ThemedText style={styles.confirmText}>Sign Out</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    backgroundColor: colors.danger,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    color: colors.whiteSoft,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    width: 320,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  cancelButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  cancelText: {
    fontSize: 14,
    color: colors.text,
  },
  confirmButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.danger,
  },
  confirmText: {
    fontSize: 14,
    color: colors.whiteSoft,
    fontWeight: '600',
  },
})