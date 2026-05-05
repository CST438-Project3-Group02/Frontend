import { generateInviteCode } from "@/api/households";
import { colors } from "@/constants/colors";
import { useAuthContext } from "@/hooks/use-auth-context";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../themed-text";

// set to localhost for dev
const inviteLink = "http://localhost:8081/join?invite_token=";

export default function InviteHouseholdButton() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  const { profile } = useAuthContext();


  const onInvite = async () => {
      if (!profile) return;

      try {
          setIsLoading(true);
          const { inviteCode } = await generateInviteCode(profile.profileId, householdId);

          console.log("invite code: ", inviteCode)

          setInviteCode(inviteCode);
          setVisible(true);
      } catch (error) {
          console.error('Failed to generate invite code', error);
      } finally {
          setIsLoading(false);
      }
  }

  const onCopy = async () => {
    await Clipboard.setStringAsync(inviteLink+inviteCode);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={onInvite}>
        <View style={styles.iconCircle}>
          <Feather name="plus" size={24} color={colors.whiteSoft} />
        </View>
        <ThemedText style={styles.buttonText}>Invite to Household</ThemedText>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable style={styles.modalCard}>
            <ThemedText style={styles.modalTitle}>INVITE ROOMMATES</ThemedText>

            <View style={styles.linkBox}>
              <ThemedText style={styles.linkLabel}>Your invite link</ThemedText>
              <ThemedText style={styles.inviteLink} numberOfLines={1}>
                {inviteLink}{inviteCode}
              </ThemedText>
            </View>

            <ThemedText style={styles.expiryText}>
              This link will expire in 15 minutes
            </ThemedText>

            <TouchableOpacity style={styles.copyButton} onPress={onCopy}>
              <Feather name="copy" size={20} color={colors.text} />
              <ThemedText style={styles.copyButtonText}>
                {copied ? "Copied!" : "Copy Link"}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setVisible(false)}
            >
              <ThemedText style={styles.doneButtonText}>Done</ThemedText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderRadius: 36,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    backgroundColor: colors.primary,
  },
  iconCircle: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.whiteSoft,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(30, 18, 15, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 724,
    maxHeight: 600,
    borderRadius: 34,
    padding: 28,
    backgroundColor: colors.surfaceSoft,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
    color: colors.tertiary,
    marginBottom: 24,
  },
  linkBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.borderSoft,
    borderRadius: 28,
    backgroundColor: colors.whiteSoft,
    paddingHorizontal: 18,
    paddingVertical: 26,
    alignItems: "center",
  },
  linkLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  inviteLink: {
    maxWidth: "100%",
    fontSize: 20,
    fontWeight: "800",
    color: colors.dark,
  },
  expiryText: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
  },
  copyButton: {
    marginTop: 24,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FAD2C5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  copyButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  doneButton: {
    marginTop: 14,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.whiteSoft,
  },
});