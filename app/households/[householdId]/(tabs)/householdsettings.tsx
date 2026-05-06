import { deleteHousehold, getHouseholdWithProfiles, updateHousehold } from "@/api/households";
import RightPanel from "@/components/dashboard/RightPanel";
import InviteHouseholdButton from "@/components/households/InviteHouseholdButton";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/colors";
import { useHouseholdContext } from "@/hooks/use-household-context";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function HouseholdSettings() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  const { household, membership, setHousehold } = useHouseholdContext();

  const [members, setMembers] = useState<any[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Editable fields
  const [householdName, setHouseholdName] = useState('');
  const [rentCost, setRentCost] = useState('');
  const [numOfBedrooms, setNumOfBedrooms] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');

  const isAdmin = (membership?.privs ?? 99) <= 2;
  const isOwner = membership?.privs === 1;
  const canEdit = isAdmin;

  useEffect(() => {
    if (household) {
      setHouseholdName(household.householdName ?? '');
      setRentCost(household.rentCost?.toString() ?? '');
      setNumOfBedrooms(household.numOfBedrooms?.toString() ?? '');
      setAddress(household.address ?? '');
      setCity(household.city ?? '');
      setState(household.state ?? '');
      setZipCode(household.zipCode ?? '');
      setCountry(household.country ?? '');
    }
  }, [household]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getHouseholdWithProfiles(householdId);
        setMembers(data.profiles ?? []);
      } catch (error) {
        console.error('Failed to fetch members', error);
      }
    };
    fetchMembers();
  }, [householdId]);

  const onSave = async () => {
    try {
      const updated = await updateHousehold(householdId, {
        householdName,
        rentCost: parseFloat(rentCost),
        numOfBedrooms: parseInt(numOfBedrooms),
        address,
        city,
        state,
        zipCode,
        country,
      });
      setHousehold(updated);
    } catch (error) {
      console.error('Failed to save household', error);
    }
  };

  const onDiscard = () => {
    if (!household) return;
    setHouseholdName(household.householdName ?? '');
    setRentCost(household.rentCost?.toString() ?? '');
    setNumOfBedrooms(household.numOfBedrooms?.toString() ?? '');
    setAddress(household.address ?? '');
    setCity(household.city ?? '');
    setState(household.state ?? '');
    setZipCode(household.zipCode ?? '');
    setCountry(household.country ?? '');
  };

  const onDelete = async () => {
    try {
      await deleteHousehold(householdId);
      setDeleteModalVisible(false);
      router.replace('/households');
    } catch (error) {
      console.error('Failed to delete household', error);
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row", backgroundColor: colors.background }}>
      {!isMobile && (
        <Sidebar
          items={[
            { id: "activity", label: "Activity", icon: "list" },
            { id: "chores", label: "Chores", icon: "checkbox" },
            { id: "expenses", label: "Expenses", icon: "receipt" },
            { id: "groceries", label: "Groceries", icon: "cart" },
            { id: "chat", label: "Chat", icon: "chatbubble" },
            { id: "household", label: "My Household", icon: "home", active: true },
            { id: "settings", label: "Settings", icon: "settings" },
          ]}
          householdId={householdId}
          onRoomiePress={() => router.push("/")}
        />
      )}

      <View style={{ flex: 1, flexDirection: "column" }}>
        <Topbar />
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.header}>
            <ThemedText style={styles.eyebrow}>HOUSEHOLD PROFILE</ThemedText>
            <View style={styles.titleRow}>
              <ThemedText style={styles.title}>{householdName || 'Household'}</ThemedText>
              <TouchableOpacity onPress={() => router.push('/households')} style={styles.backButton}>
                <ThemedText style={styles.backButtonText}>View All Households</ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.titleUnderline} />
          </View>

          <View style={styles.content}>
            <View style={styles.mainColumn}>
              <SectionCard
                icon={<FontAwesome6 name="house-chimney" size={18} color={colors.primary} />}
                title="General Information"
              >
                <View style={styles.gridTwo}>
                  <Field
                    label="Household Name"
                    value={householdName}
                    onChangeText={setHouseholdName}
                    editable={canEdit}
                  />
                  <Field
                    label="Rent Cost (Monthly)"
                    value={rentCost}
                    onChangeText={setRentCost}
                    editable={canEdit}
                    prefix="$"
                  />
                  <Field
                    label="Number of Bedrooms"
                    value={numOfBedrooms}
                    onChangeText={setNumOfBedrooms}
                    editable={canEdit}
                    hasChevron
                  />
                </View>
              </SectionCard>

              <SectionCard
                icon={<Feather name="map-pin" size={22} color={colors.primary} />}
                title="Address Details"
              >
                <View style={styles.addressGrid}>
                  <Field label="Street Address" value={address} onChangeText={setAddress} editable={canEdit} wide />
                  <Field label="Zip Code" value={zipCode} onChangeText={setZipCode} editable={canEdit} />
                  <Field label="City" value={city} onChangeText={setCity} editable={canEdit} />
                  <Field label="State" value={state} onChangeText={setState} editable={canEdit} />
                  <Field label="Country" value={country} onChangeText={setCountry} editable={canEdit} />
                </View>
              </SectionCard>

              {canEdit && (
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                    <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.discardButton} onPress={onDiscard}>
                    <ThemedText style={styles.discardButtonText}>Discard Edits</ThemedText>
                  </TouchableOpacity>
                </View>
              )}

              {isOwner && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteModalVisible(true)}>
                  <Feather name="trash-2" size={18} color={colors.danger} />
                  <ThemedText style={styles.deleteText}>Delete Household</ThemedText>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.sideColumn}>
              <View style={styles.membersCard}>
                <View style={styles.membersHeader}>
                  <ThemedText style={styles.membersTitle}>Members</ThemedText>
                  <View style={styles.memberCountPill}>
                    <ThemedText style={styles.memberCountText}>{members.length} Total</ThemedText>
                  </View>
                </View>

                {members.length === 0 ? (
                  <View style={styles.emptyMembersState}>
                    <ThemedText style={styles.emptyMembersText}>No members yet.</ThemedText>
                  </View>
                ) : (
                  <View style={styles.membersList}>
                    {members.map((member: any) => (
                      <View key={member.profileId} style={styles.memberRow}>
                        <ThemedText style={styles.memberName}>{member.name}</ThemedText>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {isAdmin && (
                <InviteHouseholdButton />
              )}
            </View>
          </View>
        </ScrollView>

        {isMobile && (
          <BottomNavigation
            items={[
              { id: "activity", label: "Activity", icon: "list" },
              { id: "chat", label: "Chat", icon: "chatbubble" },
              { id: "chores", label: "Chores", icon: "checkbox" },
              { id: "expenses", label: "Expenses", icon: "receipt" },
              { id: "groceries", label: "Groceries", icon: "cart" },
            ]}
            householdId={householdId}
          />
        )}
      </View>

      {!isMobile && <RightPanel />}

      {/* Delete Confirmation Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <ThemedText style={styles.modalTitle}>Delete Household</ThemedText>
            <ThemedText style={styles.modalSubtitle}>
              You are about to delete household{' '}
              <ThemedText style={styles.modalBold}>{householdName}</ThemedText>.
              Are you sure you want to do this? This action cannot be undone.
            </ThemedText>
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setDeleteModalVisible(false)}>
                <ThemedText style={styles.cancelText}>Cancel</ThemedText>
              </Pressable>
              <Pressable style={styles.confirmDeleteButton} onPress={onDelete}>
                <ThemedText style={styles.confirmDeleteText}>Delete</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        {icon}
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      </View>
      {children}
    </View>
  );
}

function Field({
  label, value, onChangeText, editable = false, muted, hasChevron, hasCopy, wide, prefix,
}: {
  label: string; value: string; onChangeText?: (text: string) => void;
  editable?: boolean; muted?: boolean; hasChevron?: boolean;
  hasCopy?: boolean; wide?: boolean; prefix?: string;
}) {
  return (
    <View style={[styles.fieldWrap, wide && styles.fieldWide]}>
      <ThemedText style={styles.fieldLabel}>{label.toUpperCase()}</ThemedText>
      <View style={[styles.inputBox, muted && styles.inputMuted, !editable && styles.inputReadOnly]}>
        {prefix && <ThemedText style={styles.inputPrefix}>{prefix}</ThemedText>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          style={[styles.inputText, muted && styles.inputTextMuted, !editable && styles.inputTextReadOnly]}
          placeholderTextColor={colors.textMuted}
        />
        {hasChevron && <Feather name="chevron-down" size={18} color={colors.textMuted} />}
        {hasCopy && <Feather name="copy" size={14} color={colors.borderSoft} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 48,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 4,
    color: colors.tertiary,
    marginBottom: 10,
  },
  title: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "900",
    color: colors.dark,
    letterSpacing: -2,
  },
  titleUnderline: {
    width: 92,
    height: 4,
    borderRadius: 99,
    backgroundColor: colors.secondary,
    marginTop: 14,
  },
  content: {
    flexDirection: "row",
    gap: 44,
    alignItems: "flex-start",
  },
  mainColumn: {
    flex: 1,
    gap: 36,
  },
  sideColumn: {
    width: 280,
    gap: 32,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: colors.dark,
  },
  gridTwo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 28,
  },
  addressGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
  },
  fieldWrap: {
    width: "47%",
    minWidth: 190,
  },
  fieldWide: {
    width: "62%",
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.neutral,
    marginBottom: 10,
  },
  inputBox: {
    height: 56,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: "#EDE8E4",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputMuted: {
    backgroundColor: "#F1EAE4",
  },
  inputReadOnly: {
    backgroundColor: "#F1EAE4",
    opacity: 0.8,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.dark,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: colors.dark,
    padding: 0,
  },
  inputTextMuted: {
    color: colors.borderSoft,
    fontWeight: "700",
  },
  inputTextReadOnly: {
    color: colors.textMuted,
  },
  membersList: {
    marginTop: 16,
    gap: 12,
  },
  memberRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  memberName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  membersCard: {
    backgroundColor: colors.whiteSoft,
    borderRadius: 28,
    padding: 28,
    minHeight: 300,
  },
  membersHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  membersTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: colors.dark,
  },
  memberCountPill: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  memberCountText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  emptyMembersState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 52,
  },
  emptyMembersText: {
    fontSize: 14,
    textAlign: "center",
    color: colors.textMuted,
    fontWeight: "600",
  },
  inviteButton: {
    height: 62,
    borderRadius: 32,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  inviteButtonText: {
    color: colors.whiteSoft,
    fontSize: 16,
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    gap: 24,
    flexWrap: "wrap",
    marginTop: 24,
  },
  saveButton: {
    minWidth: 180,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: colors.whiteSoft,
    fontSize: 15,
    fontWeight: "800",
  },
  discardButton: {
    minWidth: 180,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#E6E1DD",
    alignItems: "center",
    justifyContent: "center",
  },
  discardButtonText: {
    color: colors.tertiary,
    fontSize: 15,
    fontWeight: "800",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    marginLeft: 28,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.danger,
  },
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
    width: 340,
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 8,
    lineHeight: 22,
  },
  modalBold: {
    fontWeight: "800",
    color: colors.text,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
  confirmDeleteButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.danger,
  },
  confirmDeleteText: {
    fontSize: 14,
    color: colors.whiteSoft,
    fontWeight: "600",
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});