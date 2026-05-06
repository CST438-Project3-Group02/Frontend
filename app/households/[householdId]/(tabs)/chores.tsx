import ChoreForm from "@/components/chores/ChoreForm";
import ChoreList from "@/components/chores/ChoreList";
import RightPanel from "@/components/dashboard/RightPanel";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Bath,
  Brush,
  CheckCircle2,
  Circle,
  Droplets,
  Plus,
  ShoppingCart,
  User,
  Utensils,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

type Chore = {
  id: number;
  title: string;
  subtitle: string;
  completed: boolean;
  icon: React.ElementType;
};

export default function ChoresPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  const [isChoreModalOpen, setIsChoreModalOpen] = useState(false);

  const [chores, setChores] = useState<Chore[]>([
    {
      id: 1,
      title: "Wash the dishes",
      subtitle: "Daily • 10 mins",
      icon: Utensils,
      completed: false,
    },
    {
      id: 2,
      title: "Vacuum living room",
      subtitle: "Weekly • 20 mins",
      icon: Brush,
      completed: false,
    },
  ]);

  const toggleChore = (id: number) => {
    setChores((prev) =>
      prev.map((chore) =>
        chore.id === id ? { ...chore, completed: !chore.completed } : chore
      )
    );
  };

  const incompleteCount = chores.filter((c) => !c.completed).length;

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
            { id: "chat", label: "Chat", icon: "chatbubble" },
            { id: "household", label: "My Household", icon: "home" },
            { id: "settings", label: "Settings", icon: "settings" },
          ]}
          householdId={householdId}
          onRoomiePress={() => router.push("/")}
        />
      )}

      <View style={{ flex: 1 }}>
        <Topbar />

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
            {chores.map((chore) => {
              const Icon = chore.icon;
              const CheckboxIcon = chore.completed
                ? CheckCircle2
                : Circle;

              return (
                <Pressable
                  key={chore.id}
                  onPress={() => toggleChore(chore.id)}
                  style={[
                    styles.choreCard,
                    chore.completed && styles.choreCardCompleted,
                  ]}
                >
                  <View style={styles.choreIcon}>
                    <Icon size={22} color={colors.primary} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <ThemedText
                      style={[
                        styles.choreTitle,
                        chore.completed && styles.completedText,
                      ]}
                    >
                      {chore.title}
                    </ThemedText>

                    <ThemedText style={styles.choreSubtitle}>
                      {chore.subtitle}
                    </ThemedText>
                  </View>

                  <CheckboxIcon
                    size={24}
                    color={
                      chore.completed
                        ? colors.primary
                        : colors.textMuted
                    }
                  />
                </Pressable>
              );
            })}
          </ChoreList>

          {/* Household */}
          <ChoreList
            title="My Household"
            icon={Brush}
            badge="5 tasks"
            badgeType="secondary"
          >
            <View style={styles.choreCard}>
              <View style={styles.choreIconSecondary}>
                <Bath size={22} color={colors.text} />
              </View>

              <View style={{ flex: 1 }}>
                <ThemedText style={styles.choreTitle}>
                  Clean bathroom
                </ThemedText>

                <ThemedText style={styles.choreSubtitle}>
                  Liam • In progress
                </ThemedText>
              </View>
            </View>
          </ChoreList>

          {/* Upcoming */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Upcoming
            </ThemedText>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.upcomingList}
            >
              <View style={styles.upcomingCard}>
                <Droplets size={24} color={colors.primary} />
                <ThemedText style={styles.upcomingTitle}>
                  Water the plants
                </ThemedText>
                <ThemedText style={styles.upcomingDescription}>
                  Don't forget the ferns in the balcony.
                </ThemedText>
                <ThemedText style={styles.timeTag}>
                  Tomorrow
                </ThemedText>
              </View>

              <View style={styles.upcomingCard}>
                <ShoppingCart size={24} color={colors.primary} />
                <ThemedText style={styles.upcomingTitle}>
                  Grocery Restock
                </ThemedText>
                <ThemedText style={styles.upcomingDescription}>
                  Shared trip with Liam to Market St.
                </ThemedText>
                <ThemedText style={styles.timeTag}>
                  Sat, 10 AM
                </ThemedText>
              </View>
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
                <ChoreForm />
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
});