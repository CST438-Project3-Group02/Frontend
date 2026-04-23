import RightPanel from "@/components/dashboard/RightPanel";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { View, useWindowDimensions } from "react-native";

export default function ChoresPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const handleNavigation = (id: string) => {
    const routes: Record<string, string> = {
      activity: "/",
      chores: "/chores",
      expenses: "/expenses",
      groceries: "/groceries",
      settings: "/settings",
    };
    if (routes[id]) {
      router.push(routes[id] as any);
    }
  };
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
            { id: "settings", label: "Settings", icon: "settings" },
          ]}
          onItemPress={handleNavigation}
          onRoomiePress={() => router.push("/")}
        />
      )}

      <View style={{ flex: 1, flexDirection: "column" }}>
        <Topbar userName="User" />
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
            Chores
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 16,
              color: colors.textMuted,
            }}
          >
            Develop chores page here...
          </ThemedText>
        </View>
        {isMobile && (
          <BottomNavigation
            items={[
              { id: "activity", label: "Activity", icon: "list" },
              { id: "chores", label: "Chores", icon: "checkbox", active: true },
              { id: "expenses", label: "Expenses", icon: "receipt" },
              { id: "groceries", label: "Groceries", icon: "cart" },
            ]}
            onItemPress={handleNavigation}
          />
        )}
      </View>

      {!isMobile && <RightPanel />}
    </View>
  );
}
