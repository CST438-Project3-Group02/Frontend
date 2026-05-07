import RightPanel from "@/components/dashboard/RightPanel";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Sidebar from "@/components/layout/Sidebar";
import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, useWindowDimensions } from "react-native";

export default function ExpensesPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { householdId } = useLocalSearchParams<{ householdId: string }>();


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
            { id: "chores", label: "Chores", icon: "checkbox" },
            {
              id: "expenses",
              label: "Expenses",
              icon: "receipt",
              active: true,
            },
            { id: "groceries", label: "Groceries", icon: "cart" },
            { id: "household", label: "My Household", icon: "home" },
          ]}
          householdId={householdId}
        />
      )}

      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{ flex: 1, padding: 24, backgroundColor: colors.background }}
        >
          <ThemedText
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: colors.text,
              marginBottom: 16,
            }}
          >
            Expenses
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 16,
              color: colors.textMuted,
            }}
          >
            Develop expenses page here...
          </ThemedText>
        </View>
        {isMobile && (
          <BottomNavigation
            items={[
              { id: "activity", label: "Activity", icon: "list" },
              { id: "chores", label: "Chores", icon: "checkbox" },
              {
                id: "expenses",
                label: "Expenses",
                icon: "receipt",
                active: true,
              },
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
