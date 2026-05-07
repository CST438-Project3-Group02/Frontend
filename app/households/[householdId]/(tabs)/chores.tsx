import { getChoresByHousehold } from "@/api/chores";
import ChoreForm from "@/components/chores/ChoreForm";
import ChoreList from "@/components/chores/ChoreList";
import RightPanel from "@/components/dashboard/RightPanel";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Sidebar from "@/components/layout/Sidebar";
import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CheckCircle2,
  Circle,
  Droplets,
  Plus,
  User,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

type Chore = {
  choreId: number;
  choreName: string;
  choreDescription?: string;
  repeatInterval?: number;
  isCompleted: boolean;
  completeBy?: string;
  createdAt?: string;
  profileId?: number;
  profileName?: string;
  householdId?: number;
  householdName?: string;
  dueAt?: Date;
};

export default function ChoresPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  const [isChoreModalOpen, setIsChoreModalOpen] = useState(false);
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);

  async function refreshChores() {
    if (!householdId) return;

    try {
      setLoading(true);
      const data = await getChoresByHousehold(householdId);
      setChores(data);
    } catch (err) {
      console.error("Failed to load chores", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshChores();
  }, [householdId]);

  useEffect(() => {
    async function loadChores() {
      try {
        const data = await getChoresByHousehold(householdId);
        setChores(data);
      } catch (err) {
        console.error("Failed to load chores", err);
      } finally {
        setLoading(false);
      }
    }

    loadChores();
  }, [householdId]);

  const toggleChore = (id: number) => {
    setChores((prev) =>
      prev.map((chore) =>
        chore.choreId === id ? { ...chore, isCompleted: !chore.isCompleted } : chore
      )
    );
  };

  const incompleteCount = chores.filter((c) => !c.isCompleted).length;

  const upcoming = chores
    .filter((c) => !c.isCompleted && c.completeBy)
    .map((c) => ({
      ...c,
      dueAt: new Date(c.completeBy as string),
    }))
    .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
    .slice(0, 5);

  function getTimeRemaining(date: Date) {
    const diff = date.getTime() - Date.now();
    if (diff < 0) return "Overdue";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;

    return `${minutes}m`;
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: isMobile ? "column" : "row",
        backgroundColor: colors.background,
      }}
    >
      {!isMobile && (
        <Sidebar
          items={[
            { id: "activity", label: "Activity", icon: "list" },
            { id: "chores", label: "Chores", icon: "checkbox", active: true },
            { id: "expenses", label: "Expenses", icon: "receipt" },
            { id: "groceries", label: "Groceries", icon: "cart" },
            { id: "household", label: "My Household", icon: "home" }
          ]}
          householdId={householdId}
        />
      )}

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: isMobile ? 120 : 32 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.eyebrow}>Your Sanctuary</ThemedText>
              <ThemedText style={styles.title}>Chores</ThemedText>
            </View>

            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>
                {incompleteCount} left
              </ThemedText>
            </View>
          </View>

          {/* My Chores */}
          <ChoreList
            title="My Chores"
            icon={User}
            badge={`${incompleteCount} left`}
          >
             {loading ? (
              <ThemedText style={styles.emptyText}>Loading chores...</ThemedText>
            ) : chores.length === 0 ? (
              <ThemedText style={styles.emptyText}>
                No chores yet. Tap + to create one.
              </ThemedText>
            ) : (
              chores.map((chore) => {
                const CheckboxIcon = chore.isCompleted ? CheckCircle2 : Circle;

                return (
                  <Pressable
                    key={chore.choreId}
                    onPress={() => toggleChore(chore.choreId)}
                    style={[
                      styles.choreCard,
                      chore.isCompleted && styles.choreCardCompleted,
                    ]}
                  >
                    <View style={styles.choreIcon}>
                      <User size={22} color={colors.primary} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <ThemedText
                        style={[
                          styles.choreTitle,
                          chore.isCompleted && styles.completedText,
                        ]}
                      >
                        {chore.choreName}
                      </ThemedText>

                      <ThemedText style={styles.choreSubtitle}>
                        {chore.choreDescription || "No description"}
                      </ThemedText>
                    </View>

                    <CheckboxIcon
                      size={24}
                      color={
                        chore.isCompleted ? colors.primary : colors.textMuted
                      }
                    />
                  </Pressable>
                );
              })
            )}
          </ChoreList>

          {/* Upcoming Chores */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Upcoming
            </ThemedText>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.upcomingList}
            >
              {upcoming.map((chore) => (
                <View key={chore.choreId} style={styles.upcomingCard}>
                  <Droplets size={24} color={colors.primary} />
                  <ThemedText style={styles.upcomingTitle}>
                    {chore.choreName}
                  </ThemedText>
                  <ThemedText style={styles.upcomingDescription}>
                    {chore.choreDescription}
                  </ThemedText>
                   {chore.profileName && (
                      <ThemedText style={styles.assignedText}>
                        {chore.profileName}
                      </ThemedText>
                    )}

                    <ThemedText style={styles.timeTag}>
                      {chore.dueAt ? getTimeRemaining(chore.dueAt) : ""}
                    </ThemedText>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* FAB */}
        <Pressable
          style={[styles.fab, { bottom: isMobile ? 92 : 32 }]}
          onPress={() => setIsChoreModalOpen(true)}
        >
          <Plus size={32} color="#fff" strokeWidth={3} />
        </Pressable>

        {/* MODAL */}
        <Modal
          visible={isChoreModalOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setIsChoreModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalCard,
                { width: isMobile ? "92%" : 520 },
              ]}
            >
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>
                  Create Chore
                </ThemedText>

                <Pressable
                  style={styles.closeButton}
                  onPress={() => setIsChoreModalOpen(false)}
                >
                  <X size={22} color={colors.text} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* <ChoreForm /> */}
                <ChoreForm
                  householdId={householdId}
                  onSuccess={() => {
                    setIsChoreModalOpen(false);
                    refreshChores();
                  }}
                  onCancel={() => setIsChoreModalOpen(false)}
                />
              </ScrollView>
            </View>
          </View>
        </Modal>

        {isMobile && (
          <BottomNavigation
            items={[
              { id: "activity", label: "Activity", icon: "list" },
              { id: "chores", label: "Chores", icon: "checkbox", active: true },
              { id: "expenses", label: "Expenses", icon: "receipt" },
              { id: "groceries", label: "Groceries", icon: "cart" },
            ]}
            householdId={householdId}
          />
        )}
      </View>

      {!isMobile && <RightPanel />}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 28,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.text,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "800",
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  choreCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  choreCardCompleted: {
    opacity: 0.6,
  },
  choreIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSoft,
  },
  choreIconSecondary: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSoft,
  },
  choreTitle: {
    fontWeight: "800",
    color: colors.text,
  },
  choreSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: colors.textMuted,
  },
  upcomingList: {
    gap: 14,
    paddingRight: 24,
  },
  upcomingCard: {
    width: 210,
    minHeight: 150,
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    gap: 8,
  },
  upcomingTitle: {
    fontWeight: "800",
    color: colors.text,
  },
  upcomingDescription: {
    fontSize: 13,
    color: colors.textMuted,
  },
  timeTag: {
    fontWeight: "800",
    color: colors.primary,
    marginTop: "auto",
  },
  fab: {
    position: "absolute",
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(30, 18, 15, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    maxHeight: "88%",
    borderRadius: 28,
    backgroundColor: colors.background,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSoft,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  assignedText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});