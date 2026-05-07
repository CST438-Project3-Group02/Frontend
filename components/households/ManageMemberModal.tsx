import { deleteMembership, updateMembership } from "@/api/memberships";
import { ThemedText } from "@/components/themed-text";
import { colors } from '@/constants/colors';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const roleMap: Record<number, string> = {
  1: 'Owner',
  2: 'Admin',
  3: 'Member',
};

type ConfirmAction = {
  type: 'makeAdmin' | 'revokeAdmin' | 'kick';
  member: any;
} | null;

export default function ManageMemberModal({ members, setModal, isVisible, onMemberUpdate }) {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const handleConfirm = async () => {
    if (!confirmAction?.member) return;

    const membershipId = confirmAction.member.memberships.profileHouseholdId;

    try {
      if (confirmAction.type === 'kick') {
        await deleteMembership(membershipId);
      } else if (confirmAction.type === 'makeAdmin') {
        await updateMembership(membershipId, { privs: 2 });
      } else if (confirmAction.type === 'revokeAdmin') {
        await updateMembership(membershipId, { privs: 3 });
      }

      await onMemberUpdate();
    } catch (error) {
      console.error('Failed to update member', error);
    } finally {
      setConfirmAction(null);
    }
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={() => setModal(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <ThemedText style={styles.modalTitle}>Manage Members</ThemedText>
            <Pressable onPress={() => setModal(false)} style={styles.closeButton}>
              <ThemedText style={styles.closeText}>✕</ThemedText>
            </Pressable>
          </View>

          <ScrollView style={styles.memberList} showsVerticalScrollIndicator={false}>
            {members?.map((member, index) => (
              <View key={member.profileId ?? index} style={styles.memberRow}>
                <View style={styles.memberInfo}>
                  {member.profilePicUrl ? (
                    <Image source={{ uri: member.profilePicUrl }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarFallback}>
                      <ThemedText style={styles.avatarInitial}>
                        {member.name?.charAt(0).toUpperCase() ?? '?'}
                      </ThemedText>
                    </View>
                  )}
                  <View>
                    <ThemedText style={styles.memberName}>{member.name}</ThemedText>
                    <ThemedText style={styles.memberRole}>
                      {roleMap[member.memberships.privs] ?? 'Member'}
                    </ThemedText>
                  </View>
                </View>

                {member.memberships.privs !== 1 && (
                  <View style={styles.actions}>
                    <Pressable
                      style={styles.adminButton}
                      onPress={() => setConfirmAction({ 
                        type: member.memberships.privs === 2 ? 'revokeAdmin' : 'makeAdmin', 
                        member 
                      })}
                    >
                      <ThemedText style={styles.adminButtonText}>
                        {member.memberships.privs === 2 ? 'Revoke Admin' : 'Make Admin'}
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      style={styles.kickButton}
                      onPress={() => setConfirmAction({ type: 'kick', member })}
                    >
                      <ThemedText style={styles.kickButtonText}>Kick</ThemedText>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={!!confirmAction}
        onRequestClose={() => setConfirmAction(null)}
      >
        <View style={styles.overlay}>
          <View style={styles.confirmCard}>
            <ThemedText style={styles.confirmTitle}>
              {confirmAction?.type === 'kick'
                ? 'Kick Member'
                : confirmAction?.member?.memberships?.privs === 2
                ? 'Revoke Admin'
                : 'Make Admin'}
            </ThemedText>
            <ThemedText style={styles.confirmMessage}>
              {confirmAction?.type === 'kick'
                ? `Are you sure you want to kick ${confirmAction?.member?.name} from the household?`
                : confirmAction?.member?.memberships?.privs === 2
                ? `Are you sure you want to revoke admin privileges from ${confirmAction?.member?.name}?`
                : `Are you sure you want to make ${confirmAction?.member?.name} an admin?`}
            </ThemedText>

            <View style={styles.confirmActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setConfirmAction(null)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={confirmAction?.type === 'kick' ? styles.confirmKickButton : styles.confirmAdminButton}
                onPress={handleConfirm}
              >
                <ThemedText style={styles.confirmButtonText}>
                  {confirmAction?.type === 'kick' ? 'Kick' : 'Confirm'}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    width: 500,
    maxHeight: '80%',
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  memberList: {
    flexGrow: 0,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  memberRole: {
    fontSize: 12,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  adminButton: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  adminButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.primary,
  },
  kickButton: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  kickButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.danger,
  },
  confirmCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    width: 320,
    gap: 12,
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  confirmMessage: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  confirmAdminButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  confirmKickButton: {
    backgroundColor: colors.danger,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.whiteSoft,
  },
});