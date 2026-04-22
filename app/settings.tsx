import RightPanel from "@/components/dashboard/RightPanel";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function SettingsPage() {
  const router = useRouter();

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
        flexDirection: "row",
        backgroundColor: "#F3E1DC",
      }}
    >
      <Sidebar
        items={[
          { id: "activity", label: "Activity", icon: "list" },
          { id: "chores", label: "Chores", icon: "checkbox" },
          { id: "expenses", label: "Expenses", icon: "receipt" },
          { id: "groceries", label: "Groceries", icon: "cart" },
          { id: "settings", label: "Settings", icon: "settings", active: true },
        ]}
        onItemPress={handleNavigation}
        onRoomiePress={() => router.push("/")}
      />

      <View style={{ flex: 1, flexDirection: "column" }}>
        <Topbar userName="User" />
        <View style={{ flex: 1, padding: 24, backgroundColor: "#F3E1DC" }}>
          <ThemedText
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#4A342E",
              marginBottom: 16,
            }}
          >
            Settings
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 16,
              color: "#8D746B",
            }}
          >
            Develop settings page here...
          </ThemedText>
        </View>
      </View>

      <RightPanel />
    </View>
  );
}
